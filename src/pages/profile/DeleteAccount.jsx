import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/TopBar.jsx';
import Spinner from '../../components/Spinner.jsx';
import { authClient } from '../../lib/authClient.js';

export default function DeleteAccount() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirming, setConfirming] = useState(false);

  async function handleDelete() {
    setLoading(true);
    setError('');
    const { error: deleteError } = await authClient.deleteUser({ password });
    setLoading(false);
    if (deleteError) return setError(deleteError.message || 'Could not delete your account.');
    navigate('/welcome', { replace: true });
  }

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title="Delete Account" />
      <div className="flex flex-1 flex-col px-6 pb-8 pt-2">
        <p className="text-sm leading-relaxed text-ink-soft">
          Deleting your account permanently removes your profile, saved places, and ride history. This can&apos;t be
          undone.
        </p>

        {!confirming ? (
          <button type="button" className="btn-outline mt-6 !text-danger" onClick={() => setConfirming(true)}>
            Continue
          </button>
        ) : (
          <div className="mt-6 space-y-3">
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink-soft">
              Confirm your password
            </label>
            <input
              id="password"
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-sm text-danger">{error}</p>}
            <button type="button" className="btn-dark !bg-danger" onClick={handleDelete} disabled={loading}>
              {loading ? <Spinner className="border-white/40 border-t-white" /> : 'Permanently Delete Account'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
