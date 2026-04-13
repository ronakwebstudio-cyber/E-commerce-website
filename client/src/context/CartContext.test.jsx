import { fireEvent, render, screen } from "@testing-library/react";
import { CartProvider, useCart } from "./CartContext.jsx";

const STORAGE_KEY = "techstore_cart_v1";

const sampleProduct = {
  slug: "wireless-headphones",
  name: "Wireless Headphones",
  priceInr: 2999,
  image: "🎧"
};

function CartProbe() {
  const {
    items,
    cartCount,
    subtotal,
    addToCart,
    updateQuantity,
    removeFromCart
  } = useCart();

  return (
    <>
      <p data-testid="count">{cartCount}</p>
      <p data-testid="subtotal">{subtotal}</p>
      <p data-testid="first-item">{items[0]?.name || ""}</p>
      <button type="button" onClick={() => addToCart(sampleProduct)}>
        Add
      </button>
      <button
        type="button"
        onClick={() => updateQuantity(sampleProduct.slug, 2)}
      >
        Qty2
      </button>
      <button type="button" onClick={() => removeFromCart(sampleProduct.slug)}>
        Remove
      </button>
    </>
  );
}

describe("CartProvider", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("adds, updates, and removes cart items", () => {
    render(
      <CartProvider>
        <CartProbe />
      </CartProvider>
    );

    fireEvent.click(screen.getByText("Add"));
    expect(screen.getByTestId("count")).toHaveTextContent("1");
    expect(screen.getByTestId("subtotal")).toHaveTextContent("2999");

    fireEvent.click(screen.getByText("Qty2"));
    expect(screen.getByTestId("count")).toHaveTextContent("2");
    expect(screen.getByTestId("subtotal")).toHaveTextContent("5998");

    const persisted = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(persisted.items[0]).toMatchObject({
      slug: "wireless-headphones",
      qty: 2
    });

    fireEvent.click(screen.getByText("Remove"));
    expect(screen.getByTestId("count")).toHaveTextContent("0");
  });

  it("rehydrates from localStorage on initial load", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        items: [{ ...sampleProduct, qty: 3 }],
        updatedAt: "2026-04-13T00:00:00.000Z"
      })
    );

    render(
      <CartProvider>
        <CartProbe />
      </CartProvider>
    );

    expect(screen.getByTestId("count")).toHaveTextContent("3");
    expect(screen.getByTestId("first-item")).toHaveTextContent(
      "Wireless Headphones"
    );
  });
});
