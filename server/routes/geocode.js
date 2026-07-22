import { Router } from 'express';
import { ah } from '../lib/asyncHandler.js';

export const geocodeRouter = Router();

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';
const HEADERS = { 'User-Agent': 'EasyRide-DemoApp/1.0 (contact: demo@easyride.local)' };

// Nominatim (OpenStreetMap) is free with no API key, but its usage policy
// asks for a real User-Agent and no client-side hammering — proxy through
// the server so we control the rate and never expose a key-less endpoint
// directly to the browser's fetch (also sidesteps CORS).
geocodeRouter.get('/search', ah(async (req, res) => {
  const q = String(req.query.q || '').trim();
  if (q.length < 3) return res.json([]);

  const url = new URL(`${NOMINATIM_BASE}/search`);
  url.searchParams.set('q', q);
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('limit', '6');
  url.searchParams.set('addressdetails', '0');

  const upstream = await fetch(url, { headers: HEADERS });
  if (!upstream.ok) return res.status(502).json({ error: 'Geocoding service unavailable' });
  const data = await upstream.json();
  res.json(
    data.map((d) => ({
      label: d.display_name,
      lat: Number(d.lat),
      lng: Number(d.lon),
    }))
  );
}));

geocodeRouter.get('/reverse', ah(async (req, res) => {
  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return res.status(400).json({ error: 'lat and lng are required' });
  }

  const url = new URL(`${NOMINATIM_BASE}/reverse`);
  url.searchParams.set('lat', String(lat));
  url.searchParams.set('lon', String(lng));
  url.searchParams.set('format', 'jsonv2');

  const upstream = await fetch(url, { headers: HEADERS });
  if (!upstream.ok) return res.status(502).json({ error: 'Geocoding service unavailable' });
  const data = await upstream.json();
  res.json({ label: data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`, lat, lng });
}));
