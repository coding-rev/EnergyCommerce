"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

interface BasketContextValue {
  count: number;
  addItems: (quantity: number) => void;
}

const BasketContext = createContext<BasketContextValue | null>(null);

export function BasketProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);
  const value = useMemo(
    () => ({ count, addItems: (quantity: number) => setCount((current) => current + quantity) }),
    [count],
  );

  return <BasketContext.Provider value={value}>{children}</BasketContext.Provider>;
}

export function useBasket() {
  const context = useContext(BasketContext);
  if (!context) throw new Error("useBasket must be used inside BasketProvider");
  return context;
}