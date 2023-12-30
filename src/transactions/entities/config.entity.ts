import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
@Schema({timestamps: true, versionKey: false})
export class Configuration extends Document {
    @Prop()
    address: string;
    @Prop()
    mnemonicKey: string;
    @Prop()
    sk: string;
    @Prop()
    status: boolean;
    @Prop()
    amountOperation: number;
}
export const ConfigurationSchema = SchemaFactory.createForClass(Configuration);