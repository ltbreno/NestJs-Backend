// src/schedule/schedule.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from './entities/schedule';
import { User } from '../user/entities/user';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  async createSchedule(scheduleData: Partial<Schedule>, userId: string): Promise<Schedule> {
    const newSchedule = this.scheduleRepository.create({
      ...scheduleData,
      user: { id: userId } as User, // Associa o userId ao agendamento
    });
    return await this.scheduleRepository.save(newSchedule);
  }

  async getSchedulesByUserId(userId: string): Promise<Schedule[]> {
    return await this.scheduleRepository.find({
      where: { user: { id: userId } },
    });
  }

  async updateSchedule(id: string, scheduleData: Partial<Schedule>, userId: string): Promise<Schedule> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!schedule) {
      throw new NotFoundException('Agendamento não encontrado');
    }

    Object.assign(schedule, scheduleData);
    return await this.scheduleRepository.save(schedule);
  }

  async deleteSchedule(id: string, userId: string): Promise<void> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!schedule) {
      throw new NotFoundException('Agendamento não encontrado');
    }

    await this.scheduleRepository.delete(id);
  }
}
