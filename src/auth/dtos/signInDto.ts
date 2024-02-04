import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(255)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(255)
  password: string;
}
