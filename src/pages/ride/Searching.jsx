import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/TopBar.jsx';
import { api } from '../../lib/api.js';
import { useRideDraft } from '../../context/RideContext.jsx';
import { CarIcon } from '../../components/icons.jsx';

const MIN_ANIMATION_MS = 800;

export default function Searching() {
  const navigate = useNavigate();
  const { draft, resetDraft } = useRideDraft();
  const [error, setError] = useState('');

  useEffect(() => {
    if (!draft.pickup || !draft.dropoff || !draft.vehicleType) {
      navigate('/location/search/dropoff', { replace: true });
      return;
    }

    let cancelled = false;
    const startedAt = Date.now();

    api
      .post('/api/rides', {
        vehicleType: draft.vehicleType,
        pickup: draft.pickup,
        dropoff: draft.dropoff,
        paymentMethod: draft.paymentMethod,
      })
      .then((ride) => {
        const wait = Math.max(0, MIN_ANIMATION_MS - (Date.now() - startedAt));
        setTimeout(() => {
          if (cancelled) return;
          resetDraft();
          // The ride may still be 'searching' for a driver at this point —
          // the tracking screen owns showing that state and keeps polling.
          navigate(`/ride/${ride.id}/tracking`, { replace: true });
        }, wait);
      })
      .catch((err) => !cancelled && setError(err.message));

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <div className="flex flex-1 flex-col">
        <TopBar title="Booking" />
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <p className="text-sm text-danger">{error}</p>
          <div className="mt-6 w-full space-y-3">
            <button type="button" className="btn-primary" onClick={() => navigate('/ride/select-vehicle')}>
              Try Again
            </button>
            <button type="button" className="btn-outline" onClick={() => navigate('/home')}>
              Back Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-ink px-8 text-center text-white">
      <div className="relative flex h-28 w-28 items-center justify-center">
        <span className="absolute h-full w-full animate-ping rounded-full bg-primary/30" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary">
          <CarIcon stroke="#1A1A1A" />
        </div>
      </div>
      <h2 className="mt-8 text-xl font-semibold">Requesting your ride…</h2>
      <p className="mt-2 text-sm text-white/60">We&apos;ll match you with a nearby driver</p>
    </div>
  );
}
