import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/TopBar.jsx';
import Spinner from '../../components/Spinner.jsx';
import { api } from '../../lib/api.js';
import { useAsync } from '../../lib/useAsync.js';
import { PinIcon } from '../../components/icons.jsx';

export default function Favorites() {
  const navigate = useNavigate();
  const { data: favorites, loading, error } = useAsync(() => api.get('/api/favorites'), []);
  const [list, setList] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  const items = list ?? favorites ?? [];

  async function remove(id) {
    setRemovingId(id);
    try {
      await api.del(`/api/favorites/${id}`);
      setList(items.filter((f) => f.id !== id));
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title="Saved places" />
      <div className="flex-1 overflow-y-auto px-5 pb-4">
        <button type="button" className="btn-outline mb-4" onClick={() => navigate('/profile/favorites/add')}>
          + Add a place
        </button>

        {loading && (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        )}
        {error && <p className="text-sm text-danger">{error.message}</p>}
        {!loading && items.length === 0 && (
          <p className="mt-6 text-center text-sm text-ink-faint">No saved places yet.</p>
        )}

        <div className="space-y-2">
          {items.map((place) => (
            <div key={place.id} className="flex items-center gap-3 rounded-xl border border-surface-border bg-white px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light">
                <PinIcon stroke="#1A1A1A" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink">{place.label}</p>
                <p className="truncate text-xs text-ink-faint">{place.address}</p>
              </div>
              <button
                type="button"
                onClick={() => remove(place.id)}
                disabled={removingId === place.id}
                className="text-xs font-semibold text-danger"
              >
                {removingId === place.id ? '…' : 'Remove'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
