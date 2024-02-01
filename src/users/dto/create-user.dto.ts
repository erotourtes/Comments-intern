import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(255)
  username: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}
