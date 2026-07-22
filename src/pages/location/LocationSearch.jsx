import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TopBar from '../../components/TopBar.jsx';
import Spinner from '../../components/Spinner.jsx';
import { api } from '../../lib/api.js';
import { useAsync } from '../../lib/useAsync.js';
import { useRideDraft } from '../../context/RideContext.jsx';
import { PinIcon, SearchIcon } from '../../components/icons.jsx';

export default function LocationSearch() {
  const { field } = useParams(); // 'pickup' | 'dropoff'
  const navigate = useNavigate();
  const { draft, setPickup, setDropoff } = useRideDraft();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);

  const { data: favorites } = useAsync(() => api.get('/api/favorites'), []);

  useEffect(() => {
    if (query.trim().length < 3) {
      setResults([]);
      return;
    }
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

  function choose(place) {
    // Geocode results come back as { label, lat, lng }; favorites already
    // have { address, lat, lng }. Normalize to `address` here so every
    // downstream consumer (draft state, the booking API) sees one shape.
    const normalized = { address: place.address || place.label, lat: place.lat, lng: place.lng };
    if (field === 'pickup') {
      setPickup(normalized);
      navigate('/location/confirm');
    } else {
      setDropoff(normalized);
      navigate('/location/search/pickup');
    }
  }

  function useCurrentLocation() {
    if (!('geolocation' in navigator)) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        try {
          const place = await api.get(`/api/geocode/reverse?lat=${lat}&lng=${lng}`);
          choose(place);
        } catch {
          choose({ label: 'Current location', lat, lng });
        } finally {
          setLocating(false);
        }
      },
      () => setLocating(false),
      { timeout: 6000 }
    );
  }

  const title = field === 'pickup' ? 'Pickup location' : 'Where to?';

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title={title} />
      <div className="px-5">
        <div className="flex items-center gap-2 rounded-xl border border-surface-border bg-surface-muted px-4 py-3">
          <SearchIcon stroke="#8A8A8A" />
          <input
            autoFocus
            id="location-search"
            className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none"
            placeholder={field === 'pickup' ? 'Search pickup address' : 'Search destination'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {searching && <Spinner className="h-4 w-4" />}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-8 pt-4">
        {field === 'pickup' && (
          <button
            type="button"
            onClick={useCurrentLocation}
            disabled={locating}
            className="mb-4 flex w-full items-center gap-3 rounded-xl bg-primary-light px-4 py-3 text-left active:scale-[0.99]"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
              <PinIcon stroke="#1A1A1A" />
            </div>
            <span className="text-sm font-medium text-ink">
              {locating ? 'Finding your location…' : 'Use current location'}
            </span>
          </button>
        )}

        {results.length === 0 && query.trim().length < 3 && favorites?.length > 0 && (
          <>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">Saved places</p>
            <div className="space-y-2">
              {favorites.map((place) => (
                <ResultRow key={place.id} label={place.label} address={place.address} onClick={() => choose(place)} />
              ))}
            </div>
          </>
        )}

        {results.length > 0 && (
          <div className="space-y-2">
            {results.map((place, i) => (
              <ResultRow key={i} label={place.label.split(',')[0]} address={place.label} onClick={() => choose(place)} />
            ))}
          </div>
        )}

        {query.trim().length >= 3 && !searching && results.length === 0 && (
          <p className="mt-6 text-center text-sm text-ink-faint">No matches. Try a different search.</p>
        )}

        {field === 'pickup' && draft.dropoff && (
          <div className="mt-6 rounded-xl border border-surface-border bg-white px-4 py-3">
            <p className="text-xs text-ink-faint">Destination</p>
            <p className="truncate text-sm font-medium text-ink">{draft.dropoff.address}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ResultRow({ label, address, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl border border-surface-border bg-white px-4 py-3 text-left active:scale-[0.99]"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-muted">
        <PinIcon />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink">{label}</p>
        <p className="truncate text-xs text-ink-faint">{address}</p>
      </div>
    </button>
  );
}
