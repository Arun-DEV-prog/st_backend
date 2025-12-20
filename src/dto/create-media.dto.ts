import { IsString, IsNumber, IsEnum, IsOptional, MinLength, MaxLength, Min } from 'class-validator';
import { MimeType, MediaType } from '../entities/media.entity';

export class CreateMediaDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  file_name!: string;

  @IsNumber()
  @Min(0)
  file_size!: number;

  @IsNumber()
  @Min(0)
  display_order!: number;

  @IsOptional()
  @IsEnum(MimeType)
  mime_type?: MimeType;

  @IsOptional()
  @IsEnum(MediaType)
  media_type?: MediaType;

  @IsOptional()
  uploaded_at?: Date;
}