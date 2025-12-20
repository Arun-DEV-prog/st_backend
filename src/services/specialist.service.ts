import { AppDataSource } from '../config/database';
import { Specialist } from '../entities/specialists.entity';
import { Media, MediaType } from '../entities/media.entity';
import { PlatformFee } from '../entities/platform_fee.entity';
import { ServiceOffering } from '../entities/service_offerings.entity';
import { CreateSpecialistDto } from '../dto/create-specialist.dto';
import slugify from 'slugify';
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

export class SpecialistService {
  private specialistRepo = AppDataSource.getRepository(Specialist);
  private mediaRepo = AppDataSource.getRepository(Media);
  private offeringRepo = AppDataSource.getRepository(ServiceOffering);
  private platformFeeRepo = AppDataSource.getRepository(PlatformFee);

  async create(body: CreateSpecialistDto, files: any) {
    /* 1️⃣ Find platform fee tier */
    const platformFee = await this.platformFeeRepo.findOne({
      where: {
        min_value: LessThanOrEqual(body.base_price),
        max_value: MoreThanOrEqual(body.base_price),
      },
    });

    const feePercentage = platformFee?.platform_fee_percentage ?? 0;
    const platformFeeAmount = (body.base_price * feePercentage) / 100;

    /* 2️⃣ Create specialist */
    const specialist = this.specialistRepo.create({
      title: body.title,
      slug: slugify(body.title, { lower: true }),
      description: body.description,
      base_price: body.base_price,
      duration_days: body.duration_days,
      is_draft: body.is_draft ?? true,
      average_rating: 0,
      total_number_of_ratings: 0,
      platform_fee_amount: platformFeeAmount,
      final_price: body.base_price + platformFeeAmount,
    });

    const savedSpecialist = await this.specialistRepo.save(specialist);

    /* 3️⃣ Save media */
   
/* 3️⃣ Save media */
for (const [index, key] of ['image1', 'image2', 'image3'].entries()) {
  const file = files?.[key]?.[0];
  if (file) {
    await this.mediaRepo.save(
      this.mediaRepo.create({
        specialists: savedSpecialist.id,
        file_name: file.filename,
        file_size: file.size,
        mime_type: file.mimetype.split('/')[1] as any, // jpeg | png | webp
        media_type: MediaType.image, // ✅ FIXED
        display_order: index + 1,
        uploaded_at: new Date(),
      })
    );
  }
}


    /* 4️⃣ Save service offerings */
    if (body.additional_offerings?.length) {
      for (const name of body.additional_offerings) {
        await this.offeringRepo.save(
          this.offeringRepo.create({
            specialists: savedSpecialist.id, // ✅ FK
            name,
          })
        );
      }
    }

    return savedSpecialist;
  }
}
