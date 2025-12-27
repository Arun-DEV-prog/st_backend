   
import { AppDataSource } from '../config/database';
import { Specialist } from '../entities/specialists.entity';
import { Media, MediaType } from '../entities/media.entity';
import { PlatformFee } from '../entities/platform_fee.entity';
import { ServiceOffering } from '../entities/service_offerings.entity';
import { CreateSpecialistDto } from '../dto/create-specialist.dto';
import slugify from 'slugify';
import { LessThanOrEqual, MoreThanOrEqual, IsNull } from 'typeorm';

export class SpecialistService {
  private specialistRepo = AppDataSource.getRepository(Specialist);
  private mediaRepo = AppDataSource.getRepository(Media);
  private offeringRepo = AppDataSource.getRepository(ServiceOffering);
  private platformFeeRepo = AppDataSource.getRepository(PlatformFee);

  /* ================= CREATE ================= */
  async create(body: CreateSpecialistDto, files: any) {

    /* 1️⃣ Platform fee */
    const platformFee = await this.platformFeeRepo.findOne({
      where: {
        min_value: LessThanOrEqual(body.base_price),
        max_value: MoreThanOrEqual(body.base_price),
      },
    });

    const feePercentage = platformFee?.platform_fee_percentage ?? 0;
    const platformFeeAmount = (body.base_price * feePercentage) / 100;

    /* 2️⃣ Specialist */
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

    /* 3️⃣ Media */
    for (const [index, key] of ['image1', 'image2', 'image3'].entries()) {
      const file = files?.[key]?.[0];
      if (!file) continue;

      // Debug: Log specialist ID before media creation
      console.log('Creating media (create) for specialist:', savedSpecialist?.id);
      if (!savedSpecialist?.id) throw new Error('Specialist ID missing in create. Media creation aborted.');

      await this.mediaRepo.save(
        this.mediaRepo.create({
          specialists: savedSpecialist.id,
          file_name: file.filename,
          file_size: file.size,
          mime_type: file.mimetype.split('/')[1] as any,
          media_type: MediaType.image,
          display_order: index + 1,
          uploaded_at: new Date(),
        })
      );
    }

    /* 4️⃣ Service offerings */
    if (body.additional_offerings?.length) {
      const offerings = body.additional_offerings.map((name) =>
        this.offeringRepo.create({
          specialists: savedSpecialist.id,
          name,
        })
      );
      await this.offeringRepo.save(offerings);
    }

    return this.getById(savedSpecialist.id);
  }

  /* ================= GET ALL ================= */
  async getAll(query: any) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = query.status || 'all';

    const where: any = {
      deleted_at: IsNull(),
    };

    if (status === 'draft') where.is_draft = true;
    if (status === 'published') where.is_draft = false;

