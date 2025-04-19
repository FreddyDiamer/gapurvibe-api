import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private generateToken(user: User) {
    const payload = { id: user.id, username: user.username, email: user.email };

    const token = this.jwtService.sign(payload);

    return { token };
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.usersService.findByEmail(loginUserDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user);

    return token;
  }

  async register(createUserDto: CreateUserDto) {
    const isUserExists = await this.usersService.findByEmail(
      createUserDto.email,
    );
    if (isUserExists) {
      throw new UnauthorizedException('User already exists');
    }

    const user = await this.usersService.create(createUserDto);
    const hashPassword = await bcrypt.hash(createUserDto.password, 5);

    const newUser = await this.usersService.create({
      ...user,
      password: hashPassword,
    });

    const token = this.generateToken(newUser);

    return token;
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);

      return payload;
    } catch (error) {
      return null;
    }
  }
}
