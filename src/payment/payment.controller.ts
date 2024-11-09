import { Controller, Post, Body, Get } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction/transaction';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Processar pagamento' }) // Descreve a operação
  @ApiBody({
    description: 'Dados necessários para o pagamento',
    schema: {
      type: 'object',
      properties: {
        paymentMethodId: { type: 'string', description: 'ID do método de pagamento do Stripe' },
        planType: { type: 'string', enum: ['monthly', 'annual'], description: 'Tipo do plano (mensal ou anual)' },
      },
      required: ['paymentMethodId', 'planType'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Pagamento processado com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description: 'Erro ao processar o pagamento.',
  })
  async processPayment(@Body() body: { paymentMethodId: string; planType: 'monthly' | 'annual' }) {
    const { paymentMethodId, planType } = body;
    return this.paymentService.createPaymentIntent(paymentMethodId, planType);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Listar todas as transações' }) // Descreve a operação de listagem
  @ApiResponse({
    status: 200,
    description: 'Lista de transações.',
    type: [Transaction], // Tipagem das transações que serão retornadas
  })
  async getTransactions() {
    return this.transactionRepository.find();
  }
}
