import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './auth.js';
import { ensureSchema } from './schema.js';
import { ridesRouter } from './routes/rides.js';
import { favoritesRouter } from './routes/favorites.js';
import { vehicleTypesRouter } from './routes/vehicleTypes.js';
import { geocodeRouter } from './routes/geocode.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === 'production';
const app = express();

// Better Auth reads the raw request body itself — must be mounted before express.json().
app.all('/api/auth/*', toNodeHandler(auth));

app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/rides', ridesRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/vehicle-types', vehicleTypesRouter);
app.use('/api/geocode', geocodeRouter);

async function start() {
  await ensureSchema();

  if (isProd) {
    const distDir = path.join(__dirname, '../dist');
    if (fs.existsSync(distDir)) {
      app.use(express.static(distDir));
      app.get(/^(?!\/api).*/, (req, res) => res.sendFile(path.join(distDir, 'index.html')));
    }
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      root: path.join(__dirname, '../src'),
      server: { middlewareMode: true, hmr: { port: 24678 } },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  // Catch-all error handler: without this, a rejected promise from an
  // asyncHandler-wrapped route would otherwise leave the request hanging.
  app.use((err, req, res, next) => {
    console.error(err);
    if (res.headersSent) return next(err);
    res.status(500).json({ error: 'Internal server error' });
  });

  const port = process.env.PORT || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Easy Ride server listening on port ${port} (${isProd ? 'production' : 'development'})`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
