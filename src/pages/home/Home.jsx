import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../../lib/authClient.js';
import { useRideDraft } from '../../context/RideContext.jsx';
import { api } from '../../lib/api.js';
import { useAsync } from '../../lib/useAsync.js';
import BottomNav from '../../components/BottomNav.jsx';
import { BellIcon, SearchIcon, PinIcon, ClockIcon, ChevronRightIcon } from '../../components/icons.jsx';

export default function Home() {
  const navigate = useNavigate();
  const { data } = useSession();
  const { resetDraft } = useRideDraft();
  const { data: favorites } = useAsync(() => api.get('/api/favorites'), []);
  const { data: recentRides } = useAsync(() => api.get('/api/rides?status=completed'), []);

  const firstName = data?.user?.name?.split(' ')[0] || 'there';

  function startBooking() {
    resetDraft();
    navigate('/location/search/dropoff');
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="top-bar pb-2">
        <div className="flex-1">
          <p className="text-xs text-ink-faint">Good to see you</p>
          <h1 className="text-lg font-semibold text-ink">{firstName}</h1>
        </div>
        <button type="button" className="icon-btn" onClick={() => navigate('/notifications')} aria-label="Notifications">
          <BellIcon />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4">
        <button
          type="button"
          onClick={startBooking}
          className="mt-2 flex w-full items-center gap-3 rounded-2xl bg-ink px-4 py-4 text-left text-white shadow-card active:scale-[0.99]"
        >
          <SearchIcon />
          <span className="text-sm text-white/70">Where are you going?</span>
        </button>

        <div className="mt-6 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink">Saved places</h2>
          <button type="button" className="text-xs font-medium text-ink-faint" onClick={() => navigate('/profile/favorites')}>
            Manage
          </button>
        </div>
        <div className="mt-3 space-y-2">
          {(favorites?.length ? favorites : [{ id: 'home', label: 'Home', address: 'Add your home address', placeholder: true }, { id: 'work', label: 'Work', address: 'Add your work address', placeholder: true }]).map((place) => (
            <button
              key={place.id}
              type="button"
              onClick={startBooking}
              className="flex w-full items-center gap-3 rounded-xl border border-surface-border bg-white px-4 py-3 text-left active:scale-[0.99]"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light">
                <PinIcon stroke="#1A1A1A" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink">{place.label}</p>
                <p className="truncate text-xs text-ink-faint">{place.address}</p>
              </div>
              <ChevronRightIcon stroke="#8A8A8A" />
            </button>
          ))}
        </div>

        {recentRides?.length > 0 && (
          <>
            <div className="mt-6 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-ink">Recent trips</h2>
              <button type="button" className="text-xs font-medium text-ink-faint" onClick={() => navigate('/history')}>
                See all
              </button>
            </div>
            <div className="mt-3 space-y-2">
              {recentRides.slice(0, 3).map((ride) => (
                <div key={ride.id} className="flex items-center gap-3 rounded-xl border border-surface-border bg-white px-4 py-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-muted">
                    <ClockIcon />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{ride.dropoff.address}</p>
                    <p className="text-xs text-ink-faint">{new Date(ride.requestedAt).toLocaleDateString()}</p>
                  </div>
                  <p className="text-sm font-semibold text-ink">${ride.estimatedFare}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
