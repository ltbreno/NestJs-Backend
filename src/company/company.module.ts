// src/company/company.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from '../company/entities/company';
import { Review } from '../review/entities/review/review';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Company, Review])],
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule {}
