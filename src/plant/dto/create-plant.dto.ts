import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsUrl,
  IsNumber,
  Min,
  ValidateNested,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class DormantPeriodDto {
  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  wateringInterval?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  sprayingInterval?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  fertilizingInterval?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  cuttingInterval?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  wipingInterval?: number;
}

export class CreatePlantDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  botanicalName?: string;

  @IsNumber()
  @Min(1)
  wateringInterval: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  sprayingInterval?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  fertilizingInterval?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  cuttingInterval?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  wipingInterval?: number;

  @IsOptional()
  @IsDateString()
  createdAtDate?: string;

  @IsEnum([
    'Balkon',
    'Schlafzimmer',
    'Flur',
    'Arbeitszimmer',
    'Wohnzimmer',
    'Babiel',
  ])
  location: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => DormantPeriodDto)
  dormantPeriod?: DormantPeriodDto;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  temperature?: string;

  @IsOptional()
  @IsString()
  lighting?: string;
}
