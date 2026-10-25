"use client";

import { useEffect, useMemo, useState } from "react";
import { getCatalogCategoryLabel, getMessage } from "../../lib/language";
import {
  catalogCategories,
  fetchProducts,
  getProductCategory,
  type Product,
  type ProductSort,
} from "../../lib/products";
import { Button } from "../ui/Button";
import { Text } from "../ui/Text";
import { FilterPanel } from "./FilterPanel";
import { ProductCard } from "./ProductCard";
import { SearchField } from "./SearchField";

export function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [listingSearch, setListingSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<ProductSort>("newest");
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    fetchProducts({ inStockOnly, sort }, controller.signal)
      .then((nextProducts) => {
        setProducts(nextProducts);
        setStatus("ready");
      })
      .catch(() => {
        if (!controller.signal.aborted) setStatus("error");
      });

    return () => controller.abort();
  }, [inStockOnly, sort, retry]);

  useEffect(() => {
    const category = new URLSearchParams(window.location.search).get("category");
    if (category && catalogCategories.some((entry) => entry.id === category)) {
      setSelectedCategory(category);
    }

    function onCategoryChange(event: Event) {
      const categoryId = (event as CustomEvent<string>).detail;
      if (catalogCategories.some((entry) => entry.id === categoryId)) {
        setSelectedCategory(categoryId);
      }
    }

    window.addEventListener("catalog-category-change", onCategoryChange);
    return () => window.removeEventListener("catalog-category-change", onCategoryChange);
  }, []);

  const visibleProducts = useMemo(
    () =>
      selectedCategory === "all"
        ? products
        : products.filter((product) => getProductCategory(product) === selectedCategory),
    [products, selectedCategory],
  );
  const searchedProducts = useMemo(() => {
    const normalizedSearch = listingSearch.trim().toLowerCase();
    if (!normalizedSearch) return visibleProducts;
    return visibleProducts.filter((product) =>
      `${product.name} ${product.brand} ${product.description} ${product.model_code}`
        .toLowerCase()
        .includes(normalizedSearch),
    );
  }, [listingSearch, visibleProducts]);

  const categories = catalogCategories.map((category) => ({
    id: category.id,
    label: getCatalogCategoryLabel(category.id),
  }));

  return (
    <div className="catalog-page">
      <main className="catalog-main">
        <div className="catalog-intro">
          <Text as="p" className="catalog-eyebrow" messageKey="catalog.eyebrow" />
          <Text as="h1" className="catalog-title" messageKey="catalog.title" />
          <Text as="p" className="catalog-description" messageKey="catalog.intro" />
        </div>

        <div className="catalog-toolbar">
          <span className="catalog-result-count" aria-live="polite">
            {searchedProducts.length === 1
              ? getMessage("catalog.productCountSingle")
              : getMessage("catalog.productCount", { count: searchedProducts.length })}
          </span>
          <div className="catalog-listing-search">
            <SearchField
              value={listingSearch}
              label={getMessage("catalog.listingSearchLabel")}
              placeholder={getMessage("catalog.listingSearchPlaceholder")}
              clearLabel={getMessage("catalog.clearSearch")}
              onChange={setListingSearch}
            />
          </div>
          <label className="catalog-sort-label" htmlFor="catalog-sort">
            <Text messageKey="catalog.sort" />
            <select
              id="catalog-sort"
              value={sort}
              onChange={(event) => setSort(event.currentTarget.value as ProductSort)}
            >
              <option value="newest">{getMessage("catalog.newest")}</option>
              <option value="price-ascending">{getMessage("catalog.priceLowHigh")}</option>
              <option value="price-descending">{getMessage("catalog.priceHighLow")}</option>
            </select>
          </label>
        </div>

        <div className="catalog-layout">
          <FilterPanel
            categories={categories}
            selectedCategory={selectedCategory}
            inStockOnly={inStockOnly}
            categoryHeading={getMessage("catalog.categories")}
            ariaLabel={getMessage("catalog.filters")}
            availabilityHeading={getMessage("catalog.availability")}
            allItemsLabel={getMessage("catalog.allItems")}
            inStockLabel={getMessage("catalog.inStock")}
            onCategoryChange={setSelectedCategory}
            onInStockChange={setInStockOnly}
          />

          <section className="catalog-results" id="catalog-grid" aria-label={getMessage("catalog.title")}>
            {status === "loading" && <p className="catalog-message" role="status">{getMessage("product.loading")}</p>}
            {status === "error" && (
              <div className="catalog-message" role="alert">
                <p>{getMessage("catalog.loadError")}</p>
                <Button
                  variant="quiet"
                  label={getMessage("catalog.retry")}
                  onClick={() => setRetry((value) => value + 1)}
                />
              </div>
            )}
            {status === "ready" && searchedProducts.length === 0 && (
              <p className="catalog-message">{getMessage("catalog.noResults")}</p>
            )}
            {status === "ready" && searchedProducts.length > 0 && (
              <div className="catalog-grid">
                {searchedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    viewLabel={getMessage("catalog.viewProduct", { name: product.name })}
                    outOfStockLabel={getMessage("catalog.outOfStock")}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

    </div>
  );
}