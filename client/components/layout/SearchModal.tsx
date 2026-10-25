"use client";

import { useEffect, useState } from "react";
import {
  catalogCategories,
  fetchProducts,
  getMatchingCategoryIds,
  type Product,
} from "../../lib/products";
import { getCatalogCategoryLabel, getMessage } from "../../lib/language";
import { Button } from "../ui/Button";
import { ProductImage } from "../ui/ProductImage";
import { Modal } from "../ui/Modal";

interface SearchModalProps {
  onClose: () => void;
}

type SearchState = "idle" | "loading" | "ready" | "error";

export function SearchModal({ onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<SearchState>("idle");
  const normalizedQuery = query.trim().toLowerCase();
  const matchingCategoryIds = getMatchingCategoryIds(normalizedQuery);
  const matchingCategories = normalizedQuery
    ? catalogCategories
        .filter((category) => matchingCategoryIds.includes(category.id))
    : [];

  useEffect(() => {
    if (!normalizedQuery) {
      setProducts([]);
      setStatus("idle");
      return;
    }

    const controller = new AbortController();
    setStatus("loading");
    setProducts([]);
    const timer = window.setTimeout(() => {
      fetchProducts({ search: normalizedQuery }, controller.signal)
        .then((results) => {
          setProducts(results);
          setStatus("ready");
        })
        .catch(() => {
          if (!controller.signal.aborted) setStatus("error");
        });
    }, 250);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [normalizedQuery]);

  return (
    <Modal
      title={getMessage("globalSearch.title")}
      closeLabel={getMessage("common.close")}
      onClose={onClose}
      className="search-modal"
    >
      <label className="visually-hidden" htmlFor="global-search-input">
        {getMessage("globalSearch.label")}
      </label>
      <input
        data-autofocus
        id="global-search-input"
        className="modal-search-input"
        type="search"
        value={query}
        placeholder={getMessage("globalSearch.placeholder")}
        onChange={(event) => setQuery(event.currentTarget.value)}
      />
      {query && (
        <Button
          className="modal-search-clear"
          variant="quiet"
          label={getMessage("globalSearch.clear")}
          onClick={() => setQuery("")}
        />
      )}

      {!normalizedQuery && (
        <p className="modal-search-message">{getMessage("globalSearch.startTyping")}</p>
      )}
      {normalizedQuery && matchingCategories.length > 0 && (
        <section className="modal-search-section" aria-label={getMessage("catalog.categories")}>
          <h3>{getMessage("catalog.categories")}</h3>
          {matchingCategories.map((category) => (
            <a
              key={category.id}
              className="modal-category-result"
              href={`/?category=${encodeURIComponent(category.id)}`}
              onClick={onClose}
            >
              {getCatalogCategoryLabel(category.id)}
              <span aria-hidden="true">→</span>
            </a>
          ))}
        </section>
      )}
      {status === "loading" && (
        <p className="modal-search-message" role="status">
          {getMessage("globalSearch.loading")}
        </p>
      )}
      {status === "error" && (
        <p className="modal-search-message" role="alert">
          {getMessage("globalSearch.error")}
        </p>
      )}
      {status === "ready" && products.length === 0 && matchingCategories.length === 0 && (
        <p className="modal-search-message">{getMessage("globalSearch.empty")}</p>
      )}
      {products.length > 0 && (
        <section className="modal-search-section" aria-label={getMessage("globalSearch.products")}>
          <h3>{getMessage("globalSearch.products")}</h3>
          <ul className="modal-product-results">
            {products.map((product) => (
              <li key={product.id}>
                <a
                  href={`/product?productId=${encodeURIComponent(product.id)}`}
                  onClick={onClose}
                >
                  <ProductImage
                    src={product.img_url}
                    fallbackSrc="/philips-plumen.jpg"
                    alt=""
                  />
                  <span>
                    <strong>{product.name}</strong>
                    <small>{product.brand}</small>
                  </span>
                  <span aria-hidden="true">→</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </Modal>
  );
}