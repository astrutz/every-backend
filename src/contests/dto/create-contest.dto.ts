import { IsArray, IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateContestDto {
  @IsString()
  year: string;

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
