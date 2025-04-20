import {
  ValidationPipe,
  ValidationError,
  BadRequestException,
} from '@nestjs/common';

export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      transform: true,
      whitelist: true,
      exceptionFactory: (validationErrors: ValidationError[]) => {
        const errors = this.formatErrors(validationErrors);
        return new BadRequestException({
          statusCode: 400,
          errors,
          message: 'Validation failed',
        });
      },
    });
  }

  private formatErrors(errors: ValidationError[]) {
    return errors.reduce((acc, error) => {
      acc[error.property] = {
        value: error.value,
        constraints: error.constraints,
        code: this.getErrorCode(error),
      };
      return acc;
    }, {});
  }

  private getErrorCode(error: ValidationError): string {
    // Определение кода ошибки на основе типа ограничения
    const constraint = Object.keys(error.constraints ?? {})[0];
    switch (constraint) {
      case 'isEmail':
        return 'INVALID_EMAIL_FORMAT';
      case 'minLength':
        return 'VALUE_TOO_SHORT';
      case 'maxLength':
        return 'VALUE_TOO_LONG';
      case 'isNotEmpty':
        return 'VALUE_REQUIRED';
      default:
        return 'VALIDATION_FAILED';
    }
  }
}
