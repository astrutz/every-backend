import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Entry extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Country', required: true })
  country: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Contest', required: true })
  contest: Types.ObjectId;

  @Prop({ required: true })
  year: number;

  @Prop({ required: true })
  place: number;

  @Prop({ required: true })
  artist: string;

  @Prop({ required: true })
  title: string;

  @Prop({ default: '' })
  link: string;

  @Prop({ required: true, min: 0, max: 10 })
  energyRating: number;

  @Prop({ required: true, min: 0, max: 10 })
  stagingRating: number;

  @Prop({ required: true, min: 0, max: 10 })
  studioRating: number;

  @Prop({ required: true, min: 0, max: 10 })
  funRating: number;

  @Prop({ required: true, min: 0, max: 10 })
  vocalsRating: number;
}

export const EntrySchema = SchemaFactory.createForClass(Entry);

// Add indexes for faster queries
EntrySchema.index({ year: 1 });
EntrySchema.index({ country: 1, year: 1 });
