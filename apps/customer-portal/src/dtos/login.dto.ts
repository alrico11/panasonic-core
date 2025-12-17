import { Transform } from 'class-transformer';
import {
  MaxLength,
  IsEmail,
  IsString,
  IsOptional
} from 'class-validator';


export class LoginDto {

  @IsOptional()
  @IsEmail({ allow_display_name: false, allow_ip_domain: false })
  @MaxLength(500)
  @IsString()
  @Transform(v => String(v.value || '').toLowerCase())
  email?: string

  @IsOptional()
  @MaxLength(500)
  @IsString()
  @Transform(v => String(v.value || '').toLowerCase())
  phone?: string
}
