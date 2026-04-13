import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { formatInr } from "../utils/currency.js";

function CartDrawer({ isOpen, onClose }) {
  const { items, subtotal, removeFromCart } = useCart();

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="drawer-backdrop" onClick={onClose} role="presentation">
      <aside
        className="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Quick cart"
        onClick={(event) => event.stopPropagation()}
      >
        <header>
          <h2>Your Cart</h2>
          <button type="button" onClick={onClose} aria-label="Close cart">
            ✕
          </button>
        </header>

        {items.length === 0 ? (
          <p className="state-text">Your cart is empty.</p>
        ) : (
          <ul>
            {items.map((item) => (
              <li key={item.slug}>
                <span>{item.image}</span>
                <div>
                  <p>{item.name}</p>
                  <small>
                    {item.qty} x {formatInr(item.priceInr)}
                  </small>
                </div>
                <button type="button" onClick={() => removeFromCart(item.slug)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        <footer>
          <p>Subtotal: {formatInr(subtotal)}</p>
          <Link className="btn btn-primary" to="/cart" onClick={onClose}>
            Open Cart Page
          </Link>
        </footer>
      </aside>
    </div>
  );
}

export default CartDrawer;
