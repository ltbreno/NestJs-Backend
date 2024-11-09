import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './entities/report/report';
import { User } from '../user/entities/user';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Report, User]), 
  ],
  providers: [ReportService],
  controllers: [ReportController],
})
export class ReportModule {}
