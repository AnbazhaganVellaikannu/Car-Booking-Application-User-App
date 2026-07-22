import React from 'react';
import { useRef } from 'react';

export default function OtpInput({ length = 4, value, onChange }) {
  const refs = useRef([]);

  function setDigit(i, digit) {
    const chars = value.split('');
    chars[i] = digit;
    const next = chars.join('').slice(0, length);
    onChange(next);
    if (digit && i < length - 1) refs.current[i + 1]?.focus();
  }

  function handleKeyDown(i, e) {
    if (e.key === 'Backspace' && !value[i] && i > 0) refs.current[i - 1]?.focus();
  }

  return (
    <div className="flex justify-center gap-3">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          id={`otp-digit-${i}`}
          aria-label={`Digit ${i + 1}`}
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          onChange={(e) => setDigit(i, e.target.value.replace(/\D/g, ''))}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className="h-14 w-14 rounded-xl border border-surface-border bg-surface-muted text-center text-xl font-semibold text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      ))}
    </div>
  );
}
