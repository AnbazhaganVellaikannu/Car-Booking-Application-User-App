import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { useAsync } from '../../lib/useAsync.js';
import Spinner from '../../components/Spinner.jsx';
import { CheckCircleIcon } from '../../components/icons.jsx';

const METHOD_LABEL = { cash: 'Cash', card: 'Card', wallet: 'Wallet' };

export default function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: ride, loading } = useAsync(() => api.get(`/api/rides/${id}`), [id]);

  if (loading || !ride) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col px-6 pb-8 pt-12">
      <div className="flex flex-1 flex-col items-center text-center">
        <CheckCircleIcon stroke="#2ECC71" />
        <h2 className="mt-5 text-2xl font-bold text-ink">Trip complete</h2>
        <p className="mt-1 text-sm text-ink-faint">Thanks for riding with us</p>

        <div className="card mt-8 w-full text-left">
          <div className="flex justify-between border-b border-surface-border pb-3">
            <span className="text-sm text-ink-soft">Distance</span>
            <span className="text-sm font-medium text-ink">{ride.distanceKm.toFixed(1)} km</span>
          </div>
          <div className="flex justify-between border-b border-surface-border py-3">
            <span className="text-sm text-ink-soft">Payment method</span>
            <span className="text-sm font-medium text-ink">{METHOD_LABEL[ride.paymentMethod]}</span>
          </div>
          <div className="flex justify-between pt-3">
            <span className="text-base font-semibold text-ink">Total fare</span>
            <span className="text-base font-bold text-ink">${ride.estimatedFare}</span>
          </div>
        </div>
      </div>

      <button type="button" className="btn-primary" onClick={() => navigate(`/ride/${id}/rate`)}>
        Continue
      </button>
    </div>
  );
}
