import React from 'react';
import TopBar from '../../components/TopBar.jsx';
import { BellIcon } from '../../components/icons.jsx';

const NOTIFICATIONS = [
  { id: 1, title: 'Welcome to Easy Ride!', body: 'Book your first trip and get moving in minutes.', time: 'Just now' },
  { id: 2, title: 'Ride safely', body: 'Always check your driver’s name and plate before getting in.', time: '1 day ago' },
  { id: 3, title: 'Rate your last trip', body: 'Let us know how your recent ride went.', time: '3 days ago' },
];

export default function Notifications() {
  return (
    <div className="flex flex-1 flex-col">
      <TopBar title="Notifications" />
      <div className="flex-1 space-y-3 overflow-y-auto px-5 pb-8">
        {NOTIFICATIONS.map((n) => (
          <div key={n.id} className="card flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-light">
              <BellIcon stroke="#1A1A1A" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-ink">{n.title}</p>
              <p className="mt-0.5 text-sm text-ink-soft">{n.body}</p>
              <p className="mt-1 text-xs text-ink-faint">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
