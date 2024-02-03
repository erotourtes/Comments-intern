import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ImageProcessorService } from '../image-processor/image-processor.service';

@Injectable()
export class AttachmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly imageService: ImageProcessorService,
  ) {}

  async create(createAttachmentDto: CreateAttachmentDto) {
    if (createAttachmentDto.format === 'text')
      return await this.createText(createAttachmentDto);
    else return await this.createImage(createAttachmentDto);
  }

  async findOne(id: number) {
    const attachment = await this.prisma.attachment.findUnique({
      where: { id: id },
    });

    return attachment;
  }

  async update(id: number, updateAttachmentDto: UpdateAttachmentDto) {
    if (updateAttachmentDto.format === 'text')
      return await this.updateText(id, updateAttachmentDto);
    else return await this.updateImage(id, updateAttachmentDto);
  }

  async remove(id: number) {
    await this.prisma.attachment.delete({ where: { id: id } });
    return {};
  }

  private async updateText(
    id: number,
    updateAttachmentDto: UpdateAttachmentDto,
  ) {
    return await this.prisma.attachment.update({
      where: { id: id },
      data: {
        format: 'text',
        size: new Blob([updateAttachmentDto.data]).size,
        postId: updateAttachmentDto.postId,
        data: Buffer.from(updateAttachmentDto.data),
      },
    });
  }

  private async updateImage(
    id: number,
    updateAttachmentDto: UpdateAttachmentDto,
  ) {
    const { size, format, imgBuffer } = await this.getImageMetadataFrom(
      updateAttachmentDto.data,
    );

    return await this.prisma.attachment.update({
      where: { id: id },
      data: {
        format: format,
        size: size,
        postId: updateAttachmentDto.postId,
        data: imgBuffer,
      },
    });
  }

  private async createText(createAttachmentDto: CreateAttachmentDto) {
    const attachment = await this.prisma.attachment.create({
      data: {
        format: 'text',
        postId: createAttachmentDto.postId,
        size: new Blob([createAttachmentDto.data]).size,
        data: Buffer.from(createAttachmentDto.data),
      },
    });

    return attachment;
  }

  private async createImage(createAttachmentDto: CreateAttachmentDto) {
    const { size, format, imgBuffer } = await this.getImageMetadataFrom(
      createAttachmentDto.data,
    );

    const attachment = await this.prisma.attachment.create({
      data: {
        format: format,
        postId: createAttachmentDto.postId,
        size: size,
        data: imgBuffer,
      },
    });

    return attachment;
  }

  private bufferFromString64(str: string) {
    const uri = str.split(';base64,').pop();
    if (!uri) throw new BadRequestException('Image is not base64 encoded');
    return Buffer.from(uri, 'base64');
  }

  private async getImageMetadataFrom(data: string) {
    const imgBuffer = this.bufferFromString64(data);

    const { size, format } = await this.imageService
      .isAllowedOrThrow(imgBuffer)
      .catch((e) => {
        console.log(e.message);
        throw new BadRequestException(`${e.message}`);
      });

    return { size, format, imgBuffer };
  }
}
