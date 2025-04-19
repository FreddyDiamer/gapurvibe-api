import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  private async findFreeUsername(username: string): Promise<string> {
    const user = await this.findByUsername(username);
    if (user) {
      const lastNumbers = +(username.match(/\d+$/)?.[0] ?? '0') + 1;
      const newUsername = username + lastNumbers;

      return this.findFreeUsername(newUsername);
    }

    return username;
  }

  async findAll() {
    return await this.usersRepository.find();
  }

  async findOne(id: number) {
    return await this.usersRepository.findOne({ where: { id } });
  }

  async findByUsername(username: string) {
    return await this.usersRepository.findOne({ where: { username } });
  }

  async findByEmail(email: string) {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async create(createUserDto: CreateUserDto) {
    if (!createUserDto.username) {
      const username = createUserDto.email.split('@')[0];
      createUserDto.username = await this.findFreeUsername(username);
    }

    const user = this.usersRepository.create(createUserDto);

    return await this.usersRepository.save(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException();
    }

    Object.assign(user, updateUserDto);

    return await this.usersRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException();
    }

    return this.usersRepository.remove(user);
  }
}
