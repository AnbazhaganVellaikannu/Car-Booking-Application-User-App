import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/TopBar.jsx';
import { useSignup } from '../../context/SignupContext.jsx';

export default function SignUp() {
  const navigate = useNavigate();
  const { data, update } = useSignup();
  const [form, setForm] = useState({ name: data.name, email: data.email, password: data.password });
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (form.name.trim().length < 2) return setError('Please enter your full name.');
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError('Please enter a valid email address.');
    if (form.password.length < 8) return setError('Password must be at least 8 characters.');
    setError('');
    update(form);
    navigate('/signup/verify');
  }

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title="Create Account" />
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4 px-6 pb-8 pt-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink-soft">
            Full name
          </label>
          <input
            id="name"
            className="input-field"
            placeholder="Jane Doe"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
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
            placeholder="At least 8 characters"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <div className="flex-1" />
        <button type="submit" className="btn-primary">
          Continue
        </button>
        <p className="text-center text-sm text-ink-soft">
          Already have an account?{' '}
          <button type="button" className="font-semibold text-ink" onClick={() => navigate('/signin')}>
            Log in
          </button>
        </p>
      </form>
    </div>
  );
}
