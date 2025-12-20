import { Request, Response } from 'express';
import { SpecialistService } from '../services/specialist.service';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateSpecialistDto } from '../dto/create-specialist.dto';

const service = new SpecialistService();

export class SpecialistController {
  static async create(req: Request, res: Response) {
    const dto = plainToInstance(CreateSpecialistDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    try {
      const specialist = await service.create(dto, req.files);
      res.status(201).json(specialist);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to create specialist' });
    }
  }
}
