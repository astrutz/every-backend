import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { ContestsService } from './contests.service';

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

  @Post()
  create(@Body() createContestDto: any) {
    return this.contestsService.create(createContestDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateContestDto: any) {
    return this.contestsService.update(id, updateContestDto);
  }
}
