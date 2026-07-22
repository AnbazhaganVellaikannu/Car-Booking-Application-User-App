import React from 'react';
import { createContext, useContext, useMemo, useState } from 'react';

const SignupContext = createContext(null);

const EMPTY = { name: '', email: '', phone: '', password: '' };

export function SignupProvider({ children }) {
  const [data, setData] = useState(EMPTY);

  const value = useMemo(
    () => ({
      data,
      update: (patch) => setData((d) => ({ ...d, ...patch })),
      reset: () => setData(EMPTY),
    }),
    [data]
  );

  return <SignupContext.Provider value={value}>{children}</SignupContext.Provider>;
}

export function useSignup() {
  const ctx = useContext(SignupContext);
  if (!ctx) throw new Error('useSignup must be used within SignupProvider');
  return ctx;
}
