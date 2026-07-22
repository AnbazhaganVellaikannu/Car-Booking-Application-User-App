import React from 'react';
export default function Spinner({ className = '' }) {
  return (
    <div
      className={`h-6 w-6 animate-spin rounded-full border-2 border-ink/20 border-t-ink ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}
