"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Product } from "../../lib/products";

export interface BasketItem {
  product: Product;
  quantity: number;
}

interface BasketContextValue {
  items: BasketItem[];
  count: number;
  addItems: (product: Product, quantity: number) => void;
  changeQuantity: (productId: string, change: number) => void;
  removeItem: (productId: string) => void;
}

const BasketContext = createContext<BasketContextValue | null>(null);

export function BasketProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BasketItem[]>([]);
  const count = items.reduce((total, item) => total + item.quantity, 0);
  const value = useMemo(
    () => ({
      items,
      count,
      addItems: (product: Product, quantity: number) =>
        setItems((current) => {
          const existing = current.find((item) => item.product.id === product.id);
          return existing
            ? current.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item,
              )
            : [...current, { product, quantity }];
        }),
      changeQuantity: (productId: string, change: number) =>
        setItems((current) =>
          current.map((item) =>
            item.product.id === productId
              ? {
                  ...item,
                  quantity: Math.min(
                    Math.max(1, item.product.quantity),
                    Math.max(1, item.quantity + change),
                  ),
                }
              : item,
          ),
        ),
      removeItem: (productId: string) =>
        setItems((current) => current.filter((item) => item.product.id !== productId)),
    }),
    [count, items],
  );

  return <BasketContext.Provider value={value}>{children}</BasketContext.Provider>;
}

export function useBasket() {
  const context = useContext(BasketContext);
  if (!context) throw new Error("useBasket must be used inside BasketProvider");
  return context;
}