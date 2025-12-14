// specialist.controller.ts
import { Request, Response } from 'express';
import { SpecialistService } from './specialist.service';

const service = new SpecialistService();

export class SpecialistController {
  async create(req: Request, res: Response) {
    const specialist = await service.create(
      req.body,
      req.files as {
        image1?: Express.Multer.File[];
        image2?: Express.Multer.File[];
        image3?: Express.Multer.File[];
      }
    );

    res.status(201).json({
      message: 'Specialist created successfully',
      data: specialist,
    });
  }
}
