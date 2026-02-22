import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contest } from './schemas/contest.schema';
import { CreateContestDto, UpdateContestDto } from './dto/create-contest.dto';

@Injectable()
export class ContestsService {
  constructor(
    @InjectModel(Contest.name) private contestModel: Model<Contest>,
  ) {}

  async findAll(): Promise<Contest[]> {
    return this.contestModel
      .find()
      .select('year colours')
      .populate('hostCountry', 'code name') // Only code and name
      .populate({
        path: 'entries',
        populate: {
          path: 'country',
          select: 'code name primaryColor secondaryColor',
        },
      })
      .sort({ year: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Contest> {
    const contest = await this.contestModel
      .findById(id)
      .select('year colours')
      .populate('hostCountry', 'code name') // Only code and name
      .populate({
        path: 'entries',
        populate: {
          path: 'country',
          select: 'code name primaryColor secondaryColor',
        },
      })
      .exec();

    if (!contest) {
      throw new NotFoundException(`Contest with ID ${id} not found`);
    }
    return contest;
  }

  async findByYear(year: number): Promise<Contest> {
    const contest = await this.contestModel
      .findOne({ year })
      .select('year colours')
      .populate('hostCountry', 'code name') // Only code and name
      .populate({
        path: 'entries',
        populate: {
          path: 'country',
          select: 'code name primaryColor secondaryColor',
        },
      })
      .exec();

    if (!contest) {
      throw new NotFoundException(`Contest for year ${year} not found`);
    }
    return contest;
  }

  async create(createContestDto: CreateContestDto): Promise<Contest> {
    const contest = new this.contestModel(createContestDto);
    return contest.save();
  }

  async update(
    id: string,
    updateContestDto: UpdateContestDto,
  ): Promise<Contest> {
    const contest = await this.contestModel
      .findByIdAndUpdate(id, updateContestDto, { new: true })
      .select('year colours')
      .populate('hostCountry', 'code name') // Only code and name
      .populate({
        path: 'entries',
        populate: {
          path: 'country',
          select: 'code name primaryColor secondaryColor',
        },
      })
      .exec();

    if (!contest) {
      throw new NotFoundException(`Contest with ID ${id} not found`);
    }
    return contest;
  }

  async addEntryToContest(year: number, entryId: string): Promise<Contest> {
    const contest = await this.contestModel.findOne({ year });
    if (!contest) {
      throw new NotFoundException(`Contest for year ${year} not found`);
    }

    if (!contest.entries.includes(entryId as any)) {
      contest.entries.push(entryId as any);
      await contest.save();
    }

    return this.findByYear(year);
  }

  async delete(id: string): Promise<void> {
    const result = await this.contestModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Contest with ID ${id} not found`);
    }
  }
}
