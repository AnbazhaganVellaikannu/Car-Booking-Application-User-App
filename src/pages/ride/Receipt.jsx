import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { useAsync } from '../../lib/useAsync.js';
import Spinner from '../../components/Spinner.jsx';
import { CheckCircleIcon, DownloadIcon, PinIcon } from '../../components/icons.jsx';

export default function Receipt() {
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
        <CheckCircleIcon stroke="#FEC400" />
        <h2 className="mt-5 text-2xl font-bold text-ink">Thank you for riding!</h2>
        <p className="mt-1 text-sm text-ink-faint">
          {new Date(ride.completedAt || ride.requestedAt).toLocaleString()}
        </p>

        <div className="card mt-8 w-full text-left">
          <div className="flex gap-3">
            <div className="mt-1 flex flex-col items-center">
              <span className="h-2.5 w-2.5 rounded-full bg-success" />
              <span className="my-1 h-8 w-px border-l border-dashed border-surface-border" />
              <PinIcon stroke="#FF3B30" width={13} height={13} />
            </div>
            <div className="flex-1 space-y-3">
              <p className="truncate text-sm text-ink-soft">{ride.pickup.address}</p>
              <p className="truncate text-sm text-ink-soft">{ride.dropoff.address}</p>
            </div>
          </div>
          <div className="mt-4 flex justify-between border-t border-surface-border pt-3">
            <span className="text-sm text-ink-soft">Total paid</span>
            <span className="text-base font-bold text-ink">${ride.estimatedFare}</span>
          </div>
        </div>
      </div>

      <a href={`/api/rides/${id}/receipt`} download className="btn-outline mb-3">
        <DownloadIcon className="mr-2" />
        Download Receipt
      </a>
      <button type="button" className="btn-primary" onClick={() => navigate('/home', { replace: true })}>
        Done
      </button>
    </div>
  );
}
