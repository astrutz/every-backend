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
import { ContestsService } from './contests.service';
import { CreateContestDto } from './dto/create-contest.dto';
import { UpdateContestDto } from './dto/update-contest.dto';

@Controller('contests')
export class ContestsController {
  constructor(private readonly contestsService: ContestsService) {}

  @Get()
  findAll(@Query('year') year?: string) {
    if (year) {
      return this.contestsService.findByYear(parseInt(year));
    }
    return this.contestsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contestsService.findOne(id);
  }

  @Get(':year/top')
  findTopEntries(@Param('year') year: string, @Query('limit') limit?: string) {
    return this.contestsService.findTopEntries(
      parseInt(year),
      limit ? parseInt(limit) : 10,
    );
  }

  @Post()
  create(@Body() createContestDto: CreateContestDto) {
    return this.contestsService.create(createContestDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateContestDto: UpdateContestDto) {
    return this.contestsService.update(id, updateContestDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.contestsService.delete(id);
  }
}
