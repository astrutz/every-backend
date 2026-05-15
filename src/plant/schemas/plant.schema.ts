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
  birthDate: Date;

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

  @Prop({
    type: {
      wateringUntil: Date,
      sprayingUntil: Date,
      fertilizingUntil: Date,
      cuttingUntil: Date,
      wipingUntil: Date,
    },
  })
  snooze?: {
    wateringUntil?: Date;
    sprayingUntil?: Date;
    fertilizingUntil?: Date;
    cuttingUntil?: Date;
    wipingUntil?: Date;
  };

  @Prop()
  imageUrl?: string;

  @Prop()
  temperature?: string;

  @Prop()
  lighting?: string;
}

export const PlantSchema = SchemaFactory.createForClass(Plant);

function calculateNext(from: Date, interval?: number): Date | null {
  if (!interval) {
    return null;
  }
  return new Date(from.getTime() + interval * 24 * 60 * 60 * 1000);
}

function getInterval(plant: Plant, key: keyof Plant): number | undefined {
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

  return +(plant[key]);
}

function applySnooze(
  plant: any,
  type: 'watering' | 'spraying' | 'fertilizing' | 'cutting' | 'wiping',
  calculatedDate: Date | null,
) {
  if (!calculatedDate) return null;

  const snoozeUntil = plant.snooze?.[`${type}Until`];

  if (snoozeUntil && snoozeUntil > new Date()) {
    return snoozeUntil;
  }

  return calculatedDate;
}

PlantSchema.virtual('nextWatering').get(function () {
  const interval = getInterval(this, 'wateringInterval');
  const baseDate = this.lastWateredAt || this.birthDate;

  const calculated = calculateNext(baseDate, interval);

  return applySnooze(this, 'watering', calculated);
});

PlantSchema.virtual('nextSpraying').get(function () {
  const interval = getInterval(this, 'sprayingInterval');
  const baseDate = this.lastSprayedAt || this.birthDate;

  const calculated = calculateNext(baseDate, interval);

  return applySnooze(this, 'spraying', calculated);
});

PlantSchema.virtual('nextFertilizing').get(function () {
  const interval = getInterval(this, 'fertilizingInterval');
  const baseDate = this.lastFertilizedAt || this.birthDate;

  const calculated = calculateNext(baseDate, interval);

  return applySnooze(this, 'fertilizing', calculated);
});

PlantSchema.virtual('nextCutting').get(function () {
  const interval = getInterval(this, 'cuttingInterval');
  const baseDate = this.lastTrimmedAt || this.birthDate;

  const calculated = calculateNext(baseDate, interval);

  return applySnooze(this, 'cutting', calculated);
});

PlantSchema.virtual('nextWiping').get(function () {
  const interval = getInterval(this, 'wipingInterval');
  const baseDate = this.lastWipedAt || this.birthDate;

  const calculated = calculateNext(baseDate, interval);

  return applySnooze(this, 'wiping', calculated);
});

export interface PlantWithVirtuals extends Plant {
  nextWatering: Date;
  nextSpraying?: Date;
  nextFertilizing?: Date;
  nextCutting?: Date;
  nextWiping?: Date;
}

export enum PlantLocation {
  Balkon = 'Balkon',
  Schlafzimmer = 'Schlafzimmer',
  Flur = 'Flur',
  Arbeitszimmer = 'Arbeitszimmer',
  Wohnzimmer = 'Wohnzimmer',
  Babiel = 'Babiel',
}
