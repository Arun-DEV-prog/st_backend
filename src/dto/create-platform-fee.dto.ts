import { IsEnum, IsInt, IsDecimal } from 'class-validator';
import { TierName } from '../entities/platform_fee.entity';

export class CreatePlatformFeeDto {
  @IsEnum(TierName)
  tier_name!: TierName;

  @IsInt()
  min_value!: number;

  @IsInt()
  max_value!: number;

  @IsDecimal({ decimal_digits: '5,2' })
  platform_fee_percentage!: number;
}