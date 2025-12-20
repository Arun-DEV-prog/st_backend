import {
  IsString,
  IsNumber,
  IsOptional,
  MinLength,
  MaxLength,
  Min,
  IsArray,
  IsBoolean,
  ArrayMaxSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSpecialistDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  base_price!: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  duration_days?: number;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  additional_offerings?: string[];

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  is_draft?: boolean;
}
