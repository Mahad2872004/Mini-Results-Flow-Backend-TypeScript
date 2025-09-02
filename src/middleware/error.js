import createError from 'http-errors';

export function notFound(req, res, next) {
  next(createError(404, `Route not found: ${req.originalUrl}`));
}

export function errorHandler(err, req, res, next) { 
  const status = err.status || err.statusCode || 500;
  const payload = {
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && err.stack ? { stack: err.stack } : {})
  };
  res.status(status).json(payload);
}


