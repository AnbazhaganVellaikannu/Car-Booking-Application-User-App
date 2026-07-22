import { Router } from 'express';
import { randomUUID } from 'crypto';
import { pool } from '../db.js';
import { requireAuth } from '../auth.js';
import { ah } from '../lib/asyncHandler.js';

export const favoritesRouter = Router();
favoritesRouter.use(requireAuth);

favoritesRouter.get('/', ah(async (req, res) => {
  const { rows } = await pool.query(
    'SELECT * FROM favorites WHERE user_id = $1 ORDER BY created_at ASC',
    [req.user.id]
  );
  res.json(rows.map((r) => ({ id: r.id, label: r.label, address: r.address, lat: r.lat, lng: r.lng })));
}));

favoritesRouter.post('/', ah(async (req, res) => {
  const { label, address, lat, lng } = req.body || {};
  if (!label || !address || typeof lat !== 'number' || typeof lng !== 'number') {
    return res.status(400).json({ error: 'label, address, lat and lng are required' });
  }
  const id = randomUUID();
  await pool.query(
    'INSERT INTO favorites (id, user_id, label, address, lat, lng) VALUES ($1,$2,$3,$4,$5,$6)',
    [id, req.user.id, label, address, lat, lng]
  );
  res.status(201).json({ id, label, address, lat, lng });
}));

favoritesRouter.delete('/:id', ah(async (req, res) => {
  const { rowCount } = await pool.query(
    'DELETE FROM favorites WHERE id = $1 AND user_id = $2',
    [req.params.id, req.user.id]
  );
  if (rowCount === 0) return res.status(404).json({ error: 'Not found' });
  res.status(204).end();
}));
