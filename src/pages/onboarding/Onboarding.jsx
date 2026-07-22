import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CarIcon, PinIcon, WalletIcon } from '../../components/icons.jsx';

const SLIDES = [
  {
    Icon: CarIcon,
    title: 'Ride whenever you need',
    body: 'Book a ride in seconds and get picked up by a nearby driver, day or night.',
  },
  {
    Icon: PinIcon,
    title: 'Track your trip live',
    body: 'Watch your driver arrive and follow your route on the map in real time.',
  },
  {
    Icon: WalletIcon,
    title: 'Simple, upfront pricing',
    body: "Know your fare before you book — no surprises when you arrive.",
  },
];

export default function Onboarding() {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  const slide = SLIDES[index];
  const isLast = index === SLIDES.length - 1;

  function finish() {
    localStorage.setItem('easyride_onboarded', '1');
    navigate('/enable-location');
  }

  return (
    <div className="flex flex-1 flex-col px-6 pb-8 pt-10">
      <div className="flex justify-end">
        <button type="button" onClick={finish} className="text-sm font-medium text-ink-faint">
          Skip
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary-light">
          <slide.Icon stroke="#1A1A1A" width={40} height={40} />
        </div>
        <h2 className="mt-8 text-2xl font-bold text-ink">{slide.title}</h2>
        <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-soft">{slide.body}</p>
      </div>

      <div className="mb-8 flex justify-center gap-2">
        {SLIDES.map((_, i) => (
          <span
            key={i}
            className={`h-2 rounded-full transition-all ${i === index ? 'w-6 bg-primary' : 'w-2 bg-surface-border'}`}
          />
        ))}
      </div>

      <button
        type="button"
        className="btn-dark"
        onClick={() => (isLast ? finish() : setIndex((i) => i + 1))}
      >
        {isLast ? 'Get Started' : 'Next'}
      </button>
    </div>
  );
}
