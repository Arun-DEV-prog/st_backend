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
  IsEnum,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export enum ServiceCategory {
  incorporation = 'incorporation',
  secretary = 'secretary',
  bank = 'bank',
}

export class UpdateSpecialistDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  base_price?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  duration_days?: number;

  // ✅ FIX: service_category added
  @IsOptional()
  @IsEnum(ServiceCategory)
  service_category?: ServiceCategory;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  additional_offerings?: string[];

  // ✅ FIX: Proper boolean transform for multipart
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  is_draft?: boolean;
}
