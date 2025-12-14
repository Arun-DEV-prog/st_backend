import { Router } from 'express';
import { SpecialistsController } from '../controllers/specialists.controller';

const router = Router();
const specialistsController = new SpecialistsController();

router.post('/', specialistsController.createSpecialist.bind(specialistsController));
router.get('/', specialistsController.getAllSpecialists.bind(specialistsController));
router.get('/:id', specialistsController.getSpecialistById.bind(specialistsController));
router.put('/:id', specialistsController.updateSpecialist.bind(specialistsController));
router.delete('/:id', specialistsController.deleteSpecialist.bind(specialistsController));

export default router;