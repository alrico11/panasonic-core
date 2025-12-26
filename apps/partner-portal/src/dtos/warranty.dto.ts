import { IsString, IsOptional, IsNumber, IsBoolean, IsDate, IsEnum, MaxLength, MinLength } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateWarrantyDto {
  @IsOptional()
  @IsNumber()
  customerId?: number;

  @IsOptional()
  @IsNumber()
  dealerId?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => String(value || '').trim())
  factoryExternalId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => String(value || '').trim())
  serialNumber?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  shipmentData?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => String(value || '').trim())
  salesOrderNumber?: string;

  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  purchaseDate?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  purchaseFrom?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  purchaseInvoiceNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  placeOfPurchase?: string;

  @IsOptional()
  @IsBoolean()
  proofOfPurchaseVerified?: boolean;

  @IsOptional()
  @IsString()
  proofOfPurchase?: string;

  @IsOptional()
  @IsString()
  proofOfUploaded?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  currentDateUnderEW?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  ewEndDate?: Date;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  sourceOfRegistration?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  installationDate?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  status?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  registrationDate?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  countryOfOrigin?: string;
}

export class UpdateWarrantyDto {
  @IsOptional()
  @IsNumber()
  customerId?: number;

  @IsOptional()
  @IsNumber()
  dealerId?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  factoryExternalId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  serialNumber?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  shipmentData?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  salesOrderNumber?: string;

  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  purchaseDate?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  purchaseFrom?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  purchaseInvoiceNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  placeOfPurchase?: string;

  @IsOptional()
  @IsBoolean()
  proofOfPurchaseVerified?: boolean;

  @IsOptional()
  @IsString()
  proofOfPurchase?: string;

  @IsOptional()
  @IsString()
  proofOfUploaded?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  currentDateUnderEW?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  ewEndDate?: Date;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  sourceOfRegistration?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  installationDate?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  status?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  registrationDate?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  countryOfOrigin?: string;
}
