import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as twilio from 'twilio';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { User } from 'src/user/entities/user';
import { Credentials } from './entities/credentials/credentials';
import * as dotenv from 'dotenv';
import axios from 'axios'; 
import { Resend } from 'resend';

dotenv.config();

@Injectable()
export class RegisterService {
  private twilioClient;
  private resendClient: Resend;

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Credentials) private credentialsRepository: Repository<Credentials>,
  ) {
    const accountSid = "AC5e8623745a26cb6cf8c6b94770d8a4c3"
    const authToken = "4470142dbb95bb66644eb0483b0e12e6"
    this.twilioClient = twilio(accountSid, authToken)
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

  private async sendOtpEmail(email: string, otpCode: string) {
    try {
    await this.resendClient.emails.send({
      from: 'Samba Support <breno@sambaapp.com>',
      to: email,
      subject: 'Your OTP Code',
      html: `<strong>Your OTP code is: ${otpCode}</strong>`,
    });
  }catch (error) {
    console.error('Error sending OTP via Resend:', error);
    throw new BadRequestException('Failed to send OTP via email');
  }
} 

  private async sendOtp(user: User, otpCode: string) {
    if (user.email) {
      await this.sendOtpEmail(user.email, otpCode);
    } else if (user.phoneNumber) {
      this.twilioClient.verify.v2.services(process.env.TWILIO_ACCOUNT_SERVICES)
      .verifications
      .create({
        to: user.phoneNumber,
        channel: 'sms'
      })
      .then(verification => console.log(verification.sid));
    } else {
      throw new BadRequestException('User must have an email or phone number to send OTP');
    }
  }

  async registerWithEmail(email: string, name: string, password: string): Promise<User> {
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User();
    user.email = email;

    const savedUser = await this.userRepository.save(user);

    const otpCode = this.generateOtpCode();
    const otpExpiresAt = new Date();
    otpExpiresAt.setMinutes(otpExpiresAt.getMinutes() + 5);

    const credentials = new Credentials();
    credentials.password = hashedPassword;
    credentials.otpCode = otpCode;
    credentials.otpExpiresAt = otpExpiresAt;
    credentials.user = savedUser;

    await this.credentialsRepository.save(credentials);

    await this.sendOtp(savedUser, otpCode);

    return savedUser;
  }

  async registerWithPhone(phoneNumber: string): Promise<User> {
    const formattedPhoneNumber = this.validatePhoneNumber(phoneNumber);

    const otpCode = this.generateOtpCode();
    const otpExpiresAt = new Date();
    otpExpiresAt.setMinutes(otpExpiresAt.getMinutes() + 5);

    const existingUser = await this.userRepository.findOne({ where: { phoneNumber: formattedPhoneNumber } });
    if (existingUser) {
      throw new BadRequestException('Phone number already registered');
    }

    const user = new User();
    user.phoneNumber = formattedPhoneNumber;
    const savedUser = await this.userRepository.save(user);

    const credentials = new Credentials();
    credentials.otpCode = otpCode;
    credentials.otpExpiresAt = otpExpiresAt;
    credentials.user = savedUser;

    await this.credentialsRepository.save(credentials);

    await this.sendOtp(savedUser, otpCode);

    return savedUser;
  }

  async validateOtpAndUpdateName(phoneNumberOrEmail: string, otpCode: string, name: string): Promise<User> {
    let user: User;

    if (phoneNumberOrEmail.includes('@')) {
      user = await this.userRepository.findOne({ where: { email: phoneNumberOrEmail } });
    } else {
      const formattedPhoneNumber = this.validatePhoneNumber(phoneNumberOrEmail);
      user = await this.userRepository.findOne({ where: { phoneNumber: formattedPhoneNumber } });
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

    user.name = name;
    await this.userRepository.save(user);

    credentials.otpCode = null;
    credentials.otpExpiresAt = null;
    await this.credentialsRepository.save(credentials);

    return user;
  }
}
