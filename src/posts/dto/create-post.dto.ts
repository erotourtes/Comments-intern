import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @MaxLength(191)
  title: string;

  @IsString()
  @MinLength(1)
  @MaxLength(65_535)
  content: string;

  @IsString()
  @MaxLength(191)
  homepageUrl?: string;
}
