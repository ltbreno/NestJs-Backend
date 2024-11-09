import { Module } from '@nestjs/common';
import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user';
import { Credentials } from './entities/credentials/credentials';

@Module({
  imports: [TypeOrmModule.forFeature([User, Credentials])],
  controllers: [RegisterController], 
  providers: [RegisterService],
})
export class RegisterModule {}
