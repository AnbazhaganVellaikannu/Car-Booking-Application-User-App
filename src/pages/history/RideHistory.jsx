import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { useAsync } from '../../lib/useAsync.js';
import Spinner from '../../components/Spinner.jsx';
import BottomNav from '../../components/BottomNav.jsx';
import { DownloadIcon, PinIcon, StarIcon } from '../../components/icons.jsx';

const TABS = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
];

const STATUS_LABEL = {
  requested: 'Finding driver',
  matched: 'Driver on the way',
  arrived: 'Driver arrived',
  in_progress: 'In progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export default function RideHistory() {
  const [tab, setTab] = useState('completed');
  const navigate = useNavigate();
  const { data: rides, loading } = useAsync(() => api.get(`/api/rides?status=${tab}`), [tab]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="top-bar">
        <h1 className="text-lg font-semibold text-ink">Your trips</h1>
      </div>

      <div className="flex gap-2 px-5">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-xl py-2 text-sm font-medium ${
              tab === t.id ? 'bg-ink text-white' : 'bg-surface-muted text-ink-soft'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
        {loading && (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        )}

        {!loading && rides?.length === 0 && (
          <p className="mt-10 text-center text-sm text-ink-faint">No {tab} rides yet.</p>
        )}

        {rides?.map((ride) => {
          const clickable = tab === 'upcoming';
          return (
            <div
              key={ride.id}
              role={clickable ? 'button' : undefined}
              tabIndex={clickable ? 0 : undefined}
              onClick={clickable ? () => navigate(`/ride/${ride.id}/tracking`) : undefined}
              className={`card w-full text-left ${clickable ? 'cursor-pointer' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <div className="mt-1 flex flex-col items-center">
                    <span className="h-2.5 w-2.5 rounded-full bg-success" />
                    <span className="my-1 h-6 w-px border-l border-dashed border-surface-border" />
                    <PinIcon stroke="#FF3B30" width={13} height={13} />
                  </div>
                  <div className="space-y-2.5">
                    <p className="max-w-[46vw] truncate text-sm text-ink-soft">{ride.pickup.address}</p>
                    <p className="max-w-[46vw] truncate text-sm text-ink-soft">{ride.dropoff.address}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-ink">${ride.estimatedFare}</p>
                  <p className="mt-1 text-xs text-ink-faint">{new Date(ride.requestedAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-surface-border pt-3">
                <span className="text-xs capitalize text-ink-faint">
                  {STATUS_LABEL[ride.status] || ride.status}
                </span>
                <div className="flex items-center gap-3">
                  {ride.rating ? (
                    <span className="flex items-center gap-1 text-xs text-ink-soft">
                      <StarIcon filled width={13} height={13} /> {ride.rating}
                    </span>
                  ) : (
                    ride.status === 'completed' && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/ride/${ride.id}/rate`);
                        }}
                        className="text-xs font-semibold text-ink"
                      >
                        Rate trip
                      </button>
                    )
                  )}
                  {ride.status === 'completed' && (
                    <a
                      href={`/api/rides/${ride.id}/receipt`}
                      download
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 text-xs font-semibold text-ink"
                    >
                      <DownloadIcon width={13} height={13} /> Receipt
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
}
