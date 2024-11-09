import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiBody, ApiOperation } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login com email ou número de telefone' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        emailOrPhone: {
          type: 'string',
          example: 'john.doe@example.com',
          description: 'O email ou número de telefone do usuário',
        },
        password: {
          type: 'string',
          example: 'password123',
          description: 'A senha do usuário (apenas para login com email)',
        },
      },
      required: ['emailOrPhone'],
    },
  })
  async login(
    @Body('emailOrPhone') emailOrPhone: string,
    @Body('password') password?: string,
  ) {
    return this.authService.login(emailOrPhone, password);
  }

  @Post('login/validate-otp')
  @ApiOperation({ summary: 'Validar código OTP' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        contact: {
          type: 'string',
          example: 'john.doe@example.com',
          description: 'O contato usado para o login (email ou número de telefone)',
        },
        otpCode: {
          type: 'string',
          example: '123456',
          description: 'O código OTP enviado para o contato',
        },
      },
      required: ['contact', 'otpCode'],
    },
  })
  async validateLoginOtp(
    @Body('contact') contact: string, 
    @Body('otpCode') otpCode: string,
  ) {
    return this.authService.validateLoginOtp(contact, otpCode);
  }
}
