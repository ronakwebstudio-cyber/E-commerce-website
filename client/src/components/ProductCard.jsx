import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { formatInr } from "../utils/currency.js";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <article className="product-card">
      <div className="product-visual" aria-hidden="true">
        <span>{product.image}</span>
        {product.badge ? <small className="badge">{product.badge}</small> : null}
      </div>

      <div className="product-content">
        <p className="product-category">{product.category}</p>
        <h3>
          <Link to={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="product-description">{product.description}</p>
        <div className="product-meta">
          <strong>{formatInr(product.priceInr)}</strong>
          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
