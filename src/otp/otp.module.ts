import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailVerificationEntity } from './entities/email-verification.entity';
import { ForgottenPasswordEntity } from './entities/forgotten-password.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EmailVerificationEntity,
      ForgottenPasswordEntity,
    ]),
  ],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
