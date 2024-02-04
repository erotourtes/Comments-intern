import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto) {
    const post = await this.prisma.post.create({
      data: createPostDto,
    });

    return post;
  }

  async findOne(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.prisma.post.update({
      where: { id },
      data: {
        ...updatePostDto,
      },
    });

    return post;
  }

  remove(id: number) {
    this.prisma.post.delete({
      where: { id },
    });
  }

  async findPage(page: number, perPage: number, order: 'asc' | 'desc') {
    const posts = await this.prisma.post.findMany({
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: {
        createdAt: order,
      },
    });

    return posts;
  }
}
