import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Plant, PlantWithVirtuals } from './schemas/plant.schema';
import { UpdatePlantDto } from './dto/update-plant.dto';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdateCareDto } from './dto/update-care.dto';
import { SnoozePlantDto } from './dto/snooze-plant.dto';

@Injectable()
export class PlantService {
  constructor(@InjectModel(Plant.name) private plantModel: Model<Plant>) {}

  async findAll(): Promise<Plant[]> {
    return this.plantModel.find().exec();
  }

  async findOne(id: string): Promise<Plant> {
    const plant = await this.plantModel.findById(id).exec();
    if (!plant) {
      throw new NotFoundException(`Plant with ID ${id} not found`);
    }
    return plant;
  }

  async create(createPlantDto: CreatePlantDto): Promise<Plant> {
    const plant = new this.plantModel(createPlantDto);
    return plant.save();
  }

  async updateCareBulk(
    dto: UpdateCareDto,
  ): Promise<{ message: string; updated: number }> {
    const now = new Date();

    const ops = [];

    if (dto.watered?.length) {
      ops.push(
        this.plantModel.updateMany(
          { _id: { $in: dto.watered } },
          { $set: { lastWateredAt: now } },
        ),
      );
    }

    if (dto.sprayed?.length) {
      ops.push(
        this.plantModel.updateMany(
          { _id: { $in: dto.sprayed } },
          { $set: { lastSprayedAt: now } },
        ),
      );
    }

    if (dto.fertilized?.length) {
      ops.push(
        this.plantModel.updateMany(
          { _id: { $in: dto.fertilized } },
          { $set: { lastFertilizedAt: now } },
        ),
      );
    }

    if (dto.trimmed?.length) {
      ops.push(
        this.plantModel.updateMany(
          { _id: { $in: dto.trimmed } },
          { $set: { lastTrimmedAt: now } },
        ),
      );
    }

    if (dto.wiped?.length) {
      ops.push(
        this.plantModel.updateMany(
          { _id: { $in: dto.wiped } },
          { $set: { lastWipedAt: now } },
        ),
      );
    }

    await Promise.all(ops);

    return { message: 'Care data updated successfully', updated: ops.length };
  }

  async snooze(id: string, snoozePlantDto: SnoozePlantDto): Promise<Plant> {
    const update: any = {};

    if (snoozePlantDto.wateringUntil) {
      update['snooze.wateringUntil'] = new Date(snoozePlantDto.wateringUntil);
    }

    if (snoozePlantDto.sprayingUntil) {
      update['snooze.sprayingUntil'] = new Date(snoozePlantDto.sprayingUntil);
    }

    if (snoozePlantDto.fertilizingUntil) {
      update['snooze.fertilizingUntil'] = new Date(
        snoozePlantDto.fertilizingUntil,
      );
    }

    if (snoozePlantDto.cuttingUntil) {
      update['snooze.cuttingUntil'] = new Date(snoozePlantDto.cuttingUntil);
    }

    if (snoozePlantDto.wipingUntil) {
      update['snooze.wipingUntil'] = new Date(snoozePlantDto.wipingUntil);
    }

    const plant = await this.plantModel.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true },
    );

    if (!plant) {
      throw new NotFoundException(`Plant with ID ${id} not found`);
    }

    return plant;
  }

  async update(id: string, updatePlantDto: UpdatePlantDto): Promise<Plant> {
    const plant = await this.plantModel.findByIdAndUpdate(id, updatePlantDto, {
      returnDocument: 'after',
    });
    if (!plant) {
      throw new NotFoundException(`Plant with ID ${id} not found`);
    }
    return plant;
  }

  async delete(id: string): Promise<void> {
    const result = await this.plantModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Plant with ID ${id} not found`);
    }
  }

  async getTasks() {
    const plants = await this.findAll();

    const groups: Record<string, Map<string, PlantWithVirtuals>> = {};

    plants.forEach((plant: any) => {
      const plantObj = plant.toObject({ virtuals: true });
      const plantId = plantObj._id.toString();

      const tasks = [
        plant.nextWatering,
        plant.nextSpraying,
        plant.nextFertilizing,
        plant.nextWiping,
        plant.nextCutting,
      ].filter((d): d is Date => d instanceof Date);

      tasks.forEach((date) => {
        const day = date.toISOString().split('T')[0];

        if (!groups[day]) {
          groups[day] = new Map();
        }

        groups[day].set(plantId, plantObj);
      });
    });

    return Object.entries(groups)
      .map(([day, plantMap]) => ({
        day,
        plants: Array.from(plantMap.values()),
      }))
      .sort((a, b) => a.day.localeCompare(b.day));
  }
}
