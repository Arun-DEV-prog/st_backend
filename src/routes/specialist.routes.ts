// specialist.routes.ts
import { Router } from 'express';
import { SpecialistController } from '../controllers/specialist_controller';
import { upload } from '../middleware/multer.middleware';

const router = Router();
const controller = new SpecialistController();

/**
 * CREATE SPECIALIST
 * multipart/form-data
 */
router.post(
  '/',
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
  ]),
  controller.create
);

export default router;
