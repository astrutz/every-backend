import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { EntriesService } from './entries.service';
import { CreateEntryDto, UpdateEntryDto } from './dto/create-entry.dto';

@Controller('entries')
export class EntriesController {
  constructor(private readonly entriesService: EntriesService) {}

  @Get()
  async findAll(@Query('year') year?: string) {
    if (year) {
      return this.entriesService.findByYear(parseInt(year));
    }
    return this.entriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.entriesService.findOne(id);
  }

  @Post()
  create(@Body() createEntryDto: CreateEntryDto) {
    return this.entriesService.create(createEntryDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateEntryDto: UpdateEntryDto) {
    return this.entriesService.update(id, updateEntryDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.entriesService.delete(id);
  }
}
