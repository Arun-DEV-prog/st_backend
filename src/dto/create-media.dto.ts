import { IsString, IsEnum, IsOptional, IsInt, MinLength, MaxLength } from 'class-validator';
import { MimeType, MediaType } from '../entities/media.entity';

export class CreateMediaDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  file_name!: string;

  @IsInt()
  file_size!: number;

  @IsInt()
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