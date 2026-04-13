const categoryOptions = ["all", "Audio", "Accessories", "Laptop", "Displays"];

function FiltersBar({
  searchValue,
  category,
  sort,
  onSearchChange,
  onCategoryChange,
  onSortChange
}) {
  return (
    <section className="filters" aria-label="Product filters">
      <label>
        Search
        <input
          type="search"
          placeholder="Search products..."
          value={searchValue}
          onChange={onSearchChange}
        />
      </label>

      <label>
        Category
        <select value={category} onChange={onCategoryChange}>
          {categoryOptions.map((item) => (
            <option value={item} key={item}>
              {item === "all" ? "All categories" : item}
            </option>
          ))}
        </select>
      </label>

      <label>
        Sort
        <select value={sort} onChange={onSortChange}>
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </label>
    </section>
  );
}

export default FiltersBar;
