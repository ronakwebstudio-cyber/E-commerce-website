import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductBySlug } from "../api/products.js";
import { useCart } from "../context/CartContext.jsx";
import { formatInr } from "../utils/currency.js";

function ProductDetailPage() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [status, setStatus] = useState("loading");
  const [product, setProduct] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    setStatus("loading");
    setErrorMessage("");

    getProductBySlug(slug, controller.signal)
      .then((item) => {
        if (!active) {
          return;
        }
        setProduct(item);
        setStatus("success");
      })
      .catch((error) => {
        if (!active || error.name === "AbortError") {
          return;
        }
        setErrorMessage(error.message);
        setStatus("error");
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [slug]);

  if (status === "loading") {
    return (
      <section className="container detail-page">
        <p className="state-text">Loading product...</p>
      </section>
    );
  }

  if (status === "error" || !product) {
    return (
      <section className="container detail-page">
        <p className="state-text">{errorMessage || "Product not found."}</p>
        <Link className="btn btn-secondary" to="/">
          Back to Store
        </Link>
      </section>
    );
  }

  return (
    <section className="container detail-page">
      <div className="detail-card">
        <div className="detail-visual" aria-hidden="true">
          <span>{product.image}</span>
        </div>
        <div className="detail-content">
          <p className="product-category">{product.category}</p>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <p className="detail-price">{formatInr(product.priceInr)}</p>
          <div className="detail-actions">
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>
            <Link className="btn btn-secondary" to="/">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetailPage;
