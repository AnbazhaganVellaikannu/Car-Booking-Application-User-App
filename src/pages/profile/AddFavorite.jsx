import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/TopBar.jsx';
import Spinner from '../../components/Spinner.jsx';
import { api } from '../../lib/api.js';
import { SearchIcon, PinIcon } from '../../components/icons.jsx';

const LABELS = ['Home', 'Work', 'Other'];

export default function AddFavorite() {
  const navigate = useNavigate();
  const [label, setLabel] = useState('Home');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (query.trim().length < 3) return setResults([]);
    setSearching(true);
    const handle = setTimeout(() => {
      api
        .get(`/api/geocode/search?q=${encodeURIComponent(query)}`)
        .then(setResults)
        .catch(() => setResults([]))
        .finally(() => setSearching(false));
    }, 400);
    return () => clearTimeout(handle);
  }, [query]);

  async function save(place) {
    setSaving(true);
    setError('');
    try {
      await api.post('/api/favorites', { label, address: place.label, lat: place.lat, lng: place.lng });
      navigate('/profile/favorites', { replace: true });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title="Add a place" />
      <div className="flex-1 overflow-y-auto px-5 pb-8">
        <div className="flex gap-2">
          {LABELS.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLabel(l)}
              className={`flex-1 rounded-xl py-2.5 text-sm font-medium ${
                label === l ? 'bg-ink text-white' : 'bg-surface-muted text-ink-soft'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-xl border border-surface-border bg-surface-muted px-4 py-3">
          <SearchIcon stroke="#8A8A8A" />
          <input
            id="favorite-address"
            className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none"
            placeholder="Search address"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {searching && <Spinner className="h-4 w-4" />}
        </div>

        {error && <p className="mt-2 text-sm text-danger">{error}</p>}

        <div className="mt-4 space-y-2">
          {results.map((place, i) => (
            <button
              key={i}
              type="button"
              disabled={saving}
              onClick={() => save(place)}
              className="flex w-full items-center gap-3 rounded-xl border border-surface-border bg-white px-4 py-3 text-left active:scale-[0.99]"
            >
              <PinIcon />
              <span className="truncate text-sm text-ink">{place.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
