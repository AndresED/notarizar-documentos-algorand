import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionSchema } from './entities/transaction.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService],
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: 'Transaction', schema: TransactionSchema },
    ]),
  ]
})
export class TransactionsModule {}
