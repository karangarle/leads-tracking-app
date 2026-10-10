import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import leadsRouter from './routes';
import { basicAuth } from './auth';

dotenv.config();

export const app = express();

app.use(cors());
app.use(express.json());

// API Routes with optional basic auth middleware
app.use('/api/leads', basicAuth, leadsRouter);

// Serve static frontend assets from frontend/dist if present
const clientBuildPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(clientBuildPath));

// Fallback to index.html for SPA routing
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientBuildPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send('Leads Tracking API Server is running. Build frontend with `npm run build` inside client to serve UI directly from backend, or run client via Vite dev server.');
    }
  });
});
