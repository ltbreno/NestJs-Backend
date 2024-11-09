// src/schedule/schedule.controller.ts
import { Controller, Post, Get, Put, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { Schedule } from './entities/schedule';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';
import { RequestWithUser } from 'express-request.interface';

@ApiTags('schedules')
@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Cria um novo agendamento para o usuário autenticado' })
  async createSchedule(
    @Body() scheduleData: Partial<Schedule>,
    @Req() req: RequestWithUser,
  ): Promise<Schedule> {
    const userId = req.user?.id; // userId é uma string
    return await this.scheduleService.createSchedule(scheduleData, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Lista todos os agendamentos do usuário autenticado' })
  async getAllSchedules(@Req() req: RequestWithUser): Promise<Schedule[]> {
    const userId = req.user?.id;
    return await this.scheduleService.getSchedulesByUserId(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Atualiza um agendamento específico do usuário autenticado' })
  async updateSchedule(
    @Param('id') id: string,
    @Body() scheduleData: Partial<Schedule>,
    @Req() req: RequestWithUser,
  ): Promise<Schedule> {
    const userId = req.user?.id;
    return await this.scheduleService.updateSchedule(id, scheduleData, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Deleta um agendamento específico do usuário autenticado' })
  async deleteSchedule(@Param('id') id: string, @Req() req: RequestWithUser): Promise<void> {
    const userId = req.user?.id;
    await this.scheduleService.deleteSchedule(id, userId);
  }
}
