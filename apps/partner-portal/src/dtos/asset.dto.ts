import { IsString, IsOptional, IsNumber, IsBoolean, IsDate, MaxLength, MinLength } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateAssetDto {
  @IsOptional()
  @IsNumber()
  parentAssetId?: number;

  @IsString({ message: 'Name must be a string' })
  @MinLength(1, { message: 'Name cannot be empty' })
  @MaxLength(255, { message: 'Name cannot exceed 255 characters' })
  @Transform(({ value }) => String(value || '').trim())
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  foreignModel?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => String(value || '').trim())
  compressorNo?: string;

  @IsOptional()
  @IsNumber()
  customerId?: number;

  @IsOptional()
  @IsNumber()
  productId?: number;

  @IsOptional()
  @IsNumber()
  modelId?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  serialNumberType?: string;

  @IsOptional()
  @IsBoolean()
  isDiscountModel?: boolean;

  @IsOptional()
  @IsBoolean()
  isDraft?: boolean;

  @IsOptional()
  @IsBoolean()
  isArchived?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  status?: string;

  @IsOptional()
  @IsNumber()
  warantyId?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  purchaseDate?: Date;
}

export class UpdateAssetDto {
  @IsOptional()
  @IsNumber()
  parentAssetId?: number;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Transform(({ value }) => String(value || '').trim())
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  foreignModel?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  compressorNo?: string;

  @IsOptional()
  @IsNumber()
  customerId?: number;

  @IsOptional()
  @IsNumber()
  productId?: number;

  @IsOptional()
  @IsNumber()
  modelId?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  serialNumberType?: string;

  @IsOptional()
  @IsBoolean()
  isDiscountModel?: boolean;

  @IsOptional()
  @IsBoolean()
  isDraft?: boolean;

  @IsOptional()
  @IsBoolean()
  isArchived?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  status?: string;

  @IsOptional()
  @IsNumber()
  warantyId?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  purchaseDate?: Date;
}
