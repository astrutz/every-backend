import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Entry } from './schemas/entry.schema';
import { CreateEntryDto, UpdateEntryDto } from './dto/create-entry.dto';

@Injectable()
export class EntriesService {
  constructor(@InjectModel(Entry.name) private entryModel: Model<Entry>) {}

  async findAll(year?: number, countryCode?: string): Promise<Entry[]> {
    const filter: any = {};

    if (year) {
      filter.year = year;
    }

    // Build query
    let query = this.entryModel
      .find(filter)
      .populate('country')
      .populate({
        path: 'contest',
        select: 'year colours', // Only select year and colours
        populate: {
          path: 'hostCountry',
          select: 'code name', // Only code and name
        },
      });

    // Execute query
    let entries = await query.exec();

    // Filter by country code if provided (after population)
    if (countryCode) {
      entries = entries.filter(
        (entry: any) => entry.country?.code === countryCode.toUpperCase(),
      );
    }

    return entries;
  }

  async findOne(id: string): Promise<Entry> {
    const entry = await this.entryModel
      .findById(id)
      .populate('country')
      .populate({
        path: 'contest',
        select: 'year colours',
        populate: {
          path: 'hostCountry',
          select: 'code name', // Only code and name
        },
      })
      .exec();

    if (!entry) {
      throw new NotFoundException(`Entry with ID ${id} not found`);
    }
    return entry;
  }

  async create(createEntryDto: CreateEntryDto): Promise<Entry> {
    const entry = new this.entryModel(createEntryDto);
    return entry.save();
  }

  async update(id: string, updateEntryDto: UpdateEntryDto): Promise<Entry> {
    const entry = await this.entryModel
      .findByIdAndUpdate(id, updateEntryDto, { new: true })
      .populate('country')
      .populate({
        path: 'contest',
        select: 'year colours',
        populate: {
          path: 'hostCountry',
          select: 'code name', // Only code and name
        },
      })
      .exec();

    if (!entry) {
      throw new NotFoundException(`Entry with ID ${id} not found`);
    }
    return entry;
  }

  async delete(id: string): Promise<void> {
    const result = await this.entryModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Entry with ID ${id} not found`);
    }
  }
}
