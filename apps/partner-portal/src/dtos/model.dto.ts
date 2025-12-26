import { IsString, IsOptional, IsNumber, IsEnum, MaxLength, MinLength } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateModelDto {
  @IsString({ message: 'Name must be a string' })
  @MinLength(1, { message: 'Name cannot be empty' })
  @MaxLength(255, { message: 'Name cannot exceed 255 characters' })
  @Transform(({ value }) => String(value || '').trim())
  name: string;

  @IsNumber({}, { message: 'Price must be a number' })
  @Type(() => Number)
  price: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => String(value || '').trim())
  regionalCategory?: string;
}

export class UpdateModelDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Transform(({ value }) => String(value || '').trim())
  name?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Price must be a number' })
  @Type(() => Number)
  price?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  regionalCategory?: string;
}
