import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Entry extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Country', required: true, index: true })
  country: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Contest', required: true, index: true })
  contest: Types.ObjectId;

  @Prop({ required: true, index: true, type: Number })
  year: number;

  @Prop({ required: true, type: Number })
  place: number;

  @Prop({ required: true, type: String })
  artist: string;

  @Prop({ required: true, type: String })
  title: string;

  @Prop({ default: '', type: String })
  link: string;

  @Prop({ required: true, min: 0, max: 10, type: Number })
  energyRating: number;

  @Prop({ required: true, min: 0, max: 10, type: Number })
  stagingRating: number;

  @Prop({ required: true, min: 0, max: 10, type: Number })
  studioRating: number;

  @Prop({ required: true, min: 0, max: 10, type: Number })
  funRating: number;

  @Prop({ required: true, min: 0, max: 10, type: Number })
  vocalsRating: number;
}

export const EntrySchema = SchemaFactory.createForClass(Entry);

// Compound index for common queries
EntrySchema.index({ year: 1, country: 1 });

// Virtual for calculated total rating
EntrySchema.virtual('totalRating').get(function () {
  return (
    this.energyRating * 0.3 +
    this.stagingRating * 0.3 +
    this.studioRating * 0.15 +
    this.funRating * 0.15 +
    this.vocalsRating * 0.1
  );
});
