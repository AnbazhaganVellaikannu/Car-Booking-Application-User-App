import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/TopBar.jsx';
import { ChevronRightIcon } from '../../components/icons.jsx';

const STATIC_PAGES = {
  privacy: {
    title: 'Privacy Policy',
    body: 'We only use your location to match you with nearby drivers and calculate fares. Trip history is kept so you can review past rides. We never sell your data.',
  },
  help: {
    title: 'Help & Support',
    body: 'Need help with a trip? Reach us at support@easyride.demo and we’ll get back to you within one business day.',
  },
  about: {
    title: 'About Us',
    body: 'Easy Ride is a demo ride-booking app built to showcase a full booking flow — from picking a destination to rating your driver.',
  },
};

export default function Settings() {
  const navigate = useNavigate();
  const [page, setPage] = useState(null);

  if (page) {
    const { title, body } = STATIC_PAGES[page];
    return (
      <div className="flex flex-1 flex-col">
        <TopBar title={title} onBack={() => setPage(null)} />
        <div className="px-6 pb-8 pt-2">
          <p className="text-sm leading-relaxed text-ink-soft">{body}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title="Settings" />
      <div className="flex-1 space-y-2 overflow-y-auto px-5 pb-8">
        <SettingsRow label="Change password" onClick={() => navigate('/profile/settings/password')} />
        <SettingsRow label="Language" value="English" onClick={() => {}} />
        <SettingsRow label="Privacy policy" onClick={() => setPage('privacy')} />
        <SettingsRow label="Help & support" onClick={() => setPage('help')} />
        <SettingsRow label="About us" onClick={() => setPage('about')} />
        <SettingsRow label="Delete account" danger onClick={() => navigate('/profile/settings/delete')} />
      </div>
    </div>
  );
}

function SettingsRow({ label, value, danger, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl border border-surface-border bg-white px-4 py-3.5 text-left active:scale-[0.99] ${
        danger ? 'text-danger' : 'text-ink'
      }`}
    >
      <span className="flex-1 text-sm font-medium">{label}</span>
      {value && <span className="text-xs text-ink-faint">{value}</span>}
      <ChevronRightIcon stroke={danger ? '#FF3B30' : '#8A8A8A'} />
    </button>
  );
}
