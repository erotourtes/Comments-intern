import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import config from '../../config';
import { ParseOrderPipe } from '../utils/ParseOrderPipe';
import { AuthGuard } from '../auth/auth.guard';
import { user } from '../auth/user.decorator';
import { User } from '@prisma/client';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createPostDto: CreatePostDto, @user() user: User) {
    return this.postsService.create(createPostDto, user);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(id);
  }

  @Get('page/:page')
  getPostsPage(
    @Param('page', ParseIntPipe) page: number,
    @Query('take', ParseIntPipe) take: number = config.pagination.take,
    @Query('order', ParseOrderPipe) order: 'asc' | 'desc',
  ) {
    return this.postsService.findPage(page, take, order);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
    @user() user: User,
  ) {
    return this.postsService.update(id, updatePostDto, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id', ParseIntPipe) id: number, @user() user: User) {
    return this.postsService.remove(id, user);
  }
}
