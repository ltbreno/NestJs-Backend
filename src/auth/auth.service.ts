import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as twilio from 'twilio';
import { JwtService } from '@nestjs/jwt';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { Credentials } from 'src/register/entities/credentials/credentials';
import { User } from 'src/user/entities/user';
import * as dotenv from 'dotenv';
import { Resend } from 'resend';

dotenv.config();

@Injectable()
export class AuthService {
  private twilioClient;
  private resendClient: Resend;

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Credentials) private credentialsRepository: Repository<Credentials>,
    private jwtService: JwtService,
  ) {
    this.twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    this.resendClient = new Resend(process.env.RESEND_API_KEY);
  }

  private generateOtpCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private validatePhoneNumber(phoneNumber: string): string {
    const phoneValidation = parsePhoneNumberFromString(phoneNumber, 'US');
    if (!phoneValidation || !phoneValidation.isValid()) {
      throw new BadRequestException('Invalid phone number');
    }
    return phoneValidation.format('E.164');
  }

  private async sendOtp(user: User, contactMethod: 'email' | 'phone'): Promise<void> {
    const otpCode = this.generateOtpCode();
    const otpExpiresAt = new Date();
    otpExpiresAt.setMinutes(otpExpiresAt.getMinutes() + 5); // OTP expiration in 5 minutes

    let credentials = await this.credentialsRepository.findOne({ where: { user } });
    if (!credentials) {
      credentials = new Credentials();
      credentials.user = user;
    }

    credentials.otpCode = otpCode;
    credentials.otpExpiresAt = otpExpiresAt;
    await this.credentialsRepository.save(credentials);

    if (contactMethod === 'phone') {
      await this.twilioClient.messages.create({
        body: `Your login OTP code is: ${otpCode}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: user.phoneNumber,
      });
    } else if (contactMethod === 'email') {
      try {
        await this.resendClient.emails.send({
          from: 'Samba Support <breno@sambaapp.com>',
          to: user.email,
          subject: 'Your OTP Code',
          html: `<strong>Your OTP code is: ${otpCode}</strong>`,
        });
      } catch (error) {
        console.error('Error sending OTP via Resend:', error);
        throw new BadRequestException('Failed to send OTP via email');
      }
    } else {
      throw new BadRequestException('Invalid contact method');
    }
  }

  async login(emailOrPhone: string, password?: string): Promise<{ message: string }> {
    let user: User;

    if (emailOrPhone.includes('@')) {
      // Trata-se de um email
      user = await this.userRepository.findOne({ where: { email: emailOrPhone } });
      if (!user) {
        throw new BadRequestException('Invalid email or password');
      }

      const credentials = await this.credentialsRepository.findOne({ where: { user } });
      if (!credentials || !credentials.password) {
        throw new BadRequestException('Invalid email or password');
      }

      // Verificar a senha
      const isPasswordValid = await bcrypt.compare(password, credentials.password);
      if (!isPasswordValid) {
        throw new BadRequestException('Invalid email or password');
      }

      // Enviar OTP para o email
      await this.sendOtp(user, 'email');
      return { message: 'OTP sent to email for verification' };

    } else {
      // Trata-se de um número de telefone
      const formattedPhoneNumber = this.validatePhoneNumber(emailOrPhone);
      user = await this.userRepository.findOne({ where: { phoneNumber: formattedPhoneNumber } });
      if (!user) {
        throw new BadRequestException('Phone number not registered');
      }

      // Enviar OTP para o telefone
      await this.sendOtp(user, 'phone');
      return { message: 'OTP sent to phone for verification' };
    }
  }

  async validateLoginOtp(phoneNumberOrEmail: string, otpCode: string): Promise<{ accessToken: string }> {
    const isPhone = phoneNumberOrEmail.includes('+');
    let user: User;

    if (isPhone) {
      const formattedPhoneNumber = this.validatePhoneNumber(phoneNumberOrEmail);
      user = await this.userRepository.findOne({ where: { phoneNumber: formattedPhoneNumber } });
    } else {
      user = await this.userRepository.findOne({ where: { email: phoneNumberOrEmail } });
    }

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const credentials = await this.credentialsRepository.findOne({ where: { user } });
    if (!credentials || credentials.otpCode !== otpCode) {
      throw new BadRequestException('Invalid OTP');
    }

    const currentTime = new Date();
    if (credentials.otpExpiresAt < currentTime) {
      throw new BadRequestException('OTP has expired');
    }

    credentials.otpCode = null;
    credentials.otpExpiresAt = null;
    await this.credentialsRepository.save(credentials);

    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}
