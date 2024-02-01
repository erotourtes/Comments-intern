import { BadRequestException } from '@nestjs/common';

export class UserAlreadyExists extends BadRequestException {
  constructor() {
    super(`User with this email already exists`);
  }
}

export class UserNotFound extends BadRequestException {
  constructor(id: number) {
    super(`User with this id: ${id} is not found`);
  }
}
