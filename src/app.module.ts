import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { PrismaModule } from './prisma/prisma.module';
import { AttachmentsModule } from './attachments/attachments.module';
import { ImageProcessorService } from './image-processor/image-processor.service';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [UsersModule, PostsModule, PrismaModule, AttachmentsModule],
  providers: [ImageProcessorService, PrismaService],
})
export class AppModule {}
