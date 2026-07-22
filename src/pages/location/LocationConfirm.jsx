import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/TopBar.jsx';
import MapView from '../../components/MapView.jsx';
import { useRideDraft } from '../../context/RideContext.jsx';
import { estimateDistanceKm } from '../../lib/geo.js';
import { PinIcon } from '../../components/icons.jsx';

export default function LocationConfirm() {
  const navigate = useNavigate();
  const { draft } = useRideDraft();

  useEffect(() => {
    if (!draft.pickup || !draft.dropoff) navigate('/location/search/dropoff', { replace: true });
  }, [draft, navigate]);

  if (!draft.pickup || !draft.dropoff) return null;

  const distanceKm = estimateDistanceKm(draft.pickup.lat, draft.pickup.lng, draft.dropoff.lat, draft.dropoff.lng);

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title="Confirm trip" />
      <MapView pickup={draft.pickup} dropoff={draft.dropoff} height="45vh" />

      <div className="flex-1 space-y-3 px-5 py-5">
        <div className="flex gap-3">
          <div className="mt-1 flex flex-col items-center">
            <span className="h-2.5 w-2.5 rounded-full bg-success" />
            <span className="my-1 h-8 w-px border-l border-dashed border-surface-border" />
            <PinIcon stroke="#FF3B30" width={14} height={14} />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <p className="text-xs text-ink-faint">Pickup</p>
              <p className="text-sm font-medium text-ink">{draft.pickup.address}</p>
            </div>
            <div>
              <p className="text-xs text-ink-faint">Drop-off</p>
              <p className="text-sm font-medium text-ink">{draft.dropoff.address}</p>
            </div>
          </div>
        </div>

        <div className="card flex items-center justify-between">
          <span className="text-sm text-ink-soft">Estimated distance</span>
          <span className="text-sm font-semibold text-ink">{distanceKm.toFixed(1)} km</span>
        </div>
      </div>

      <div className="px-5 pb-8">
        <button type="button" className="btn-primary" onClick={() => navigate('/ride/select-vehicle')}>
          Confirm Trip
        </button>
      </div>
    </div>
  );
}
