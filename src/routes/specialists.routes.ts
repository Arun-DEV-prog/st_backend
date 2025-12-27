import { Router } from 'express';
import { SpecialistController } from '../controllers/specialists.controller';
import { specialistUpload } from '../middleware/multer.middleware';

const router = Router();

/* ================= CREATE ================= */
router.post(
  '/',
  specialistUpload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
  ]),
  SpecialistController.create
);

/* ================= GET ALL ================= */
router.get('/', SpecialistController.getAll);

/* ================= GET ONE ================= */
router.get('/:id', SpecialistController.getById);
router.patch(
  '/:id',
  specialistUpload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
  ]),
  SpecialistController.update
);
router.delete('/:id', SpecialistController.delete);
console.log('🔥 specialists.routes loaded');

export default router;
