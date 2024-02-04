import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Post, User } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto, user: User) {
    const post = await this.prisma.post.create({
      data: {
        ...createPostDto,
        authorId: user.id,
      },
    });

    return post;
  }

  async findOne(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto, user: User) {
    const post = await this.getPost(id);
    this.checkAuthor(post, user);

    const updated = await this.prisma.post.update({
      where: { id },
      data: {
        ...updatePostDto,
      },
    });

    return updated;
  }

  async remove(id: number, user: User) {
    const post = await this.getPost(id);
    this.checkAuthor(post, user);

    await this.prisma.post.delete({
      where: { id },
    });

    return {};
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

  private async getPost(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  private checkAuthor(post: Post, user: User) {
    if (post.authorId !== user.id)
      throw new ForbiddenException('You are not the author of this post');
  }
}
