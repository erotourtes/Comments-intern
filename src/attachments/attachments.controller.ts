import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthGuard } from '../auth/auth.guard';
import { user } from '../auth/user.decorator';
import { AttachmentsService } from './attachments.service';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';

@Controller('attachments')
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createAttachmentDto: CreateAttachmentDto, @user() user: User) {
    return this.attachmentsService.create(createAttachmentDto, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attachmentsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAttachmentDto: UpdateAttachmentDto,
    @user() user: User,
  ) {
    await this.attachmentsService.checkAuthor(id, user);
    return this.attachmentsService.update(id, updateAttachmentDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id', ParseIntPipe) id: number, @user() user: User) {
    await this.attachmentsService.checkAuthor(id, user);
    return this.attachmentsService.remove(id);
  }
}
