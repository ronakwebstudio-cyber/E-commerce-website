import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "techstore_cart_v1";

const CartContext = createContext(null);

function readCartState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { items: [], updatedAt: null };
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.items)) {
      return { items: [], updatedAt: null };
    }

    return {
      items: parsed.items,
      updatedAt: parsed.updatedAt || null
    };
  } catch {
    return { items: [], updatedAt: null };
  }
}

export function CartProvider({ children }) {
  const [cartState, setCartState] = useState(readCartState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartState));
  }, [cartState]);

  function updateState(items) {
    setCartState({
      items,
      updatedAt: new Date().toISOString()
    });
  }

  function addToCart(product) {
    setCartState((current) => {
      const existingIndex = current.items.findIndex(
        (item) => item.slug === product.slug
      );

      if (existingIndex >= 0) {
        const nextItems = current.items.map((item) =>
          item.slug === product.slug ? { ...item, qty: item.qty + 1 } : item
        );
        return {
          items: nextItems,
          updatedAt: new Date().toISOString()
        };
      }

      return {
        items: [
          ...current.items,
          {
            slug: product.slug,
            name: product.name,
            priceInr: product.priceInr,
            qty: 1,
            image: product.image
          }
        ],
        updatedAt: new Date().toISOString()
      };
    });
  }

  function updateQuantity(slug, qty) {
    if (qty <= 0) {
      removeFromCart(slug);
      return;
    }

    setCartState((current) => {
      const nextItems = current.items.map((item) =>
        item.slug === slug ? { ...item, qty } : item
      );
      return {
        items: nextItems,
        updatedAt: new Date().toISOString()
      };
    });
  }

  function removeFromCart(slug) {
    setCartState((current) => {
      const nextItems = current.items.filter((item) => item.slug !== slug);
      return {
        items: nextItems,
        updatedAt: new Date().toISOString()
      };
    });
  }

  function clearCart() {
    updateState([]);
  }

  const cartCount = cartState.items.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cartState.items.reduce(
    (sum, item) => sum + item.priceInr * item.qty,
    0
  );

  const value = {
    items: cartState.items,
    updatedAt: cartState.updatedAt,
    cartCount,
    subtotal,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
