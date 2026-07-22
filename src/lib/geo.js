const EARTH_RADIUS_KM = 6371;
const ROAD_WINDING_FACTOR = 1.3;

// Mirrors server/lib/geo.js — used only for an instant fare preview before
// booking; the server always recomputes the authoritative fare on POST.
export function estimateDistanceKm(lat1, lng1, lat2, lng2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.max(0.3, EARTH_RADIUS_KM * c * ROAD_WINDING_FACTOR);
}
