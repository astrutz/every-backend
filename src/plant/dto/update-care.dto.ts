import { IsArray, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateCareDto {
  @IsOptional()
  @IsArray()
  watered?: Types.ObjectId[];

  @IsOptional()
  @IsArray()
  sprayed?: Types.ObjectId[];

  @IsOptional()
  @IsArray()
  fertilized?: Types.ObjectId[];

  @IsOptional()
  @IsArray()
  trimmed?: Types.ObjectId[];

  @IsOptional()
  @IsArray()
  wiped?: Types.ObjectId[];
}
