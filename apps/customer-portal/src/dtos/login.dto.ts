import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'Email address',
    type: 'string',
    // example: 'alice.smith@example.com'
  })
  email?: string

  @IsOptional()
  @MaxLength(500)
  @IsString()
  @Transform(v => String(v.value || '').toLowerCase())
  @ApiProperty({
    description: 'Mobile phone number',
    type: 'string',
    example: '08111000001'
  })
  phone?: string
}
