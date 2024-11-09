import { Controller, Post, Body, BadRequestException, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ReportService } from './report.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';

@ApiTags('Reports')
@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Criar um relatório de usuário' }) 
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        reporterId: { type: 'integer', example: 1, description: 'ID do usuário que está reportando' },
        reportedUserId: { type: 'integer', example: 2, description: 'ID do usuário que está sendo reportado' },
        reason: { type: 'string', example: 'Inappropriate behavior', description: 'Motivo do relatório' },
      },
      required: ['reporterId', 'reportedUserId', 'reason'],
    },
  })
  @ApiResponse({ status: 201, description: 'Relatório criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Erro de validação. O usuário não pode se reportar.' })
  async createReport(
    @Body('reporterId') reporterId: string,
    @Body('reportedUserId') reportedUserId: string,
    @Body('reason') reason: string,
  ) {
    if (!reporterId || !reportedUserId || !reason) {
      throw new BadRequestException('Missing required fields');
    }

    // Chama o serviço para criar o relatório
    return this.reportService.createReport(reporterId, reportedUserId, reason);
  }
}
