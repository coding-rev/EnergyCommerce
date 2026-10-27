"use client";

import { useState } from "react";
import Link from "next/link";
import { getMessage } from "../../lib/language";
import { ProductImage } from "../ui/ProductImage";
import { SearchModal } from "./SearchModal";
import { useBasket } from "./BasketContext";
import { BasketDrawer } from "./BasketDrawer";

export function SiteHeader() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [basketOpen, setBasketOpen] = useState(false);
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
        <button
          className="cart-button"
          type="button"
          aria-label={getMessage("basket.label", { count })}
          onClick={() => setBasketOpen(true)}
        >
          <ProductImage src="/basket.svg" alt="" />
          {count > 0 && <span className="cart-count">{count}</span>}
        </button>
      </header>
      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
      {basketOpen && <BasketDrawer onClose={() => setBasketOpen(false)} />}
    </>
  );
}