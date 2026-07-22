import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/TopBar.jsx';
import Spinner from '../../components/Spinner.jsx';
import { authClient } from '../../lib/authClient.js';

export default function ChangePassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.next.length < 8) return setError('New password must be at least 8 characters.');
    if (form.next !== form.confirm) return setError('Passwords do not match.');

    setLoading(true);
    setError('');
    const { error: changeError } = await authClient.changePassword({
      currentPassword: form.current,
      newPassword: form.next,
      revokeOtherSessions: true,
    });
    setLoading(false);
    if (changeError) return setError(changeError.message || 'Could not update password.');
    setDone(true);
    setTimeout(() => navigate('/profile/settings', { replace: true }), 1200);
  }

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title="Change Password" />
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4 px-6 pb-8 pt-2">
        <div>
          <label htmlFor="current" className="mb-1.5 block text-sm font-medium text-ink-soft">
            Current password
          </label>
          <input
            id="current"
            type="password"
            className="input-field"
            value={form.current}
            onChange={(e) => setForm({ ...form, current: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="next" className="mb-1.5 block text-sm font-medium text-ink-soft">
            New password
          </label>
          <input
            id="next"
            type="password"
            className="input-field"
            value={form.next}
            onChange={(e) => setForm({ ...form, next: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="confirm" className="mb-1.5 block text-sm font-medium text-ink-soft">
            Confirm new password
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
        {done && <p className="text-sm text-success">Password updated.</p>}

        <div className="flex-1" />
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? <Spinner className="border-ink/30 border-t-ink" /> : 'Update Password'}
        </button>
      </form>
    </div>
  );
}
