import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
export class SenderDto {
  @ApiPropertyOptional()
  skAlgorand: any;
  @ApiPropertyOptional()
  addressAlgorand: string;
}
export class ReceiverDto {
  @ApiPropertyOptional()
  addressAlgorand: string;
}
export class CreateTransactionDto {
  @ApiPropertyOptional()
  sender: SenderDto;
  @ApiPropertyOptional()
  receiver: ReceiverDto;
  @ApiPropertyOptional()
  amount: number;
}

export class GetInfoAccountDto {
  @ApiPropertyOptional()
  address: string;
}

export class CreateTransactionBDDto{
  @IsNotEmpty()
  @IsString()
  txId: string;
  @IsNotEmpty()
  @IsString()
  addressReceiver: string;
  @IsNotEmpty()
  @IsString()
  addressSender: string;
  @IsNotEmpty()
  @IsNumber()
  transactionAmount: number;
  @IsNotEmpty()
  @IsNumber()
  transactionFee: number;
}