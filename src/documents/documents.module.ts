import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentsSchema } from './entities/document.entity';
import { TransactionsService } from '../transactions/transactions.service';
import { ConfigurationSchema } from '../transactions/entities/config.entity';
import { UserSchema } from '../users/entities/user.entity';
import { TransactionSchema } from '../transactions/entities/transaction.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService, TransactionsService],
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: 'Documents', schema: DocumentsSchema },
      { name: 'Configuration', schema: ConfigurationSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Transaction', schema: TransactionSchema },
    ]),
  ]
})
export class DocumentsModule {}
