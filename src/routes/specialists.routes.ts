import { Router } from 'express';
import { SpecialistController } from '../controllers/specialists.controller';
import { specialistUpload } from '../middleware/multer.middleware';

const router = Router();

router.post(
  '/',
  specialistUpload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
  ]),
  SpecialistController.create
);

export default router;
