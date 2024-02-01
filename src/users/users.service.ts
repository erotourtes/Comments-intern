import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserAlreadyExists, UserNotFound } from './exceptions/UserExceptions';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const isExist = this.findByEmail(createUserDto.email);
    if (isExist) throw new UserAlreadyExists();

    try {
      const user = await this.prisma.user.create({
        data: createUserDto,
      });

      return user;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const isExist = await this.findOne(id);
    if (!isExist) throw new UserNotFound(id);

    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });

    return user;
  }

  async remove(id: number) {
    const isExist = await this.findOne(id);
    if (!isExist) throw new UserNotFound(id);

    this.prisma.user.delete({
      where: { id },
    });
  }
}
