import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, HistoryIcon, UserIcon } from './icons.jsx';

const TABS = [
  { to: '/home', label: 'Home', Icon: HomeIcon },
  { to: '/history', label: 'Activity', Icon: HistoryIcon },
  { to: '/profile', label: 'Profile', Icon: UserIcon },
];

export default function BottomNav() {
  return (
    <nav className="sticky bottom-0 z-10 flex border-t border-surface-border bg-white px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
      {TABS.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-1 rounded-lg py-2 text-xs font-medium ${
              isActive ? 'text-ink' : 'text-ink-faint'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon stroke={isActive ? '#1A1A1A' : '#8A8A8A'} />
              {label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
