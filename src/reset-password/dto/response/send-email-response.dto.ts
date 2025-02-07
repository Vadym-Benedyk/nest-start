import { IsBoolean, IsString, IsOptional } from 'class-validator';

export class SendEmailResponseDto {
  @IsBoolean()
  success: boolean;

  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  error?: string;
}