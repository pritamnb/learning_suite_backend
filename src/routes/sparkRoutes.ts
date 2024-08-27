import { Router } from 'express';
import { SparkAdaController } from '../controllers/sparkAdaController';
import { uploadMiddleware } from '../middleware/uploadMiddleware';

const sparkAdaController = new SparkAdaController();

const router = Router();
router.post('/prove', uploadMiddleware, sparkAdaController.prove.bind(sparkAdaController));
router.post('/examine', uploadMiddleware, sparkAdaController.examine.bind(sparkAdaController));

export default router;
