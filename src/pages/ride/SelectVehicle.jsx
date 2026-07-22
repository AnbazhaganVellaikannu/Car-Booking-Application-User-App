import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/TopBar.jsx';
import Spinner from '../../components/Spinner.jsx';
import { api } from '../../lib/api.js';
import { useAsync } from '../../lib/useAsync.js';
import { useRideDraft } from '../../context/RideContext.jsx';
import { estimateDistanceKm } from '../../lib/geo.js';
import { BikeIcon, CarIcon } from '../../components/icons.jsx';

const VEHICLE_ICON = { bike: BikeIcon, economy: CarIcon, comfort: CarIcon, premium: CarIcon };
const PAYMENT_METHODS = [
  { id: 'cash', label: 'Cash' },
  { id: 'card', label: 'Card' },
  { id: 'wallet', label: 'Wallet' },
];

export default function SelectVehicle() {
  const navigate = useNavigate();
  const { draft, setVehicleType, setPaymentMethod } = useRideDraft();
  const { data: vehicleTypes, loading } = useAsync(() => api.get('/api/vehicle-types'), []);

  useEffect(() => {
    if (!draft.pickup || !draft.dropoff) navigate('/location/search/dropoff', { replace: true });
  }, [draft, navigate]);

  useEffect(() => {
    if (vehicleTypes?.length && !draft.vehicleType) setVehicleType(vehicleTypes[0].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicleTypes]);

  if (!draft.pickup || !draft.dropoff) return null;

  const distanceKm = estimateDistanceKm(draft.pickup.lat, draft.pickup.lng, draft.dropoff.lat, draft.dropoff.lng);

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title="Choose a ride" />

      <div className="flex-1 overflow-y-auto px-5 pb-4">
        {loading && (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        )}

        <div className="space-y-3">
          {vehicleTypes?.map((vt) => {
            const Icon = VEHICLE_ICON[vt.id] || CarIcon;
            const price = Math.round(vt.baseFare + vt.perKmRate * distanceKm);
            const selected = draft.vehicleType === vt.id;
            return (
              <button
                key={vt.id}
                type="button"
                onClick={() => setVehicleType(vt.id)}
                className={`flex w-full items-center gap-4 rounded-2xl border px-4 py-3.5 text-left transition ${
                  selected ? 'border-primary bg-primary-light' : 'border-surface-border bg-white'
                }`}
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white">
                  <Icon />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink">{vt.name}</p>
                  <p className="truncate text-xs text-ink-faint">{vt.description}</p>
                  <p className="mt-0.5 text-xs text-ink-faint">{vt.etaMin} min away · {vt.capacity} seats</p>
                </div>
                <p className="text-base font-bold text-ink">${price}</p>
              </button>
            );
          })}
        </div>

        <p className="mb-2 mt-6 text-xs font-semibold uppercase tracking-wide text-ink-faint">Payment method</p>
        <div className="flex gap-2">
          {PAYMENT_METHODS.map((pm) => (
            <button
              key={pm.id}
              type="button"
              onClick={() => setPaymentMethod(pm.id)}
              className={`flex-1 rounded-xl border py-2.5 text-sm font-medium ${
                draft.paymentMethod === pm.id ? 'border-ink bg-ink text-white' : 'border-surface-border bg-white text-ink-soft'
              }`}
            >
              {pm.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pb-8">
        <button
          type="button"
          className="btn-primary"
          disabled={!draft.vehicleType}
          onClick={() => navigate('/ride/searching')}
        >
          Book Ride
        </button>
      </div>
    </div>
  );
}
