import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Contest extends Document {
  @Prop({ required: true, unique: true, type: Number })
  year: number;

  @Prop({ type: Types.ObjectId, ref: 'Country', required: true })
  hostCountry: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  colours: string[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Entry' }], default: [] })
  entries: Types.ObjectId[];
}

export const ContestSchema = SchemaFactory.createForClass(Contest);
