"use client";

import { useEffect, useState } from "react";
import { fetchProducts, type Product } from "../../lib/products";
import { getMessage } from "../../lib/language";
import { Button } from "../ui/Button";
import { Text } from "../ui/Text";
import { ProductShowcase } from "./ProductShowcase";

type LoadState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "empty" }
  | { status: "ready"; product: Product };

export function ProductPage() {
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    fetchProducts({}, controller.signal)
      .then((products) => {
        const productId = new URLSearchParams(window.location.search).get("productId");
        const selectedProduct = productId
          ? products.find((product) => product.id === productId)
          : products[0];
        setState(
          selectedProduct
            ? { status: "ready", product: selectedProduct }
            : { status: "empty" },
        );
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setState({
            status: "error",
          });
        }
      });

    return () => controller.abort();
  }, [attempt]);

  if (state.status === "ready") {
    return <ProductShowcase product={state.product} />;
  }

  return (
    <main className="storefront">
      <section className="product-main product-state" aria-live="polite">
        {state.status === "loading" && <Text as="p" messageKey="product.loading" />}
        {state.status === "empty" && (
          <div>
            <Text as="h1" messageKey="product.unavailable" />
            <Text as="p" messageKey="product.empty" />
          </div>
        )}
        {state.status === "error" && (
          <div>
            <Text as="h1" messageKey="product.loadFailure" />
            <Text as="p" messageKey="product.loadFailureDetails" />
            <Button
              className="retry-button"
              label={getMessage("product.retry")}
              onClick={() => {
                setState({ status: "loading" });
                setAttempt((current) => current + 1);
              }}
            />
          </div>
        )}
      </section>
    </main>
  );
}