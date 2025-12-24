import { IsString, IsOptional, IsNumber, IsBoolean, IsEnum, IsDate, MaxLength, MinLength } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateProductDto {
  @IsString({ message: 'Name must be a string' })
  @MinLength(1, { message: 'Name cannot be empty' })
  @MaxLength(255, { message: 'Name cannot exceed 255 characters' })
  @Transform(({ value }) => String(value || '').trim())
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => String(value || '').trim())
  materialNumber?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expiryDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  launchDate?: Date;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  altDescription?: string;

  @IsOptional()
  @IsEnum(['fixed', 'variable'])
  pricingType?: 'fixed' | 'variable';

  @IsOptional()
  @IsString()
  @MaxLength(50)
  profitCenterWtyIn?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  profitCenterWtyOut?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  profitCenterCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  serviceProfitCenter?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  defaultWarrantyPeriod?: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  quantityUnitOfMeasure?: string;

  @IsOptional()
  @IsNumber()
  modelId?: number;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Transform(({ value }) => String(value || '').trim())
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  materialNumber?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expiryDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  launchDate?: Date;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  altDescription?: string;

  @IsOptional()
  @IsEnum(['fixed', 'variable'])
  pricingType?: 'fixed' | 'variable';

  @IsOptional()
  @IsString()
  profitCenterWtyIn?: string;

  @IsOptional()
  @IsString()
  profitCenterWtyOut?: string;

  @IsOptional()
  @IsString()
  profitCenterCode?: string;

  @IsOptional()
  @IsString()
  serviceProfitCenter?: string;

  @IsOptional()
  @IsString()
  defaultWarrantyPeriod?: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @IsOptional()
  @IsString()
  quantityUnitOfMeasure?: string;

  @IsOptional()
  @IsNumber()
  modelId?: number;
}
