import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/TopBar.jsx';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (form.password.length < 8) return setError('Password must be at least 8 characters.');
    if (form.password !== form.confirm) return setError('Passwords do not match.');
    navigate('/signin', { replace: true });
  }

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title="Set New Password" />
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4 px-6 pb-8 pt-2">
        <p className="rounded-xl bg-primary-light px-4 py-3 text-xs leading-relaxed text-ink-soft">
          Demo build note: password-reset email delivery isn&apos;t configured yet, so this screen doesn&apos;t
          change a real password. Log in with your original password on the next screen.
        </p>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink-soft">
            New password
          </label>
          <input
            id="password"
            type="password"
            className="input-field"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="confirm" className="mb-1.5 block text-sm font-medium text-ink-soft">
            Confirm password
          </label>
          <input
            id="confirm"
            type="password"
            className="input-field"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          />
        </div>
        {error && <p className="text-sm text-danger">{error}</p>}
        <div className="flex-1" />
        <button type="submit" className="btn-primary">
          Continue to Log In
        </button>
      </form>
    </div>
  );
}
