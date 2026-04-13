import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import { CartProvider } from "../context/CartContext.jsx";
import HomePage from "./HomePage.jsx";

vi.mock("../api/products.js", () => ({
  getProducts: vi.fn()
}));

import { getProducts } from "../api/products.js";

const sampleProducts = [
  {
    id: "1",
    name: "Wireless Headphones",
    slug: "wireless-headphones",
    description: "Noise cancelling",
    category: "Audio",
    priceInr: 2999,
    image: "🎧",
    badge: "HOT",
    stock: 10,
    featured: true
  }
];

function renderPage() {
  return render(
    <MemoryRouter>
      <CartProvider>
        <HomePage />
      </CartProvider>
    </MemoryRouter>
  );
}

describe("HomePage", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    getProducts.mockResolvedValue(sampleProducts);
  });

  it("renders products returned by the API", async () => {
    renderPage();

    await waitFor(() =>
      expect(screen.getByText("Wireless Headphones")).toBeInTheDocument()
    );
    expect(screen.getByText("Noise cancelling")).toBeInTheDocument();
  });

  it("sends updated search, category, and sort params", async () => {
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => expect(getProducts).toHaveBeenCalled());

    await user.type(screen.getByPlaceholderText("Search products..."), "wire");
    await user.selectOptions(screen.getByLabelText("Category"), "Audio");
    await user.selectOptions(screen.getByLabelText("Sort"), "price_asc");

    await waitFor(() => {
      const lastCallParams = getProducts.mock.calls.at(-1)[0];
      expect(lastCallParams).toMatchObject({
        search: "wire",
        category: "Audio",
        sort: "price_asc"
      });
    });
  });
});
