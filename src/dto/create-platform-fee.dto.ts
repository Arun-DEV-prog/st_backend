import { IsEnum, IsNumber, Min } from 'class-validator';
import { TierName } from '../entities/platform_fee.entity';

export class CreatePlatformFeeDto {
  @IsEnum(TierName)
  tier_name!: TierName;

  @IsNumber()
  @Min(0)
  min_value!: number;

  @IsNumber()
  @Min(0)
  max_value!: number;

  @IsNumber()
  @Min(0)
  platform_fee_percentage!: number;
}