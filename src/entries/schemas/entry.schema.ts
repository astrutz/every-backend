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

  @Prop({ required: true, index: true })
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

// Add compound index for common queries
EntrySchema.index({ year: 1, country: 1 });

// Add virtual for calculated total rating
EntrySchema.virtual('totalRating').get(function () {
  return (
    this.energyRating * 0.3 +
    this.stagingRating * 0.3 +
    this.studioRating * 0.15 +
    this.funRating * 0.15 +
    this.vocalsRating * 0.1
  );
});
