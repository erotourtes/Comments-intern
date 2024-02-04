import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { hashPassword } from '../utils/hash';
import { exclude } from '../utils/excludePassword';

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

    return this.excludePassword(user);
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return this.excludePassword(user);
  }

  async findByUsername(username: string, includePassword = false) {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    return includePassword ? user : this.excludePassword(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });

    return this.excludePassword(user);
  }

  async remove(id: number) {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  private excludePassword(user: any) {
    return exclude(user, ['password']);
  }
}
