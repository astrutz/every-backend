import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Entry } from './schemas/entry.schema';
import { CreateEntryDto, UpdateEntryDto } from './dto/create-entry.dto';

@Injectable()
export class EntriesService {
  constructor(@InjectModel(Entry.name) private entryModel: Model<Entry>) {}

  async findAll(): Promise<Entry[]> {
    return this.entryModel
      .find()
      .populate('country')
      .populate('contest')
      .exec();
  }

  async findByYear(year: number): Promise<Entry[]> {
    return this.entryModel
      .find({ year })
      .populate('country')
      .populate('contest')
      .exec();
  }

  async findOne(id: string): Promise<Entry> {
    const entry = await this.entryModel
      .findById(id)
      .populate('country')
      .populate('contest')
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
      .populate('contest')
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
