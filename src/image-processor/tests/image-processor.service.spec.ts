import { Test, TestingModule } from '@nestjs/testing';
import { ImageProcessorService } from '../image-processor.service';
import * as Path from 'node:path';
import * as fs from 'node:fs/promises';
import * as sharp from 'sharp';

const getImgBuffer = async (imageRelativePath: string) => {
  const imagePath = Path.join(__dirname, imageRelativePath);
  const image = await fs.readFile(imagePath);
  const buffer = Buffer.from(image);
  return buffer;
};

describe('ImageProcessorService', () => {
  let service: ImageProcessorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImageProcessorService],
    }).compile();

    service = module.get<ImageProcessorService>(ImageProcessorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should not throw', async () => {
    const imageFile = './8.6kb.jpg';
    const buffer = await getImgBuffer(imageFile);
    await service.isAllowedOrThrow(buffer);
  });

  it('should throw image is larger', async () => {
    const imageFile = './24.8kb.jpg';
    const buffer = await getImgBuffer(imageFile);

    try {
      await service.isAllowedOrThrow(buffer);
      expect(true).toBe(false);
    } catch (e) {
      expect(e.message).toContain('size');
    }
  });

  it('should throw wrong image format', async () => {
    const imageFile = 'webpFormat.webp';
    const buffer = await getImgBuffer(imageFile);

    try {
      await service.isAllowedOrThrow(buffer, 50_000);
      expect(true).toBe(false);
    } catch (e) {
      expect(e.message).toContain('format');
    }
  });

  it('should not compress image', async () => {
    const imageFile = './8.6kb.jpg';
    const buffer = await getImgBuffer(imageFile);

    const newBuffer = await service.coerceImgToDefaults(buffer);
    const { width, height } = await sharp(newBuffer).metadata();

    expect(width).toBe(275);
    expect(height).toBe(183);
  });

  it('should compress image', async () => {
    //550x368
    // defaults 320x240
    const imageFile = './webpFormat.webp';
    const buffer = await getImgBuffer(imageFile);

    const newImgBuffer = await service.coerceImgToDefaults(buffer);
    const { width, height } = await sharp(newImgBuffer).metadata();
    expect(width).toBe(320);
    expect(height).toBe(214);
  });
});
