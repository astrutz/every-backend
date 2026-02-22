import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Country extends Document {
  @Prop({ required: true, unique: true, maxlength: 2, type: String })
  code: string;

  @Prop({ required: true, type: String })
  name: string;

  @Prop({ type: String })
  primaryColor?: string;

  @Prop({ type: String })
  secondaryColor?: string;
}

export const CountrySchema = SchemaFactory.createForClass(Country);
