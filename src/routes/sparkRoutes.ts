import { Router } from 'express';
import { runSparkAdaCode } from '../controllers/sparkAdaController';
import multer from 'multer';

const router = Router();
// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

router.post('/run-spark', upload.fields([{ name: 'specFile', maxCount: 1 }, { name: 'bodyFile', maxCount: 1 }]), runSparkAdaCode);

export default router;
