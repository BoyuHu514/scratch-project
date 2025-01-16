import express from 'express';
import generalInfoController from '../controllers/generalInfoController.js';
import authenticate from '../middlewares/authenticate.js';

const router = express.Router();

router.get('/', authenticate, generalInfoController.getUserGeneralInfo);
router.post('/', authenticate, generalInfoController.createOrUpdateGeneralInfo);
router.delete('/', authenticate, generalInfoController.deleteGeneralInfo);

export default router;
