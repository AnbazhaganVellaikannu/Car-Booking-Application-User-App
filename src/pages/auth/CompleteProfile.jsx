import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/TopBar.jsx';
import Spinner from '../../components/Spinner.jsx';
import { useSignup } from '../../context/SignupContext.jsx';
import { authClient, signUp } from '../../lib/authClient.js';

export default function CompleteProfile() {
  const navigate = useNavigate();
  const { data, update, reset } = useSignup();
  const [phone, setPhone] = useState(data.phone);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    update({ phone });

    const { error: signUpError } = await signUp.email({
      email: data.email,
      password: data.password,
      name: data.name,
      phone,
    });

    if (signUpError) {
      setLoading(false);
      setError(signUpError.message || 'Could not create your account. Please try again.');
      return;
    }
    // Force the shared useSession() store to refetch before navigating —
    // otherwise PrivateRoute reads the pre-signup (logged-out) cache and
    // bounces straight back to /welcome.
    await authClient.getSession();
    setLoading(false);
    reset();
    navigate('/home', { replace: true });
  }

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title="Complete Your Profile" />
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4 px-6 pb-8 pt-2">
        <p className="text-sm text-ink-soft">
          Add a phone number so drivers can reach you if needed. You can skip this and add it later.
        </p>

        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-ink-soft">
            Phone number
          </label>
          <input
            id="phone"
            type="tel"
            className="input-field"
            placeholder="+1 555 000 0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <div className="flex-1" />
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? <Spinner className="border-ink/30 border-t-ink" /> : 'Finish'}
        </button>
      </form>
    </div>
  );
}
