import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../user/entities/user'; 
import { Credentials } from '../register/entities/credentials/credentials'; 
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt-strategy/jwt-strategy.service';
import { ConfigModule, ConfigService } from '@nestjs/config'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Credentials]), 
    JwtModule.registerAsync({
      imports: [ConfigModule], 
      inject: [ConfigService], 
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), 
        signOptions: { expiresIn: '1h' }, 
      }),
    }),
    ConfigModule.forRoot(), 
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], 
  exports: [AuthService], 
})
export class AuthModule {}
