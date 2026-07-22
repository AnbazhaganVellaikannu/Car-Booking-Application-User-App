import React from 'react';
const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };

export const BackIcon = (p) => (
  <svg viewBox="0 0 24 24" width={20} height={20} {...base} {...p}><path d="M15 18l-6-6 6-6" /></svg>
);
export const DownloadIcon = (p) => (
  <svg viewBox="0 0 24 24" width={18} height={18} {...base} {...p}>
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><path d="M7 10l5 5 5-5" /><path d="M12 15V3" />
  </svg>
);
export const BellIcon = (p) => (
  <svg viewBox="0 0 24 24" width={20} height={20} {...base} {...p}>
    <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
  </svg>
);
export const SearchIcon = (p) => (
  <svg viewBox="0 0 24 24" width={20} height={20} {...base} {...p}>
    <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
  </svg>
);
export const PinIcon = (p) => (
  <svg viewBox="0 0 24 24" width={18} height={18} {...base} {...p}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1116 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
export const StarIcon = ({ filled, ...p }) => (
  <svg viewBox="0 0 24 24" width={20} height={20} fill={filled ? '#FEC400' : 'none'} stroke={filled ? '#FEC400' : 'currentColor'} strokeWidth={2} strokeLinejoin="round" {...p}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);
export const ClockIcon = (p) => (
  <svg viewBox="0 0 24 24" width={18} height={18} {...base} {...p}>
    <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" />
  </svg>
);
export const PhoneIcon = (p) => (
  <svg viewBox="0 0 24 24" width={20} height={20} {...base} {...p}>
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
  </svg>
);
export const MessageIcon = (p) => (
  <svg viewBox="0 0 24 24" width={20} height={20} {...base} {...p}>
    <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
  </svg>
);
export const CheckCircleIcon = (p) => (
  <svg viewBox="0 0 24 24" width={64} height={64} {...base} {...p}>
    <circle cx="12" cy="12" r="10" /><path d="M8 12l3 3 5-6" />
  </svg>
);
export const ChevronRightIcon = (p) => (
  <svg viewBox="0 0 24 24" width={18} height={18} {...base} {...p}><path d="M9 18l6-6-6-6" /></svg>
);
export const HomeIcon = (p) => (
  <svg viewBox="0 0 24 24" width={22} height={22} {...base} {...p}>
    <path d="M3 11.5L12 4l9 7.5" /><path d="M5 10v10h14V10" />
  </svg>
);
export const HistoryIcon = (p) => (
  <svg viewBox="0 0 24 24" width={22} height={22} {...base} {...p}>
    <path d="M3 12a9 9 0 109-9" /><path d="M3 4v5h5" /><path d="M12 7v5l4 2" />
  </svg>
);
export const WalletIcon = (p) => (
  <svg viewBox="0 0 24 24" width={22} height={22} {...base} {...p}>
    <path d="M21 7H5a2 2 0 00-2 2v9a2 2 0 002 2h16v-6" /><path d="M16 12h4v3h-4a1.5 1.5 0 010-3z" /><path d="M17 7V5a2 2 0 00-2-2H5a2 2 0 00-2 2v2" />
  </svg>
);
export const UserIcon = (p) => (
  <svg viewBox="0 0 24 24" width={22} height={22} {...base} {...p}>
    <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
  </svg>
);
export const LogoutIcon = (p) => (
  <svg viewBox="0 0 24 24" width={20} height={20} {...base} {...p}>
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" />
  </svg>
);
export const CarIcon = (p) => (
  <svg viewBox="0 0 24 24" width={28} height={28} {...base} {...p}>
    <path d="M3 13l1.6-4.8A2 2 0 016.5 7h11a2 2 0 011.9 1.2L21 13" />
    <rect x="3" y="13" width="18" height="6" rx="2" />
    <circle cx="7.5" cy="19" r="1.5" /><circle cx="16.5" cy="19" r="1.5" />
  </svg>
);
export const BikeIcon = (p) => (
  <svg viewBox="0 0 24 24" width={26} height={26} {...base} {...p}>
    <circle cx="5.5" cy="17.5" r="3.5" /><circle cx="18.5" cy="17.5" r="3.5" />
    <path d="M12 17.5L15 8h-4l-1-3H7" /><path d="M9.5 8h6l3 9.5" />
  </svg>
);
