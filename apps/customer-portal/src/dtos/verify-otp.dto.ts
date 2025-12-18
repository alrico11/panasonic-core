import {
  MaxLength,
  IsNumber,
  IsString,
  Min,
  Max,
  Matches,
  Length
} from 'class-validator';


export class VerifyOtpDto {
  @IsNumber()
  @Min(0)
  @Max(Number.MAX_SAFE_INTEGER)
  userId: number;

  @IsString()
  @Length(6,6)
  @Matches(/^[0-9]{6}$/,{message: 'Invalid OTP Code'})
  /** 6 digit otp-code (0-9) */
  code: string
}
