import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/db.js';
import { authRouter } from './routes/authRoutes.js';
import { platformRouter } from './routes/platformRoutes.js';
import { errorHandler, notFound } from './middleware/error.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDist = path.resolve(__dirname, '../../frontend/dist');

const app = express();
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: process.env.CLIENT_URL?.split(',') || '*', credentials: true }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 250 }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use('/uploads', express.static(process.env.UPLOAD_DIR || 'uploads'));

app.get('/health', (_req, res) => res.json({ status: 'ok', name: 'JalSetu API', time: new Date().toISOString() }));
app.use('/api/auth', authRouter);
app.use('/api', platformRouter);

if (process.env.SERVE_FRONTEND === 'true' && fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (_req, res) => res.sendFile(path.join(frontendDist, 'index.html')));
}

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
  connectDB(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/jalsetu')
    .then(() => app.listen(port, () => console.log(`JalSetu API listening on ${port}`)))
    .catch((error) => {
      console.error('Failed to start server', error);
      process.exit(1);
    });
}

export default app;
