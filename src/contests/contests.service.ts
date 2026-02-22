import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contest } from './schemas/contest.schema';
import { Entry } from '../entries/schemas/entry.schema';
import { CreateContestDto } from './dto/create-contest.dto';
import { UpdateContestDto } from './dto/update-contest.dto';

@Injectable()
export class ContestsService {
  constructor(
    @InjectModel(Contest.name) private contestModel: Model<Contest>,
    @InjectModel(Entry.name) private entryModel: Model<Entry>,
  ) {}

  async findAll(): Promise<Contest[]> {
    return this.contestModel
      .find()
      .select('year colours')
      .populate('hostCountry', 'code name')
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
      .populate('hostCountry', 'code name')
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
      .populate('hostCountry', 'code name')
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

  async findTopEntries(year: number, limit: number = 10): Promise<any> {
    // Get contest basic info
    const contest = await this.contestModel
      .findOne({ year })
      .select('year colours')
      .populate('hostCountry', 'code name')
      .exec();

    if (!contest) {
      throw new NotFoundException(`Contest for year ${year} not found`);
    }

    // Get all entries for this year and calculate total rating
    const entries = await this.entryModel
      .find({ year })
      .populate('country', 'code name primaryColor secondaryColor')
      .lean()
      .exec();

    // Calculate total rating for each entry
    const entriesWithRating = entries.map((entry: any) => {
      const totalRating =
        entry.energyRating * 0.3 +
        entry.stagingRating * 0.3 +
        entry.studioRating * 0.15 +
        entry.funRating * 0.15 +
        entry.vocalsRating * 0.1;

      return {
        ...entry,
        totalRating: Math.round(totalRating * 10) / 10, // Round to 1 decimal
      };
    });

    // Sort by total rating (descending) and take top N
    const topEntries = entriesWithRating
      .sort((a, b) => b.totalRating - a.totalRating)
      .slice(0, limit);

    return {
      year: contest.year,
      colours: contest.colours,
      hostCountry: contest.hostCountry,
      topEntries,
    };
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
      .populate('hostCountry', 'code name')
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
