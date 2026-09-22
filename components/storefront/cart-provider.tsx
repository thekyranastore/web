"use client";

import { createContext, useContext, useSyncExternalStore } from "react";

export type CartItem = {
  productId: string;
  name: string;
  pricePaise: number;
  imageUrl: string | null;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function storageKey(shopUsername: string) {
  return `kirana-cart-${shopUsername}`;
}

const cache = new Map<string, CartItem[]>();
const listeners = new Map<string, Set<() => void>>();

function readFromStorage(shopUsername: string): CartItem[] {
  const stored = localStorage.getItem(storageKey(shopUsername));
  return stored ? JSON.parse(stored) : [];
}

function getSnapshot(shopUsername: string): CartItem[] {
  if (!cache.has(shopUsername)) {
    cache.set(shopUsername, readFromStorage(shopUsername));
  }
  return cache.get(shopUsername)!;
}

const EMPTY_CART: CartItem[] = [];

function getServerSnapshot(): CartItem[] {
  return EMPTY_CART;
}

function subscribe(shopUsername: string, listener: () => void) {
  const set = listeners.get(shopUsername) ?? new Set();
  set.add(listener);
  listeners.set(shopUsername, set);
  return () => set.delete(listener);
}

function setItems(shopUsername: string, items: CartItem[]) {
  cache.set(shopUsername, items);
  localStorage.setItem(storageKey(shopUsername), JSON.stringify(items));
  listeners.get(shopUsername)?.forEach((listener) => listener());
}

export function CartProvider({
  shopUsername,
  children,
}: {
  shopUsername: string;
  children: React.ReactNode;
}) {
  const items = useSyncExternalStore(
    (listener) => subscribe(shopUsername, listener),
    () => getSnapshot(shopUsername),
    getServerSnapshot,
  );

  function addItem(item: Omit<CartItem, "quantity">, quantity: number) {
    const current = getSnapshot(shopUsername);
    const existing = current.find((entry) => entry.productId === item.productId);

    const next = existing
      ? current.map((entry) =>
          entry.productId === item.productId
            ? { ...entry, quantity: entry.quantity + quantity }
            : entry,
        )
      : [...current, { ...item, quantity }];

    setItems(shopUsername, next);
  }

  function updateQuantity(productId: string, quantity: number) {
    const current = getSnapshot(shopUsername);
    const next =
      quantity <= 0
        ? current.filter((entry) => entry.productId !== productId)
        : current.map((entry) => (entry.productId === productId ? { ...entry, quantity } : entry));

    setItems(shopUsername, next);
  }

  function removeItem(productId: string) {
    setItems(
      shopUsername,
      getSnapshot(shopUsername).filter((entry) => entry.productId !== productId),
    );
  }

  function clear() {
    setItems(shopUsername, []);
  }

  return (
    <CartContext.Provider value={{ items, addItem, updateQuantity, removeItem, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
