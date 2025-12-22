import { Transform } from 'class-transformer';
import {
  MaxLength,
  IsEmail,
  IsString,
  IsOptional,
  IsBooleanString
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

  @IsOptional()
  @Transform(v => String(v.value || '').toLowerCase() === 'true')
  remember?: boolean
}

export class ForgotPasswordRequestDto {
  @IsEmail({ allow_display_name: false, allow_ip_domain: false })
  @MaxLength(500)
  @IsString()
  @Transform(v => String(v.value || '').toLowerCase())
  email: string
}

export class ForgotPasswordCheckDto {
  @MaxLength(255)
  @IsString()
  code: string
}

export class ForgotPasswordDto {
  @IsString()
  password: string

  @MaxLength(255)
  @IsString()
  code: string
}
