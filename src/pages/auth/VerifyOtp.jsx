import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/TopBar.jsx';
import OtpInput from '../../components/OtpInput.jsx';
import { useSignup } from '../../context/SignupContext.jsx';

export default function VerifyOtp() {
  const navigate = useNavigate();
  const { data } = useSignup();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (code.length !== 4) return setError('Enter the 4-digit code we sent you.');
    navigate('/signup/profile');
  }

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title="Verify Email" />
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-6 px-6 pb-8 pt-4">
        <p className="text-sm text-ink-soft">
          Enter the 4-digit code sent to <span className="font-medium text-ink">{data.email || 'your email'}</span>.
          For this demo, any 4 digits will work.
        </p>

        <OtpInput length={4} value={code} onChange={setCode} />
        {error && <p className="text-center text-sm text-danger">{error}</p>}

        <button type="button" className="text-center text-sm font-semibold text-ink">
          Resend code
        </button>

        <div className="flex-1" />
        <button type="submit" className="btn-primary">
          Verify
        </button>
      </form>
    </div>
  );
}
