import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Specialist } from '../entities/specialists.entity';
import { Media } from '../entities/media.entity';
import { ServiceOffering } from '../entities/service_offerings.entity';
import { PlatformFee } from '../entities/platform_fee.entity';
import { CreateSpecialistDto } from '../dto/create-specialist.dto';
import { UpdateSpecialistDto } from '../dto/update-specialist.dto';
import { CreateMediaDto } from '../dto/create-media.dto';
import { CreatePlatformFeeDto } from '../dto/create-platform-fee.dto';
import { validate } from 'class-validator';

export class SpecialistsController {
  private specialistRepository = AppDataSource.getRepository(Specialist);
  private mediaRepository = AppDataSource.getRepository(Media);
  private serviceOfferingRepository = AppDataSource.getRepository(ServiceOffering);
  private platformFeeRepository = AppDataSource.getRepository(PlatformFee);

  async createSpecialist(req: Request, res: Response) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const dto = Object.assign(new CreateSpecialistDto(), req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      // Create specialist
      const specialist = this.specialistRepository.create({
        title: dto.title,
        slug: dto.slug,
        description: dto.description,
        base_price: dto.base_price,
        platform_fee: dto.platform_fee,
        final_price: dto.final_price,
        verification_status: dto.verification_status,
        is_verified: dto.is_verified,
        average_rating: dto.average_rating,
        is_draft: dto.is_draft,
        total_number_of_ratings: dto.total_number_of_ratings,
        duration_days: dto.duration_days,
      });
      const savedSpecialist = await queryRunner.manager.save(specialist);

      // Create media if provided
      if (dto.media && dto.media.length > 0) {
        const mediaEntities = dto.media.map((mediaDto: CreateMediaDto) => this.mediaRepository.create({
          ...mediaDto,
          specialists: savedSpecialist.id,
        }));
        await queryRunner.manager.save(mediaEntities);
      }

      // Create service offerings if provided
      if (dto.service_offerings && dto.service_offerings.length > 0) {
        const serviceOfferingEntities = dto.service_offerings.map(() => this.serviceOfferingRepository.create({
          specialists: savedSpecialist.id,
        }));
        await queryRunner.manager.save(serviceOfferingEntities);
      }

      // Create platform fees if provided
      if (dto.platform_fees && dto.platform_fees.length > 0) {
        const platformFeeEntities = dto.platform_fees.map((platformFeeDto: CreatePlatformFeeDto) => this.platformFeeRepository.create({
          ...platformFeeDto,
          specialists: savedSpecialist.id,
        }));
        await queryRunner.manager.save(platformFeeEntities);
      }

      await queryRunner.commitTransaction();

      // Reload specialist with relations
      const specialistWithRelations = await this.specialistRepository.findOne({
        where: { id: savedSpecialist.id },
        relations: ['media', 'service_offerings', 'platform_fees'],
      });

      res.status(201).json(specialistWithRelations);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error creating specialist:', error);
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      await queryRunner.release();
    }
  }

  async getAllSpecialists(req: Request, res: Response) {
    try {
      const specialists = await this.specialistRepository.find({
        relations: ['media', 'service_offerings', 'platform_fees'],
      });
      res.json(specialists);
    } catch (error) {
      console.error('Error fetching specialists:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getSpecialistById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const specialist = await this.specialistRepository.findOne({
        where: { id },
        relations: ['media', 'service_offerings', 'platform_fees'],
      });

      if (!specialist) {
        return res.status(404).json({ message: 'Specialist not found' });
      }

      res.json(specialist);
    } catch (error) {
      console.error('Error fetching specialist:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async updateSpecialist(req: Request, res: Response) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { id } = req.params;
      const dto = Object.assign(new UpdateSpecialistDto(), req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const specialist = await queryRunner.manager.findOne(Specialist, {
        where: { id },
        relations: ['media', 'service_offerings', 'platform_fees'],
      });

      if (!specialist) {
        return res.status(404).json({ message: 'Specialist not found' });
      }

      // Update specialist fields
      Object.assign(specialist, {
        title: dto.title ?? specialist.title,
        slug: dto.slug ?? specialist.slug,
        description: dto.description ?? specialist.description,
        base_price: dto.base_price ?? specialist.base_price,
        platform_fee: dto.platform_fee ?? specialist.platform_fee,
        final_price: dto.final_price ?? specialist.final_price,
        verification_status: dto.verification_status ?? specialist.verification_status,
        is_verified: dto.is_verified ?? specialist.is_verified,
        average_rating: dto.average_rating ?? specialist.average_rating,
        is_draft: dto.is_draft ?? specialist.is_draft,
        total_number_of_ratings: dto.total_number_of_ratings ?? specialist.total_number_of_ratings,
        duration_days: dto.duration_days ?? specialist.duration_days,
      });

      await queryRunner.manager.save(specialist);

      // Handle media updates (replace all)
      if (dto.media !== undefined) {
        // Delete existing media
        await queryRunner.manager.delete(Media, { specialists: id });
        // Create new media
        if (dto.media.length > 0) {
          const mediaEntities = dto.media.map((mediaDto: CreateMediaDto) => this.mediaRepository.create({
            ...mediaDto,
            specialists: id,
          }));
          await queryRunner.manager.save(mediaEntities);
        }
      }

      // Handle service offerings updates (replace all)
      if (dto.service_offerings !== undefined) {
        await queryRunner.manager.delete(ServiceOffering, { specialists: id });
        if (dto.service_offerings.length > 0) {
          const serviceOfferingEntities = dto.service_offerings.map(() => this.serviceOfferingRepository.create({
            specialists: id,
          }));
          await queryRunner.manager.save(serviceOfferingEntities);
        }
      }

      // Handle platform fees updates (replace all)
      if (dto.platform_fees !== undefined) {
        await queryRunner.manager.delete(PlatformFee, { specialists: id });
        if (dto.platform_fees.length > 0) {
          const platformFeeEntities = dto.platform_fees.map((platformFeeDto: CreatePlatformFeeDto) => this.platformFeeRepository.create({
            ...platformFeeDto,
            specialists: id,
          }));
          await queryRunner.manager.save(platformFeeEntities);
        }
      }

      await queryRunner.commitTransaction();

      // Reload with relations
      const updatedSpecialist = await this.specialistRepository.findOne({
        where: { id },
        relations: ['media', 'service_offerings', 'platform_fees'],
      });

      res.json(updatedSpecialist);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error updating specialist:', error);
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      await queryRunner.release();
    }
  }

  async deleteSpecialist(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this.specialistRepository.delete(id);

      if (result.affected === 0) {
        return res.status(404).json({ message: 'Specialist not found' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting specialist:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}