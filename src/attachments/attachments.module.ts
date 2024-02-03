import { Module } from '@nestjs/common';
import { AttachmentsService } from './attachments.service';
import { AttachmentsController } from './attachments.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ImageProcessorModule } from '../image-processor/image-processor.module';

@Module({
  controllers: [AttachmentsController],
  providers: [AttachmentsService, PrismaService],
  imports: [ImageProcessorModule],
})
export class AttachmentsModule {}
