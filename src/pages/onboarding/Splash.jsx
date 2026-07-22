import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../../lib/authClient.js';
import { CarIcon } from '../../components/icons.jsx';

export default function Splash() {
  const navigate = useNavigate();
  const { data, isPending } = useSession();

  useEffect(() => {
    if (isPending) return;
    const timer = setTimeout(() => {
      if (data?.user) return navigate('/home', { replace: true });
      if (!localStorage.getItem('easyride_onboarded')) return navigate('/onboarding', { replace: true });
      navigate('/welcome', { replace: true });
    }, 1100);
    return () => clearTimeout(timer);
  }, [isPending, data, navigate]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-ink text-white">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary">
        <CarIcon stroke="#1A1A1A" />
      </div>
      <h1 className="mt-6 text-2xl font-bold tracking-tight">Easy Ride</h1>
      <p className="mt-1 text-sm text-white/60">Your ride, your way</p>
    </div>
  );
}
