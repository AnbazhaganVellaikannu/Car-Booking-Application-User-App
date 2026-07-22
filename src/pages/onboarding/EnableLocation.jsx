import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PinIcon } from '../../components/icons.jsx';

export default function EnableLocation() {
  const navigate = useNavigate();

  function enable() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => navigate('/welcome'),
        () => navigate('/welcome'),
        { timeout: 4000 }
      );
    } else {
      navigate('/welcome');
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary-light">
        <PinIcon stroke="#1A1A1A" width={36} height={36} />
      </div>
      <h2 className="mt-8 text-2xl font-bold text-ink">Enable your location</h2>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">
        We use your location to match you with nearby drivers and get your pickup point exactly right.
      </p>

      <div className="mt-10 w-full space-y-3">
        <button type="button" className="btn-primary" onClick={enable}>
          Enable Location
        </button>
        <button type="button" className="btn-outline" onClick={() => navigate('/welcome')}>
          Maybe Later
        </button>
      </div>
    </div>
  );
}
