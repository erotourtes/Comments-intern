import {
  IsIn,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateAttachmentDto {
  @IsString()
  @MinLength(1)
  @MaxLength(191)
  fileName: string;

  @IsString()
  @IsIn(['text', 'image'])
  format: 'text' | 'image';

  @IsString()
  data: string;

  @IsNumber()
  postId: number;
}
