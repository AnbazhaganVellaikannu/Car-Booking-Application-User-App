import { Router } from 'express';
import { ah } from '../lib/asyncHandler.js';

export const geocodeRouter = Router();

const LOCATIONIQ_BASE = 'https://us1.locationiq.com/v1';
const LOCATIONIQ_API_KEY = process.env.LOCATIONIQ_API_KEY;

// LocationIQ is OSM-data-based, same response shape as Nominatim
// (display_name/lat/lon), but on infrastructure meant to serve production
// traffic from cloud hosts — unlike Nominatim's public instance, whose
// usage policy rate-limits shared hosting IPs (which is what broke this
// under Render: 429s from Nominatim's edge cache, confirmed in production
// logs, even though this app's own request volume was tiny).
geocodeRouter.get('/search', ah(async (req, res) => {
  const q = String(req.query.q || '').trim();
  if (q.length < 3) return res.json([]);
  if (!LOCATIONIQ_API_KEY) {
    console.error('LOCATIONIQ_API_KEY is not set — geocoding is unavailable.');
    return res.status(502).json({ error: 'Geocoding service unavailable' });
  }

  const url = new URL(`${LOCATIONIQ_BASE}/search`);
  url.searchParams.set('key', LOCATIONIQ_API_KEY);
  url.searchParams.set('q', q);
  url.searchParams.set('format', 'json');
  url.searchParams.set('limit', '6');

  const upstream = await fetch(url);
  if (!upstream.ok) {
    console.error(
      `LocationIQ /search failed: ${upstream.status} ${upstream.statusText} — body: ${(await upstream.text()).slice(0, 500)}`
    );
    return res.status(502).json({ error: 'Geocoding service unavailable' });
  }
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
  if (!LOCATIONIQ_API_KEY) {
    console.error('LOCATIONIQ_API_KEY is not set — geocoding is unavailable.');
    return res.status(502).json({ error: 'Geocoding service unavailable' });
  }

  const url = new URL(`${LOCATIONIQ_BASE}/reverse`);
  url.searchParams.set('key', LOCATIONIQ_API_KEY);
  url.searchParams.set('lat', String(lat));
  url.searchParams.set('lon', String(lng));
  url.searchParams.set('format', 'json');

  const upstream = await fetch(url);
  if (!upstream.ok) {
    console.error(
      `LocationIQ /reverse failed: ${upstream.status} ${upstream.statusText} — body: ${(await upstream.text()).slice(0, 500)}`
    );
    return res.status(502).json({ error: 'Geocoding service unavailable' });
  }
  const data = await upstream.json();
  res.json({ label: data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`, lat, lng });
}));
