import React from 'react';
import { createContext, useContext, useMemo, useState } from 'react';

const RideContext = createContext(null);

const EMPTY_DRAFT = {
  pickup: null, // { address, lat, lng }
  dropoff: null,
  vehicleType: null,
  paymentMethod: 'cash',
};

export function RideProvider({ children }) {
  const [draft, setDraft] = useState(EMPTY_DRAFT);

  const value = useMemo(
    () => ({
      draft,
      setPickup: (pickup) => setDraft((d) => ({ ...d, pickup })),
      setDropoff: (dropoff) => setDraft((d) => ({ ...d, dropoff })),
      setVehicleType: (vehicleType) => setDraft((d) => ({ ...d, vehicleType })),
      setPaymentMethod: (paymentMethod) => setDraft((d) => ({ ...d, paymentMethod })),
      resetDraft: () => setDraft(EMPTY_DRAFT),
    }),
    [draft]
  );

  return <RideContext.Provider value={value}>{children}</RideContext.Provider>;
}

export function useRideDraft() {
  const ctx = useContext(RideContext);
  if (!ctx) throw new Error('useRideDraft must be used within RideProvider');
  return ctx;
}
