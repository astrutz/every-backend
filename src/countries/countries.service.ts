import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Country } from './schemas/country.schema';
import { CreateCountryDto, UpdateCountryDto } from './dto/create-country.dto';

@Injectable()
export class CountriesService {
  constructor(
    @InjectModel(Country.name) private countryModel: Model<Country>,
  ) {}

  async findAll(): Promise<Country[]> {
    return this.countryModel.find().exec();
  }

  async findOne(id: string): Promise<Country> {
    const country = await this.countryModel.findById(id).exec();
    if (!country) {
      throw new NotFoundException(`Country with ID ${id} not found`);
    }
    return country;
  }

  async findByCode(code: string): Promise<Country | null> {
    return this.countryModel.findOne({ code }).exec();
  }

  async create(createCountryDto: CreateCountryDto): Promise<Country> {
    const country = new this.countryModel(createCountryDto);
    return country.save();
  }

  async update(
    id: string,
    updateCountryDto: UpdateCountryDto,
  ): Promise<Country> {
    const country = await this.countryModel
      .findByIdAndUpdate(id, updateCountryDto, { new: true })
      .exec();

    if (!country) {
      throw new NotFoundException(`Country with ID ${id} not found`);
    }
    return country;
  }

  async delete(id: string): Promise<void> {
    const result = await this.countryModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Country with ID ${id} not found`);
    }
  }
}
