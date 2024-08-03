import { Router } from 'express';
import { runSparkCode } from '../controllers/sparkAdaController';

const router = Router();

router.post('/run-spark', runSparkCode);

export default router;
