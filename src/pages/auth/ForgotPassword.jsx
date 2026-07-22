import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/TopBar.jsx';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Please enter a valid email address.');
    navigate('/forgot-password/verify', { state: { email } });
  }

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title="Forgot Password" />
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4 px-6 pb-8 pt-2">
        <p className="text-sm text-ink-soft">
          Enter the email linked to your account and we&apos;ll send you a verification code.
        </p>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink-soft">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="input-field"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {error && <p className="text-sm text-danger">{error}</p>}
        <div className="flex-1" />
        <button type="submit" className="btn-primary">
          Send Code
        </button>
      </form>
    </div>
  );
}
