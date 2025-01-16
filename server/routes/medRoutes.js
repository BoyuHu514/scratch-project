import express from 'express';
import medController from '../controllers/medController.js';
import authenticate from '../middlewares/authenticate.js';

const router = express.Router();

router.get('/', authenticate, medController.getAllMeds);
router.post('/', authenticate, medController.createMeds);
router.put('/:id', authenticate, medController.updateMeds);
router.delete('/:id', authenticate, medController.deleteMeds);

export default router;
