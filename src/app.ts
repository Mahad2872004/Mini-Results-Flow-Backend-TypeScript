
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import routes from './routes/form.routes';
import resultRoutes from './routes/results.routes';
import { notFound, errorHandler } from './middleware/error';

const app: Application = express();

// Security & Performance Middlewares
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS Setup
const corsOrigin = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((s) => s.trim())
  : '*';
app.use(cors({ origin: corsOrigin, credentials: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/form', routes);
app.use('/api/results', resultRoutes);

app.get('/api/health', (req: Request, res: Response) =>
  res.json({ ok: true })
);

// Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;
