import { IsDateString, IsOptional } from 'class-validator';

export class SnoozePlantDto {
  @IsOptional()
  @IsDateString()
  wateringUntil?: string;

  @IsOptional()
  @IsDateString()
  sprayingUntil?: string;

  @IsOptional()
  @IsDateString()
  fertilizingUntil?: string;

  @IsOptional()
  @IsDateString()
  cuttingUntil?: string;

  @IsOptional()
  @IsDateString()
  wipingUntil?: string;
}
