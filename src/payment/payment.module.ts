import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Transaction } from './entities//transaction/transaction';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  providers: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
