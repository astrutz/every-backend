import { IsString, IsOptional, Length } from 'class-validator';

export class CreateCountryDto {
  @IsString()
  @Length(2, 2)
  code: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  primaryColor?: string;

  @IsString()
  @IsOptional()
  secondaryColor?: string;
}

export class UpdateCountryDto extends CreateCountryDto {}
