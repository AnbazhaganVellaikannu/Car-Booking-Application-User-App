import React from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';

function pinIcon(color) {
  return L.divIcon({
    className: '',
    html: `<div style="width:16px;height:16px;border-radius:9999px;background:${color};border:3px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4)"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

function carIcon() {
  return L.divIcon({
    className: '',
    html: `<div style="width:30px;height:30px;border-radius:9999px;background:#1A1A1A;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.35)"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FEC400" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 13l1.6-4.8A2 2 0 016.5 7h11a2 2 0 011.9 1.2L21 13"/><rect x="3" y="13" width="18" height="6" rx="2"/></svg></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}

function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0], 15);
      return;
    }
    map.fitBounds(points, { padding: [48, 48] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(points)]);
  return null;
}

export default function MapView({ pickup, dropoff, driver, height = '280px', className = '' }) {
  const points = [];
  if (pickup) points.push([pickup.lat, pickup.lng]);
  if (dropoff) points.push([dropoff.lat, dropoff.lng]);

  const center = points[0] || [37.7749, -122.4194];

  return (
    <div className={`overflow-hidden ${className}`} style={{ height }}>
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        zoomControl={false}
        fadeAnimation={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {pickup && <Marker position={[pickup.lat, pickup.lng]} icon={pinIcon('#2ECC71')} />}
        {dropoff && <Marker position={[dropoff.lat, dropoff.lng]} icon={pinIcon('#FF3B30')} />}
        {pickup && dropoff && (
          <Polyline
            positions={[[pickup.lat, pickup.lng], [dropoff.lat, dropoff.lng]]}
            pathOptions={{ color: '#1A1A1A', weight: 3, dashArray: '2 8', lineCap: 'round' }}
          />
        )}
        {driver?.position && <Marker position={[driver.position.lat, driver.position.lng]} icon={carIcon()} />}
        <FitBounds points={points} />
      </MapContainer>
    </div>
  );
}
