import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { formatInr } from "../utils/currency.js";

function CartPage() {
  const { items, subtotal, updateQuantity, removeFromCart, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <section className="container cart-page">
        <h1>Cart</h1>
        <p className="state-text">Your cart is empty. Explore products to begin.</p>
        <Link className="btn btn-primary" to="/">
          Go to Store
        </Link>
      </section>
    );
  }

  return (
    <section className="container cart-page">
      <div className="cart-heading">
        <h1>Cart</h1>
        <button className="btn btn-secondary" type="button" onClick={clearCart}>
          Clear Cart
        </button>
      </div>

      <div className="cart-layout">
        <ul className="cart-list">
          {items.map((item) => (
            <li key={item.slug}>
              <span className="cart-item-visual">{item.image}</span>
              <div>
                <p>{item.name}</p>
                <small>{formatInr(item.priceInr)}</small>
              </div>
              <div className="qty-controls">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.slug, item.qty - 1)}
                >
                  -
                </button>
                <span>{item.qty}</span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.slug, item.qty + 1)}
                >
                  +
                </button>
              </div>
              <button type="button" onClick={() => removeFromCart(item.slug)}>
                Remove
              </button>
            </li>
          ))}
        </ul>

        <aside className="cart-summary">
          <h2>Order Summary</h2>
          <p>
            Subtotal <strong>{formatInr(subtotal)}</strong>
          </p>
          <p>
            Shipping <strong>{formatInr(0)}</strong>
          </p>
          <p>
            Total <strong>{formatInr(subtotal)}</strong>
          </p>
          <button className="btn btn-primary" type="button">
            Checkout (MVP placeholder)
          </button>
        </aside>
      </div>
    </section>
  );
}

export default CartPage;
