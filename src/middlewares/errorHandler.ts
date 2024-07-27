import { Request, Response, NextFunction } from 'express';

interface Error {
    status?: number;
    message: string;
}

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({ message });
};
