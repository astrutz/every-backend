import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlantService } from './plant.service';
import { PlantController } from './plant.controller';
import { Plant, PlantSchema } from './schemas/plant.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Plant.name, schema: PlantSchema }]),
  ],
  controllers: [PlantController],
  providers: [PlantService],
})
export class PlantModule {}
