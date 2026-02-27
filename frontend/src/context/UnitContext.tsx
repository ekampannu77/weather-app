'use client';

import React, { createContext, useContext, useState } from 'react';

type Unit = 'C' | 'F';

interface UnitContextType {
  unit: Unit;
  toggleUnit: () => void;
}

const UnitContext = createContext<UnitContextType>({ unit: 'C', toggleUnit: () => {} });

export function UnitProvider({ children }: { children: React.ReactNode }) {
  const [unit, setUnit] = useState<Unit>('C');
  const toggleUnit = () => setUnit((u) => (u === 'C' ? 'F' : 'C'));
  return <UnitContext.Provider value={{ unit, toggleUnit }}>{children}</UnitContext.Provider>;
}

export const useUnit = () => useContext(UnitContext);
