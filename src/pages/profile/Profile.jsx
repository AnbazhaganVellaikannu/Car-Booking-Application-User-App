import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession, signOut } from '../../lib/authClient.js';
import BottomNav from '../../components/BottomNav.jsx';
import { ChevronRightIcon, HistoryIcon, LogoutIcon, PinIcon, UserIcon, WalletIcon } from '../../components/icons.jsx';

const MENU = [
  { label: 'Saved places', to: '/profile/favorites', Icon: PinIcon },
  { label: 'Trip history', to: '/history', Icon: HistoryIcon },
  { label: 'Settings', to: '/profile/settings', Icon: WalletIcon },
];

export default function Profile() {
  const navigate = useNavigate();
  const { data } = useSession();
  const user = data?.user;

  async function handleSignOut() {
    await signOut();
    navigate('/welcome', { replace: true });
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="top-bar">
        <h1 className="text-lg font-semibold text-ink">Profile</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4">
        <div className="card flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-ink">
            {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-semibold text-ink">{user?.name || 'Rider'}</p>
            <p className="truncate text-xs text-ink-faint">{user?.email}</p>
            {user?.phone && <p className="truncate text-xs text-ink-faint">{user.phone}</p>}
          </div>
        </div>

        <div className="mt-5 space-y-2">
          {MENU.map(({ label, to, Icon }) => (
            <button
              key={to}
              type="button"
              onClick={() => navigate(to)}
              className="flex w-full items-center gap-3 rounded-xl border border-surface-border bg-white px-4 py-3.5 text-left active:scale-[0.99]"
            >
              <Icon />
              <span className="flex-1 text-sm font-medium text-ink">{label}</span>
              <ChevronRightIcon stroke="#8A8A8A" />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          className="mt-5 flex w-full items-center gap-3 rounded-xl border border-surface-border bg-white px-4 py-3.5 text-left text-danger active:scale-[0.99]"
        >
          <LogoutIcon />
          <span className="flex-1 text-sm font-medium">Log out</span>
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
