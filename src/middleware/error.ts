import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';

export function notFound(req: Request, res: Response, next: NextFunction): void {
  next(createError(404, `Route not found: ${req.originalUrl}`));
}

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const status = err.status || err.statusCode || 500;
  const payload: { message: string; stack?: string } = {
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && err.stack ? { stack: err.stack } : {})
  };

  res.status(status).json(payload);
}
