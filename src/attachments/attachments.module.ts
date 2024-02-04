import { Module } from '@nestjs/common';
import { AttachmentsService } from './attachments.service';
import { AttachmentsController } from './attachments.controller';
import { ImageProcessorModule } from '../image-processor/image-processor.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [AttachmentsController],
  providers: [AttachmentsService],
  imports: [ImageProcessorModule, PrismaModule],
})
export class AttachmentsModule {}
