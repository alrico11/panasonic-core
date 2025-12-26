import { IsString, IsOptional, IsEmail, MaxLength, MinLength, IsPhoneNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateDealerDto {
  @IsString({ message: 'Name must be a string' })
  @MinLength(1, { message: 'Name cannot be empty' })
  @MaxLength(255, { message: 'Name cannot exceed 255 characters' })
  @Transform(({ value }) => String(value || '').trim())
  name: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @MaxLength(255)
  @Transform(({ value }) => String(value || '').toLowerCase().trim())
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  mobilePhone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  officePhone?: string;
}

export class UpdateDealerDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Transform(({ value }) => String(value || '').trim())
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @MaxLength(255)
  @Transform(({ value }) => String(value || '').toLowerCase().trim())
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  mobilePhone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  officePhone?: string;
}
