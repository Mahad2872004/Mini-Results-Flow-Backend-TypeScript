import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import routes from './routes/form.routes.js';
import resultRoutes from  './routes/results.routes.js';
import { notFound, errorHandler } from './middleware/error.js';

const app = express();

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOrigin = process.env.CORS_ORIGIN?.split(',').map(s => s.trim()) || '*';
app.use(cors({ origin: corsOrigin, credentials: true }));

if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

app.use('/api/form', routes);
app.use('/api/results',resultRoutes);
app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use(notFound);
app.use(errorHandler);

export default app;
