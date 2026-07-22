import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MapView from '../../components/MapView.jsx';
import Spinner from '../../components/Spinner.jsx';
import { api } from '../../lib/api.js';
import { BackIcon, PhoneIcon, MessageIcon, StarIcon, PinIcon } from '../../components/icons.jsx';

const PHASE_COPY = {
  searching: 'Looking for a nearby driver…',
  driver_assigned: 'Your driver is on the way',
  arrived_pickup: 'Your driver has arrived',
  in_progress: 'Trip in progress',
};

const CANCEL_REASONS = ['Driver is taking too long', 'Booked by mistake', 'Change of plans', 'Other'];

export default function RideTracking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ride, setRide] = useState(null);
  const [error, setError] = useState('');
  const [showCancel, setShowCancel] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const data = await api.get(`/api/rides/${id}`);
        if (cancelled) return;
        setRide(data);
        if (data.status === 'completed') {
          navigate(`/ride/${id}/payment`, { replace: true });
          return;
        }
        if (data.status === 'cancelled') return;
        timerRef.current = setTimeout(poll, 2000);
      } catch (err) {
        if (!cancelled) setError(err.message);
      }
    }
    poll();

    return () => {
      cancelled = true;
      clearTimeout(timerRef.current);
    };
  }, [id, navigate]);

  async function confirmCancel() {
    setCancelling(true);
    try {
      await api.post(`/api/rides/${id}/cancel`);
      navigate('/home', { replace: true });
    } catch (err) {
      setError(err.message);
      setCancelling(false);
      setShowCancel(false);
    }
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <p className="text-sm text-danger">{error}</p>
        <button type="button" className="btn-primary mt-6" onClick={() => navigate('/home')}>
          Back Home
        </button>
      </div>
    );
  }

  if (!ride) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const canCancel = ['searching', 'driver_assigned', 'arrived_pickup'].includes(ride.phase);

  return (
    <div className="relative flex flex-1 flex-col">
      <button
        type="button"
        onClick={() => navigate('/home')}
        className="icon-btn absolute left-4 top-4 z-10 bg-white shadow-card"
        aria-label="Close"
      >
        <BackIcon />
      </button>

      <MapView pickup={ride.pickup} dropoff={ride.dropoff} driver={ride.driver} height="52vh" />

      <div className="flex-1 rounded-t-3xl bg-white px-5 pb-8 pt-5 shadow-sheet">
        <p className="text-center text-sm font-semibold text-ink">{PHASE_COPY[ride.phase] || 'On the way'}</p>
        {ride.phase === 'searching' && (
          <p className="mt-1 text-center text-xs text-ink-faint">This can take a minute — hang tight</p>
        )}

        {!ride.driver && (
          <div className="card mt-4 flex items-center justify-center gap-3 py-6">
            <Spinner />
            <span className="text-sm text-ink-faint">Matching you with a driver…</span>
          </div>
        )}

        {ride.driver && (
          <div className="card mt-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-light text-base font-semibold text-ink">
              {ride.driver.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-ink">{ride.driver.name}</p>
              <div className="flex items-center gap-1 text-xs text-ink-faint">
                <StarIcon filled width={13} height={13} />
                {ride.driver.rating.toFixed(1)} · {ride.driver.vehicleColor} {ride.driver.vehicleMake} {ride.driver.vehicleModel}
              </div>
              <p className="text-xs font-medium text-ink-soft">{ride.driver.vehiclePlate}</p>
            </div>
            <div className="flex gap-2">
              <a href={`tel:${ride.driver.phone}`} className="icon-btn bg-primary-light">
                <PhoneIcon width={17} height={17} />
              </a>
              <button type="button" className="icon-btn bg-primary-light" aria-label="Message driver">
                <MessageIcon width={17} height={17} />
              </button>
            </div>
          </div>
        )}

        <div className="mt-4 flex gap-3 text-sm">
          <div className="mt-1 flex flex-col items-center">
            <span className="h-2.5 w-2.5 rounded-full bg-success" />
            <span className="my-1 h-6 w-px border-l border-dashed border-surface-border" />
            <PinIcon stroke="#FF3B30" width={13} height={13} />
          </div>
          <div className="flex-1 space-y-3">
            <p className="truncate text-ink-soft">{ride.pickup.address}</p>
            <p className="truncate text-ink-soft">{ride.dropoff.address}</p>
          </div>
          <p className="shrink-0 self-start font-semibold text-ink">${ride.estimatedFare}</p>
        </div>

        {canCancel && (
          <button type="button" className="btn-outline mt-5 !text-danger" onClick={() => setShowCancel(true)}>
            Cancel Ride
          </button>
        )}
      </div>

      {showCancel && (
        <div className="absolute inset-0 z-20 flex items-end bg-black/40">
          <div className="w-full rounded-t-3xl bg-white p-5">
            <h3 className="text-base font-semibold text-ink">Cancel this ride?</h3>
            <p className="mt-1 text-sm text-ink-faint">Let us know why (optional):</p>
            <div className="mt-3 space-y-2">
              {CANCEL_REASONS.map((reason) => (
                <div key={reason} className="rounded-xl border border-surface-border px-4 py-2.5 text-sm text-ink-soft">
                  {reason}
                </div>
              ))}
            </div>
            <div className="mt-5 space-y-2">
              <button type="button" className="btn-dark !bg-danger" onClick={confirmCancel} disabled={cancelling}>
                {cancelling ? <Spinner className="border-white/40 border-t-white" /> : 'Confirm Cancellation'}
              </button>
              <button type="button" className="btn-outline" onClick={() => setShowCancel(false)}>
                Keep Ride
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
