import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BackIcon } from './icons.jsx';

export default function TopBar({ title, onBack, right = null }) {
  const navigate = useNavigate();
  return (
    <div className="top-bar">
      <button
        type="button"
        className="icon-btn"
        onClick={() => (onBack ? onBack() : navigate(-1))}
        aria-label="Go back"
      >
        <BackIcon />
      </button>
      {title && <h1 className="flex-1 text-lg font-semibold text-ink">{title}</h1>}
      {right}
    </div>
  );
}
