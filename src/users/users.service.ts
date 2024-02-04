import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { hashPassword } from '../utils/hash';
import { excludePassword } from '../utils/excludePassword';
import { User } from '@prisma/client';

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

    if (!user) throw new BadRequestException('User not found');

    return excludePassword(user);
  }

  async findByUsername(
    username: string,
    includePassword = false,
  ): Promise<User | Omit<User, 'password'>> {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) throw new BadRequestException('User not found');

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

  restrictToSameUser(executor: User, id: number) {
    if (executor.id !== id)
      throw new ForbiddenException('You are not allowd to change other user');
  }
}
