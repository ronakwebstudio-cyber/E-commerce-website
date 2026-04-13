import {
  startTransition,
  useDeferredValue,
  useEffect,
  useState
} from "react";
import { getProducts } from "../api/products.js";
import FiltersBar from "../components/FiltersBar.jsx";
import Hero from "../components/Hero.jsx";
import ProductCard from "../components/ProductCard.jsx";

function HomePage() {
  const [searchValue, setSearchValue] = useState("");
  const deferredSearch = useDeferredValue(searchValue);
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    setStatus("loading");
    setErrorMessage("");

    getProducts({
      search: deferredSearch,
      category,
      sort,
      signal: controller.signal
    })
      .then((items) => {
        if (!active) {
          return;
        }
        setProducts(items);
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
  }, [deferredSearch, category, sort]);

  function handleSearchChange(event) {
    const value = event.target.value;
    startTransition(() => {
      setSearchValue(value);
    });
  }

  return (
    <>
      <Hero />
      <section className="catalog container" id="catalog">
        <div className="section-heading">
          <h2>Featured Products</h2>
          <p>Find your next device with responsive filters and quick actions.</p>
        </div>

        <FiltersBar
          searchValue={searchValue}
          category={category}
          sort={sort}
          onSearchChange={handleSearchChange}
          onCategoryChange={(event) => setCategory(event.target.value)}
          onSortChange={(event) => setSort(event.target.value)}
        />

        {status === "loading" ? (
          <p className="state-text">Loading products...</p>
        ) : null}
        {status === "error" ? <p className="state-text">{errorMessage}</p> : null}
        {status === "success" && products.length === 0 ? (
          <p className="state-text">No products matched your filters.</p>
        ) : null}

        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}

export default HomePage;
