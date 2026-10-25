"use client";

import { useState } from "react";
import Link from "next/link";
import { getMessage } from "../../lib/language";
import { ProductImage } from "../ui/ProductImage";
import { SearchModal } from "./SearchModal";
import { useBasket } from "./BasketContext";

export function SiteHeader() {
  const [searchOpen, setSearchOpen] = useState(false);
  const { count } = useBasket();

  return (
    <>
      <header className="site-header">
        <Link href="/" aria-label={getMessage("brand.homeLink")}>
          <ProductImage
            className="brand-logo"
            src="/octopus-logo.svg"
            alt={getMessage("brand.name")}
          />
        </Link>
        <button
          className="global-search-trigger"
          type="button"
          aria-label={getMessage("globalSearch.open")}
          onClick={() => setSearchOpen(true)}
        >
          <span className="search-icon" aria-hidden="true" />
          <span>{getMessage("globalSearch.placeholder")}</span>
        </button>
        <Link
          className="cart-button"
          href="/product"
          aria-label={getMessage("basket.label", { count })}
        >
          <ProductImage src="/basket.svg" alt="" />
          {count > 0 && <span className="cart-count">{count}</span>}
        </Link>
      </header>
      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </>
  );
}