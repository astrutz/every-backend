import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Country extends Document {
  @Prop({ required: true, unique: true, maxlength: 2 })
  code: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  primaryColor?: string;

  @Prop()
  secondaryColor?: string;
}

export const CountrySchema = SchemaFactory.createForClass(Country);
