// specialist.service.ts
import { AppDataSource } from '../config/database';
import { Specialist } from '../entities/specialists.entity';

export class SpecialistService {
  private repo = AppDataSource.getRepository(Specialist);

  async create(
    body: any,
    files: {
      image1?: Express.Multer.File[];
      image2?: Express.Multer.File[];
      image3?: Express.Multer.File[];
    }
  ) {
    const specialist = this.repo.create({
      title: body.title,
      description: body.description,
      duration_days: Number(body.duration_days),
      base_price: Number(body.base_price),
      service_category: body.service_category,
      is_draft: true,
      is_published: false,
    });

    // ✅ MEDIA
    specialist.media = [];

    const imageMap = ['image1', 'image2', 'image3'] as const;

    imageMap.forEach((key, index) => {
      const file = files?.[key]?.[0];
      if (file) {
        specialist.media.push({
          file_name: file.filename,
          mime_type: file.mimetype,
          display_order: index + 1,
        });
      }
    });

    // ✅ SERVICE OFFERINGS
    if (body.additional_offerings) {
      const offerings = Array.isArray(body.additional_offerings)
        ? body.additional_offerings
        : [body.additional_offerings];

      specialist.service_offerings = offerings.map((name: string) => ({
        name,
      }));
    }

    // ✅ PLATFORM FEE (optional)
    if (body.platform_fee_percentage) {
      specialist.platform_fee = {
        tier_name: body.tier_name || 'default',
        platform_fee_percentage: Number(body.platform_fee_percentage),
      };
    }

    return this.repo.save(specialist);
  }
}
