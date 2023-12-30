import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

@Schema({timestamps: true, versionKey: false})
export class User extends Document {
  @Prop()
  email: string;
  @Prop()
  password: string;
  @Prop()
  address: string;
  @Prop()
  mnemonicKey: string;
  @Prop()
  sk: string;
  @Prop({ default: true })
  status: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);