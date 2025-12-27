import { Request, Response } from 'express';
import { SpecialistService } from '../services/specialist.service';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateSpecialistDto } from '../dto/create-specialist.dto';

const service = new SpecialistService();

export class SpecialistController {

  /* ================= CREATE ================= */
  static async create(req: Request, res: Response) {
    try {
      const dto = plainToInstance(CreateSpecialistDto, req.body, {
        enableImplicitConversion: true,
      });

      const errors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });

      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          errors,
        });
      }

      const specialist = await service.create(dto, req.files);

      return res.status(201).json({
        success: true,
        message: 'Specialist created successfully',
        data: specialist,
      });

    } catch (error: any) {
      console.error('Create specialist error:', error);

      return res.status(500).json({
        success: false,
        message: error?.message || 'Failed to create specialist',
      });
    }
  }

  /* ================= GET ALL ================= */
  static async getAll(req: Request, res: Response) {
    try {
      const result = await service.getAll(req.query);

      return res.status(200).json({
        success: true,
        message: 'Specialists fetched successfully',
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      console.error('Get specialists error:', error);

      return res.status(500).json({
        success: false,
        message: 'Failed to fetch specialists',
      });
    }
  }

  /* ================= GET SINGLE ================= */
  static async getById(req: Request, res: Response) {
    try {
      const specialist = await service.getById(req.params.id);

      return res.status(200).json({
        success: true,
        data: specialist,
      });
    } catch (error: any) {
      console.error('Get specialist error:', error);

      return res.status(404).json({
        success: false,
        message: error?.message || 'Specialist not found',
      });
    }
  }

  /* ================= DELETE ================= */
  static async delete(req: Request, res: Response) {
    try {
      await service.delete(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Specialist deleted successfully',
      });
    } catch (error: any) {
      console.error('Delete specialist error:', error);
      if (error.message === 'Specialist not found') {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to delete specialist',
      });
    }
  }
  /* ================= UPDATE ================= */
  static async update(req: Request, res: Response) {
    try {
      // Use UpdateSpecialistDto for validation
      const { UpdateSpecialistDto } = await import('../dto/update-specialist.dto');
      const dto = plainToInstance(UpdateSpecialistDto, req.body, {
        enableImplicitConversion: true,
      });
      const errors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });
      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          errors,
        });
      }
      const specialist = await service.update(req.params.id, dto, req.files);
      return res.status(200).json({
        success: true,
        message: 'Specialist updated successfully',
        data: specialist,
      });
    } catch (error: any) {
      console.error('Update specialist error:', error);
      if (error.message === 'Specialist not found') {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to update specialist',
      });
    }
  }
}
