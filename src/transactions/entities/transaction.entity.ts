import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
@Schema({timestamps: true, versionKey: false})
export class Transaction extends Document {
  @Prop()
  txId: string;
  @Prop()
  addressReceiver: string;
  @Prop()
  addressSender: string;
  @Prop()
  transactionAmount: number;
  @Prop()
  transactionFee: number;
}
export const TransactionSchema = SchemaFactory.createForClass(Transaction);