    const [data, total] = await this.specialistRepo.findAndCount({
      where,
      relations: {
        media: true,
        service_offerings: true,
      },
      order: { created_at: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /* ================= GET ONE ================= */
  async getById(id: string) {
    const specialist = await this.specialistRepo.findOne({
      where: {
        id,
        deleted_at: IsNull(),
      },
      relations: {
        media: true,
        service_offerings: true,
      },
    });

    if (!specialist) {
      throw new Error('Specialist not found');
    }

    return specialist;
  }
  /* ================= DELETE ================= */
  async delete(id: string) {
    const specialist = await this.specialistRepo.findOne({ where: { id, deleted_at: IsNull() } });
    if (!specialist) {
      throw new Error('Specialist not found');
    }
    specialist.deleted_at = new Date();
    await this.specialistRepo.save(specialist);
  }

async update(id: string, body: any, files: any) {
  // Normalize multipart/form-data values
  const parsedBody = {
    ...body,
    base_price: body.base_price !== undefined ? Number(body.base_price) : undefined,
    duration_days: body.duration_days !== undefined ? Number(body.duration_days) : undefined,
    is_draft:
      body.is_draft === 'true'
        ? true
        : body.is_draft === 'false'
        ? false
        : undefined,
    additional_offerings:
      Array.isArray(body.additional_offerings)
        ? body.additional_offerings.filter((v: any) => !!v && v !== 'undefined')
        : body.additional_offerings !== undefined && body.additional_offerings !== '' && body.additional_offerings !== 'undefined'
        ? [body.additional_offerings]
        : [],
  };
  body = parsedBody;

  // Find specialist
  const specialist = await this.specialistRepo.findOne({
    where: { id, deleted_at: IsNull() },
    relations: { media: true, service_offerings: true },
  });

  if (!specialist) throw new Error('Specialist not found');

  // Update basic fields
  if (body.title) {
    specialist.title = body.title;
    specialist.slug = slugify(body.title, { lower: true });
  }
  if (body.description !== undefined) specialist.description = body.description;
  if (body.base_price !== undefined) specialist.base_price = body.base_price;
  if (body.duration_days !== undefined) specialist.duration_days = body.duration_days;
  if (body.is_draft !== undefined) {
    specialist.is_draft = body.is_draft;
    if (body.is_draft === false) specialist.is_verified = true;
  }

  // Platform fee
  if (body.base_price !== undefined) {
    const platformFee = await this.platformFeeRepo.findOne({
      where: {
        min_value: LessThanOrEqual(body.base_price),
        max_value: MoreThanOrEqual(body.base_price),
      },
    });
    const feePercentage = platformFee?.platform_fee_percentage ?? 0;
    const platformFeeAmount = (body.base_price * feePercentage) / 100;
    specialist.platform_fee_amount = platformFeeAmount;
    specialist.final_price = body.base_price + platformFeeAmount;
  }

  // Update media
  // Persist specialist changes before media creation (ensures ID & state)
  await this.specialistRepo.save(specialist);

  // Re-fetch specialist to guarantee a valid ID
  const freshSpecialist = await this.specialistRepo.findOne({ where: { id: specialist.id } });

  if (files && freshSpecialist && freshSpecialist.id) {
    const keys = ['image1', 'image2', 'image3'];
    for (const key of keys) {
      const file = files[key]?.[0];
      if (!file) continue;

      // Debug: Log specialist ID before media creation
      console.log('Creating media (update) for specialist:', freshSpecialist?.id);
      if (!freshSpecialist?.id) throw new Error('Specialist ID missing in update. Media creation aborted.');

      const displayOrder = keys.indexOf(key) + 1;

      const oldMedia = await this.mediaRepo.findOne({
        where: {
          specialists: freshSpecialist.id,
          display_order: displayOrder,
        },
      });

      if (oldMedia) {
        await this.mediaRepo.remove(oldMedia);
      }

      await this.mediaRepo.save(
        this.mediaRepo.create({
          specialists: freshSpecialist.id,
          file_name: file.filename,
          file_size: file.size,
          mime_type: file.mimetype?.split('/')[1] ?? null,
          media_type: MediaType.image,
          display_order: displayOrder,
          uploaded_at: new Date(),
        })
      );
    }
  }

  // Update service offerings (transactional to avoid FK / partial-update issues)
  if (Array.isArray(body.additional_offerings)) {
    const offeringNames = (body.additional_offerings as string[])
      .filter(n => !!n && n.trim() !== '')
      .map(n => n.trim());

    await this.specialistRepo.manager.transaction(async (manager) => {
      const offeringRepoTx = manager.getRepository(this.offeringRepo.target);
      const specialistRepoTx = manager.getRepository(this.specialistRepo.target);

      // Ensure specialist exists in transaction scope
      const freshSpecialist = await specialistRepoTx.findOne({ where: { id: specialist.id } });
      if (!freshSpecialist) throw new Error('Specialist not found (txn)');

      // Delete old offerings by FK (safe)
      await offeringRepoTx.delete({ specialists: freshSpecialist.id });

      // Create new offerings attached to the Specialist by ID
      if (offeringNames.length > 0) {
        const offeringsToSave = offeringNames.map((name) =>
          offeringRepoTx.create({
            name,
            specialists: freshSpecialist.id, // use string ID for FK
          })
        );
        await offeringRepoTx.save(offeringsToSave);
      }
    });
  }

  // Return updated specialist
  return this.getById(specialist.id);
}
   

}