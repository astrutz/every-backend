import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contest } from './schemas/contest.schema';

@Injectable()
export class ContestsService {
  constructor(
    @InjectModel(Contest.name) private contestModel: Model<Contest>,
  ) {}

  async findAll(): Promise<Contest[]> {
    return this.contestModel
      .find()
      .populate('hostCountry')
      .populate({
        path: 'entries',
        populate: { path: 'country' },
      })
      .sort({ year: -1 })
      .exec();
  }

  async findByYear(year: number): Promise<Contest> {
    const contest = await this.contestModel
      .findOne({ year })
      .populate('hostCountry')
      .populate({
        path: 'entries',
        populate: { path: 'country' },
      })
      .exec();

    if (!contest) {
      throw new NotFoundException(`Contest for year ${year} not found`);
    }
    return contest;
  }

  async create(createContestDto: any): Promise<Contest> {
    const contest = new this.contestModel(createContestDto);
    return contest.save();
  }

  async update(id: string, updateContestDto: any): Promise<Contest> {
    const contest = await this.contestModel
      .findByIdAndUpdate(id, updateContestDto, { new: true })
      .populate('hostCountry')
      .populate('entries')
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

    return contest;
  }
}
