import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

interface Error {
    status?: number;
    message: string;
}

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    logger.error(`Status: ${status}, Message: ${message}`);

    res.status(status).json({ message });
};
