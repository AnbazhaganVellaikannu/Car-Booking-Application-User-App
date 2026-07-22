const EARTH_RADIUS_KM = 6371;
const ROAD_WINDING_FACTOR = 1.3; // straight-line distance underestimates real routes

export function haversineKm(lat1, lng1, lat2, lng2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

export function routeDistanceKm(lat1, lng1, lat2, lng2) {
  return Math.max(0.3, haversineKm(lat1, lng1, lat2, lng2) * ROAD_WINDING_FACTOR);
}

// Once a trip is 'in_progress' the driver's real GPS rarely moves in a demo
// setting (nobody is actually driving), so the tracking map would look
// frozen. Instead we animate a simulated position from pickup to dropoff,
// advancing in fixed 5-second steps — a deliberate "hop" every tick rather
// than a continuous glide, matching how the map re-renders on each poll.
const ANIMATION_STEP_SECONDS = 5;
const AVG_TRIP_SPEED_KMH = 25; // demo pace, not meant to reflect real traffic

export function tripAnimationDurationSeconds(distanceKm) {
  const seconds = (distanceKm / AVG_TRIP_SPEED_KMH) * 3600;
  return Math.min(120, Math.max(ANIMATION_STEP_SECONDS * 2, Math.round(seconds)));
}

export function tripAnimationFraction(startedAt, distanceKm) {
  const elapsedSeconds = (Date.now() - new Date(startedAt).getTime()) / 1000;
  const quantizedElapsed = Math.floor(elapsedSeconds / ANIMATION_STEP_SECONDS) * ANIMATION_STEP_SECONDS;
  const duration = tripAnimationDurationSeconds(distanceKm);
  return Math.min(1, Math.max(0, quantizedElapsed / duration));
}
