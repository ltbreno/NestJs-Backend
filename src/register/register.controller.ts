import { Controller, Post, Body } from '@nestjs/common';
import { RegisterService } from './register.service';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('register')
@Controller('register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post('register-phone')
  @ApiOperation({ summary: 'Registrar-se com número de telefone' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        phoneNumber: {
          type: 'string',
          example: '+123456789',
          description: 'Número de telefone para registro',
        },
      },
    },
  })
  async registerWithPhone(@Body('phoneNumber') phoneNumber: string) {
    return this.registerService.registerWithPhone(phoneNumber);
  }

  @Post('validate-otp')
  @ApiOperation({ summary: 'Validar OTP e atualizar nome do usuário' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        phoneNumber: {
          type: 'string',
          example: '+123456789',
          description: 'Número de telefone para validação',
        },
        otpCode: {
          type: 'string',
          example: '123456',
          description: 'Código OTP enviado para o número de telefone',
        },
        name: {
          type: 'string',
          example: 'John Doe',
          description: 'Nome do usuário a ser atualizado após a validação do OTP',
        },
      },
    },
  })
  async validateOtpAndUpdateName(
    @Body('phoneNumber') phoneNumber: string,
    @Body('otpCode') otpCode: string,
    @Body('name') name: string,
  ) {
    return this.registerService.validateOtpAndUpdateName(phoneNumber, otpCode, name);
  }

  @Post('register-email')
  @ApiOperation({ summary: 'Registrar-se com email e senha' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'john.doe@example.com',
          description: 'Email do usuário',
        },
        name: {
          type: 'string',
          example: 'John Doe',
          description: 'Nome do usuário',
        },
        password: {
          type: 'string',
          example: 'password123',
          description: 'Senha para o registro',
        },
      },
    },
  })
  async registerWithEmail(
    @Body('email') email: string,
    @Body('name') name: string,
    @Body('password') password: string,
  ) {
    return this.registerService.registerWithEmail(email, name, password);
  }
}
