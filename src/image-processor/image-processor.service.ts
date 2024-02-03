import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import config from '../../config';

const imgConfig = config.image;

@Injectable()
export class ImageProcessorService {
  async isAllowedOrThrow(
    imgBuffer,
    maxSize: number = imgConfig.maxSize,
    allowedFormats: string[] = imgConfig.allowedFormats,
  ) {
    const { size, format } = await sharp(imgBuffer)
      .metadata()
      .catch(() => {
        throw new Error('Wrong formatted image buffer');
      });

    if (size > maxSize)
      throw new Error(`Image size ${size} is larger than ${maxSize}`);
    if (!allowedFormats.includes(format))
      throw new Error(
        `Image format ${format} is not in allowed formats ${allowedFormats.join(',')}`,
      );

    return { size, format };
  }

  async coerceImgToDefaults(imgBuffer: Buffer) {
    return await this.coerceImgTo(
      imgBuffer,
      imgConfig.maxWidth,
      imgConfig.maxHeight,
    );
  }

  async coerceImgTo(
    imgBuffer: Buffer,
    maxWidth: number,
    maxHeight: number,
  ): Promise<Buffer> {
    const image = await sharp(imgBuffer);
    const { width, height } = await image.metadata();
    if (width <= maxWidth && height <= maxHeight) return imgBuffer;

    const dx = width / maxWidth;
    const dy = height / maxHeight;

    const newImgBuffer = await image
      .resize({
        width: dx > dy ? maxWidth : Math.floor((width * maxHeight) / height),
        height: dx > dy ? Math.floor((height * maxWidth) / width) : maxHeight,
        fit: 'cover',
      })
      .toBuffer();

    return newImgBuffer;
  }
}
