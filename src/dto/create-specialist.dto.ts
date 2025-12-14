import { IsString, IsDecimal, IsBoolean, IsEnum, IsOptional, MinLength, MaxLength, IsArray, ArrayMaxSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { VerificationStatus } from '../entities/specialists.entity';
import { CreateMediaDto } from './create-media.dto';
import { CreateServiceOfferingDto } from './create-service-offering.dto';
import { CreatePlatformFeeDto } from './create-platform-fee.dto';

export class CreateSpecialistDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  slug!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDecimal({ decimal_digits: '10,2' })
  base_price!: number;

  @IsDecimal({ decimal_digits: '10,2' })
  platform_fee!: number;

  @IsDecimal({ decimal_digits: '10,2' })
  final_price!: number;

  @IsOptional()
  @IsEnum(VerificationStatus)
  verification_status?: VerificationStatus;

  @IsOptional()
  @IsBoolean()
  is_verified?: boolean;

  @IsOptional()
  @IsDecimal({ decimal_digits: '3,2' })
  average_rating?: number;

  @IsOptional()
  @IsBoolean()
  is_draft?: boolean;

  @IsOptional()
  total_number_of_ratings?: number;

  @IsOptional()
  duration_days?: number;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(3) // Up to 3 images as per "image 3"
  @ValidateNested({ each: true })
  @Type(() => CreateMediaDto)
  media?: CreateMediaDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateServiceOfferingDto)
  service_offerings?: CreateServiceOfferingDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePlatformFeeDto)
  platform_fees?: CreatePlatformFeeDto[];
}