const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function buildProductUrl(path, params = {}) {
  const url = new URL(path, API_BASE_URL);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });
  return url;
}

export async function getProducts({ search, category, sort, signal } = {}) {
  const response = await fetch(
    buildProductUrl("/api/products", { search, category, sort }),
    { signal }
  );

  if (!response.ok) {
    throw new Error("Could not load products. Please try again.");
  }

  const data = await response.json();
  return data.items;
}

export async function getProductBySlug(slug, signal) {
  const response = await fetch(buildProductUrl(`/api/products/${slug}`), { signal });

  if (response.status === 404) {
    throw new Error("Product not found.");
  }

  if (!response.ok) {
    throw new Error("Unable to load product details.");
  }

  const data = await response.json();
  return data.item;
}
