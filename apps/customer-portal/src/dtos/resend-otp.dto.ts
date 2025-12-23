import {
  IsNumber,
  Min,
  Max,
  IsEnum
} from 'class-validator';

export class ResendOtpDto {
  @IsNumber()
  @Min(0)
  @Max(Number.MAX_SAFE_INTEGER)
  userId: number;

  @IsEnum(['email', 'phone'], { message: 'via must be either email or phone' })
  via: 'email' | 'phone';
}
