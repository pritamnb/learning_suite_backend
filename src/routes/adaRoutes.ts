import { Router } from 'express';
import { runAdaCode } from '../controllers/adaController';

const router = Router();

router.post('/run-ada', runAdaCode);
export default router;
