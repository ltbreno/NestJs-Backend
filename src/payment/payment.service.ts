import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { Transaction } from './entities/transaction/transaction';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-09-30.acacia',
    });
  }

  async createPaymentIntent(paymentMethodId: string, planType: 'monthly' | 'annual'): Promise<any> {
    try {
      const amount =
        planType === 'monthly'
          ? 1000 
          : 12000; 

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount, 
        currency: 'usd',
        automatic_payment_methods: {
          enabled: true,
        }
      });

      const transaction = this.transactionRepository.create({
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount, 
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        paymentMethodId,
      });

      await this.transactionRepository.save(transaction);

      return paymentIntent;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
