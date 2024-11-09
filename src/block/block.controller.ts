import { Controller, Post, Delete, Get, Param, Body, UseGuards } from '@nestjs/common';
import { BlockService } from './block.service';
import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';

@ApiTags('block') // Define uma tag para o Swagger agrupar as rotas de bloqueio
@Controller('block')
export class BlockController {
  constructor(private readonly blockService: BlockService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Bloquear um usuário' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        blockerId: {
          type: 'string',
          example: 1,
          description: 'ID do usuário que está bloqueando',
        },
        blockedUserId: {
          type: 'string',
          example: 2,
          description: 'ID do usuário a ser bloqueado',
        },
      },
    },
  })
  async blockUser(
    @Body('blockerId') blockerId: string,
    @Body('blockedUserId') blockedUserId: string,
  ) {
    return this.blockService.blockUser(blockerId, blockedUserId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  @ApiOperation({ summary: 'Obter a lista de usuários bloqueados' })
  @ApiParam({
    name: 'userId',
    type: 'number',
    description: 'ID do usuário para recuperar a lista de bloqueados',
    example: 1,
  })
  async getBlockedUsers(@Param('userId') userId: string) {
    return this.blockService.getBlockedUsers(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  @ApiOperation({ summary: 'Desbloquear um usuário' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        blockerId: {
          type: 'number',
          example: 1,
          description: 'ID do usuário que está desbloqueando',
        },
        blockedUserId: {
          type: 'number',
          example: 2,
          description: 'ID do usuário a ser desbloqueado',
        },
      },
    },
  })
  async unblockUser(
    @Body('blockerId') blockerId: string,
    @Body('blockedUserId') blockedUserId: string,
  ) {
    return this.blockService.unblockUser(blockerId, blockedUserId);
  }
}
