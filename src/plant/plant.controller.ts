import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { PlantService } from './plant.service';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';
import { UpdateCareDto } from './dto/update-care.dto';
import { SnoozePlantDto } from './dto/snooze-plant.dto';

@Controller('plantu')
export class PlantController {
  constructor(private readonly plantService: PlantService) {}

  @Get()
  findAll() {
    return this.plantService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.plantService.findOne(id);
  }

  @Get('next-watering')
  async getNextWatering() {
    return this.plantService.getPlantsGroupedByNextWatering();
  }

  @Post()
  create(@Body() dto: CreatePlantDto) {
    return this.plantService.create(dto);
  }

  @Post('care')
  async updateCareBulk(@Body() dto: UpdateCareDto) {
    return this.plantService.updateCareBulk(dto);
  }

  @Patch(':id/snooze')
  snoozePlant(@Param('id') id: string, @Body() dto: SnoozePlantDto) {
    return this.plantService.snooze(id, dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePlantDto) {
    return this.plantService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.plantService.delete(id);
  }
}
