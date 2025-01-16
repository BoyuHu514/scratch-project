import express from 'express';
import authenticate from '../middlewares/authenticate.js';
import exerciseController from '../controllers/exerciseController.js';

const router = express.Router();

router.get('/', authenticate, exerciseController.getLatestExerciseForAllTypes);
router.get('/:type', authenticate, exerciseController.getAllExercisesByType); // had to change / to /:type

router.post('/:type', authenticate, exerciseController.createExercise);
router.put('/:id',authenticate, exerciseController.updateExercise);
router.delete('/:id',authenticate, exerciseController.deleteExercise);

export default router;
