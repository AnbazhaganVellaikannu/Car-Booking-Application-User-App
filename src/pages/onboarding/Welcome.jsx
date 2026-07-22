import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CarIcon } from '../../components/icons.jsx';

export default function Welcome() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-1 flex-col justify-end bg-ink px-6 pb-10 text-white">
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary">
          <CarIcon stroke="#1A1A1A" />
        </div>
        <h1 className="mt-6 text-3xl font-bold">Easy Ride</h1>
        <p className="mt-2 text-sm text-white/60">Fast, reliable rides — anytime, anywhere</p>
      </div>

      <div className="space-y-3">
        <button type="button" className="btn-primary" onClick={() => navigate('/signup')}>
          Create Account
        </button>
        <button
          type="button"
          className="flex w-full items-center justify-center rounded-xl border border-white/20 py-4 text-base font-semibold text-white active:scale-[0.98]"
          onClick={() => navigate('/signin')}
        >
          Log In
        </button>
      </div>
    </div>
  );
}
