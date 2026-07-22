import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/TopBar.jsx';
import Spinner from '../../components/Spinner.jsx';
import { authClient, signIn } from '../../lib/authClient.js';

export default function SignIn() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error: signInError } = await signIn.email({ email: form.email, password: form.password });
    if (signInError) {
      setLoading(false);
      setError(signInError.message || 'Could not log in. Check your email and password.');
      return;
    }
    await authClient.getSession();
    setLoading(false);
    navigate('/home', { replace: true });
  }

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title="Log In" />
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4 px-6 pb-8 pt-2">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink-soft">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="input-field"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink-soft">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="input-field"
            placeholder="Your password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <button
          type="button"
          className="self-end text-sm font-semibold text-ink"
          onClick={() => navigate('/forgot-password')}
        >
          Forgot password?
        </button>

        {error && <p className="text-sm text-danger">{error}</p>}

        <div className="flex-1" />
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? <Spinner className="border-ink/30 border-t-ink" /> : 'Log In'}
        </button>
        <p className="text-center text-sm text-ink-soft">
          Don&apos;t have an account?{' '}
          <button type="button" className="font-semibold text-ink" onClick={() => navigate('/signup')}>
            Sign up
          </button>
        </p>
      </form>
    </div>
  );
}
