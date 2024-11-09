import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user';
import { Report } from '../report/entities/report/report';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createReport(reporterId: string, reportedUserId: string, reason: string): Promise<Report> {
    if (reportedUserId === reporterId) {
      throw new BadRequestException('You cannot report yourself');
    }

    const reporter = await this.userRepository.findOneBy({ id:reporterId });
    const reportedUser = await this.userRepository.findOneBy({ id:reportedUserId });

    if (!reporter || !reportedUser) {
      throw new BadRequestException('Invalid reporter or reported user');
    }

    const report = this.reportRepository.create({
      reporterId,
      reportedUserId,
      reason,
      reporter,
      reportedUser,
    });

    return await this.reportRepository.save(report);
  }
}
