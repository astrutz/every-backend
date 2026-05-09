import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Plant extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  botanicalName?: string;

  @Prop({ required: true })
  wateringInterval: number;

  @Prop()
  sprayingInterval?: number;

  @Prop()
  fertilizingInterval?: number;

  @Prop()
  cuttingInterval?: number;

  @Prop()
  wipingInterval?: number;

  @Prop({ type: Date })
  lastWateredAt?: Date;

  @Prop({ type: Date })
  lastSprayedAt?: Date;

  @Prop({ type: Date })
  lastFertilizedAt?: Date;

  @Prop({ type: Date })
  lastTrimmedAt?: Date;

  @Prop({ type: Date })
  lastWipedAt?: Date;

  @Prop({ default: () => new Date() })
  createdAtDate: Date;

  @Prop({
    required: true,
    enum: [
      'Balkon',
      'Schlafzimmer',
      'Flur',
      'Arbeitszimmer',
      'Wohnzimmer',
      'Babiel',
    ],
  })
  location: string;

  @Prop({
    type: {
      from: Date,
      to: Date,
      wateringInterval: Number,
      sprayingInterval: Number,
      fertilizingInterval: Number,
      cuttingInterval: Number,
      wipingInterval: Number,
    },
    required: false,
  })
  dormantPeriod?: {
    from: Date;
    to: Date;
    wateringInterval?: number;
    sprayingInterval?: number;
    fertilizingInterval?: number;
    cuttingInterval?: number;
    wipingInterval?: number;
  };

  @Prop()
  imageUrl?: string;

  @Prop()
  temperature?: string;

  @Prop()
  lighting?: string;
}

export const PlantSchema = SchemaFactory.createForClass(Plant);

function calculateNext(from: Date, interval: number): Date {
  return new Date(from.getTime() + interval * 24 * 60 * 60 * 1000);
}

function getInterval(plant: any, key: string) {
  const today = new Date();

  if (
    plant.dormantPeriod &&
    plant.dormantPeriod.from &&
    plant.dormantPeriod.to &&
    today >= plant.dormantPeriod.from &&
    today <= plant.dormantPeriod.to
  ) {
    return plant.dormantPeriod[key] || plant[key];
  }

  return plant[key];
}

PlantSchema.virtual('nextWatering').get(function () {
  const interval = getInterval(this, 'wateringInterval');
  return calculateNext(this.createdAtDate, interval);
});

PlantSchema.virtual('nextSpraying').get(function () {
  const interval = getInterval(this, 'sprayingInterval');
  return interval ? calculateNext(this.createdAtDate, interval) : null;
});

PlantSchema.virtual('nextFertilizing').get(function () {
  const interval = getInterval(this, 'fertilizingInterval');
  return interval ? calculateNext(this.createdAtDate, interval) : null;
});

PlantSchema.virtual('nextCutting').get(function () {
  const interval = getInterval(this, 'cuttingInterval');
  return interval ? calculateNext(this.createdAtDate, interval) : null;
});

PlantSchema.virtual('nextWiping').get(function () {
  const interval = getInterval(this, 'wipingInterval');
  return interval ? calculateNext(this.createdAtDate, interval) : null;
});

export interface PlantWithVirtuals extends Plant {
  nextWatering: Date;
  nextSpraying?: Date;
  nextFertilizing?: Date;
  nextCutting?: Date;
  nextWiping?: Date;
}
