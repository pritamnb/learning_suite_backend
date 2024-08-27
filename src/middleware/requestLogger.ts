import { Request, Response, NextFunction } from 'express';

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const { method, originalUrl } = req;
    const logMessage = `[${new Date().toISOString()}] ${method} ${originalUrl}`;

    // Log request details to the console
    console.log(logMessage);

    // Continue to the next middleware or route handler
    next();
};

export default requestLogger;
