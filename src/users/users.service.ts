import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { hashPassword } from '../utils/hash';
import { excludePassword } from '../utils/excludePassword';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: await hashPassword(createUserDto.password),
      },
    });

    return excludePassword(user);
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return excludePassword(user);
  }

  async findByUsername(username: string, includePassword = false) {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    return includePassword ? user : excludePassword(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });

    return excludePassword(user);
  }

  async remove(id: number) {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
