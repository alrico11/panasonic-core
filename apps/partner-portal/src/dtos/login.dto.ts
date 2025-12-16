import { Transform } from 'class-transformer';
import {
  MaxLength,
  IsEmail,
  IsString
} from 'class-validator';


export class LoginDto {
  @IsEmail({ allow_display_name: false, allow_ip_domain: false })
  @MaxLength(500)
  @IsString()
  @Transform(v => String(v.value || '').toLowerCase())
  email: string

  @MaxLength(500)
  @IsString()
  password: string
}
