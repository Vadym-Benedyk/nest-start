import { HttpStatus } from '@nestjs/common';

export interface VerifyAskInterface {
  status: string,
  message: string,
}

export interface VerifyOtpInterface {
  status: HttpStatus,
  message: string,
}