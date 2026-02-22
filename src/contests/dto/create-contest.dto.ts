import {
  IsNumber,
  IsArray,
  IsOptional,
  IsMongoId,
  Min,
} from 'class-validator';

export class CreateContestDto {
  @IsNumber()
  @Min(1956) // First Eurovision was 1956
  year: number;

  @IsMongoId()
  hostCountry: string;

  @IsArray()
  @IsOptional()
  colours?: string[];

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  entries?: string[];
}

export class UpdateContestDto extends CreateContestDto {}
