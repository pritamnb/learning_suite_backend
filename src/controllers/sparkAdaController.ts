import { Request, Response, NextFunction } from 'express';
import { SparkAdaService } from '../services/sparkAdaService';
import logger from '../config/logger';

export class SparkAdaController {
    private sparkAdaService: SparkAdaService;

    constructor() {
        this.sparkAdaService = new SparkAdaService();
    }

    public async prove(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            const specFile = files.specFile[0].filename;
            const bodyFile = files.bodyFile[0].filename;
            const level = parseInt(req.body.verificationLevel, 10) || 0;

            try {
                const result = await this.sparkAdaService.prove(specFile, bodyFile, level);
                console.log("result :", result)
                res.send({ message: 'Prove successful', output: result });

            } catch (error) {
                logger.error(`Error during processing: ${error}`);
                res.status(500).send({ error: 'Error during processing', details: error });
            }
        } catch (err) {
            next(err);
        }
    }

    public async examine(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            const specFile = files.specFile[0].filename;
            const bodyFile = files.bodyFile[0].filename;
            const level = parseInt(req.body.verificationLevel, 10) || 0;
            const reportAll = req.query.report === 'all';

            try {
                const result = await this.sparkAdaService.examine(specFile, bodyFile, reportAll, level);
                console.log("result :", result)

                res.send({ message: 'Examine successful', output: result });
            } catch (error) {
                logger.error(`Error during processing: ${error}`);
                res.status(500).send({ error: 'Error during processing', details: error });
            }
        } catch (err) {
            next(err);
        }
    }
}
