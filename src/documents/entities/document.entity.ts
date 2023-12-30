import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from 'mongoose';
@Schema({timestamps: true, versionKey: false})
export class Documents extends Document {
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: string;
  @Prop()
  hash: string;
  @Prop()
  file: string;
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' })
  transactionId: string;
}
export const DocumentsSchema = SchemaFactory.createForClass(Documents);