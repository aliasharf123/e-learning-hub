import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ForgottenPasswordEntity } from './entities/forgotten-password.entity';
import { EmailVerificationEntity } from './entities/email-verification.entity';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(ForgottenPasswordEntity)
    private readonly forgottenPasswordRepository: Repository<ForgottenPasswordEntity>,
    @InjectRepository(EmailVerificationEntity)
    private readonly emailVerificationRepository: Repository<EmailVerificationEntity>,
  ) {}

  async createForgottenPasswordToken(
    email: string,
  ): Promise<ForgottenPasswordEntity> {
    const forgottenPassword = await this.forgottenPasswordRepository.findOne({
      where: {
        email,
      },
    });

    if (
      forgottenPassword &&
      this.isWithinMinutes(forgottenPassword.timestamp, 15)
    ) {
      throw new HttpException(
        'RESET_PASSWORD.EMAIL_SENT_RECENTLY',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!forgottenPassword) {
      const forgottenPasswordEntity = this.forgottenPasswordRepository.create({
        email: email,
        newPasswordToken: this.generateOTP(),
        timestamp: new Date(),
      });
      await this.forgottenPasswordRepository.save(forgottenPasswordEntity);
      return forgottenPasswordEntity;
    }

    forgottenPassword.newPasswordToken = this.generateOTP();

    await this.forgottenPasswordRepository.save(forgottenPassword);

    return forgottenPassword;
  }

  async createEmailVerificationToken(
    email: string,
  ): Promise<EmailVerificationEntity> {
    const emailVerification = await this.emailVerificationRepository.findOne({
      where: {
        email,
      },
    });

    if (
      emailVerification &&
      this.isWithinMinutes(emailVerification.timestamp, 15)
    ) {
      throw new HttpException(
        'EMAIL_VERIFICATION.EMAIL_SENT_RECENTLY',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!emailVerification) {
      const emailVerificationEntity = this.emailVerificationRepository.create({
        email: email,
        emailToken: this.generateOTP(),
        timestamp: new Date(),
      });
      await this.emailVerificationRepository.save(emailVerificationEntity);
      return emailVerificationEntity;
    }

    emailVerification.emailToken = this.generateOTP();

    await this.emailVerificationRepository.save(emailVerification);

    return emailVerification;
  }

  // Generate a random OTP
  generateOTP(length: number = 5): string {
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += Math.floor(Math.random() * 10).toString();
    }
    return otp;
  }

  isWithinMinutes(timestamp: Date, minutes: number): boolean {
    const differenceInMinutes =
      (new Date().getTime() - timestamp.getTime()) / 60000;
    return differenceInMinutes < minutes;
  }

  async verifyForgottenPasswordOtp(
    email: string,
    otp: string,
    leaveValid = false,
  ): Promise<boolean> {
    const forgottenPassword = await this.forgottenPasswordRepository.findOne({
      where: {
        email,
        newPasswordToken: otp,
      },
    });

    if (!forgottenPassword) {
      return false;
    }

    console.log(forgottenPassword);
    const isExpired = !this.isWithinMinutes(forgottenPassword.timestamp, 15);
    if (isExpired) {
      await this.forgottenPasswordRepository.remove(forgottenPassword);
      return false;
    }
    if (leaveValid) return true;

    await this.forgottenPasswordRepository.remove(forgottenPassword);
    return true;
  }

  async verifyEmailOtp(email: string, otp: string): Promise<boolean> {
    const emailVerification = await this.emailVerificationRepository.findOne({
      where: {
        email,
        emailToken: otp,
      },
    });

    if (!emailVerification) {
      return false;
    }

    const isExpired = !this.isWithinMinutes(emailVerification.timestamp, 15);
    if (isExpired) {
      await this.emailVerificationRepository.remove(emailVerification);
      return false;
    }

    await this.emailVerificationRepository.remove(emailVerification);
    return true;
  }
}
