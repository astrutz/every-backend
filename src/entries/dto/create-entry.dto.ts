import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  Max,
  IsMongoId,
} from 'class-validator';

export class CreateEntryDto {
  @IsMongoId()
  country: string;

  @IsMongoId()
  contest: string;

  @IsNumber()
  year: number;

  @IsNumber()
  place: number;

  @IsString()
  artist: string;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  link?: string;

  @IsNumber()
  @Min(0)
  @Max(10)
  energyRating: number;

  @IsNumber()
  @Min(0)
  @Max(10)
  stagingRating: number;

  @IsNumber()
  @Min(0)
  @Max(10)
  studioRating: number;

  @IsNumber()
  @Min(0)
  @Max(10)
  funRating: number;

  @IsNumber()
  @Min(0)
  @Max(10)
  vocalsRating: number;
}

export class UpdateEntryDto extends CreateEntryDto {}
