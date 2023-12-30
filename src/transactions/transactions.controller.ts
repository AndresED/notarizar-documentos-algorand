import {
  Controller,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import {
  GetInfoAccountDto,
} from './dto/create-transaction.dto';
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}
  @Post('info-account')
  getInfoAccount(@Body() getInfoAccountDto: GetInfoAccountDto) {
    return this.transactionsService.getInfoAccount(getInfoAccountDto.address);
  }
  @Post('info-transaction/:txId')
  getInfoTransacction(@Param('txId') txId: string) {
    return this.transactionsService.getInfoTransacction(txId);
  }
}
