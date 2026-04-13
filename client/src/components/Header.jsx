import { NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

function Header({ onOpenCart }) {
  const { cartCount } = useCart();

  return (
    <header className="site-header">
      <div className="container nav-row">
        <NavLink className="brand" to="/">
          TechStore
        </NavLink>

        <nav className="nav-links" aria-label="Primary">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/cart">Cart</NavLink>
        </nav>

        <button className="cart-chip" type="button" onClick={onOpenCart}>
          Quick Cart
          <span>{cartCount}</span>
        </button>
      </div>
    </header>
  );
}

export default Header;
