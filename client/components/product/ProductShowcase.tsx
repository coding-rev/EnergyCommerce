"use client";

import { useState } from "react";
import { formatPrice, type Product } from "../../lib/products";
import { getMessage } from "../../lib/language";
import { Button } from "../ui/Button";
import { ProductImage } from "../ui/ProductImage";
import { Text } from "../ui/Text";
import { useBasket } from "../layout/BasketContext";

interface ProductShowcaseProps {
  product: Product;
}

export function ProductShowcase({ product }: ProductShowcaseProps) {
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState("");
  const { addItems } = useBasket();
  const stock = Math.max(0, product.quantity);

  function addToCart() {
    addItems(quantity);
    setFeedback(
      getMessage(quantity === 1 ? "product.addedSingular" : "product.addedPlural", {
        count: quantity,
      }),
    );
  }

  return (
    <div className="storefront">
      <main className="product-main">
        <article className="product-layout">
          <figure className="product-image-frame">
            <ProductImage
              className="product-image"
              src={product.img_url || "/philips-plumen.jpg"}
              alt={`${product.brand} ${product.name}`}
              fallbackSrc="/philips-plumen.jpg"
              fetchPriority="high"
            />
          </figure>

          <div className="product-information">
            <p className="product-eyebrow">{product.brand}</p>
            <h1 className="product-title">{product.name}</h1>
            <Text
              as="p"
              className="product-subtitle"
              messageKey="product.packet"
              values={{ power: product.power }}
            />

            <div className="purchase-row">
              <p className="product-price">{formatPrice(product.price)}</p>
              <div
                className="quantity-control"
                aria-label={getMessage("product.chooseQuantity")}
              >
                <Text as="span" className="quantity-label" messageKey="product.quantity" />
                <Button
                  className="quantity-button"
                  variant="stepper"
                  label="−"
                  aria-label={getMessage("product.decreaseQuantity")}
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                />
                <span className="quantity-value" aria-live="polite">
                  {quantity}
                </span>
                <Button
                  className="quantity-button"
                  variant="stepper"
                  label="+"
                  aria-label={getMessage("product.increaseQuantity")}
                  disabled={quantity >= stock}
                  onClick={() => setQuantity((current) => Math.min(stock, current + 1))}
                />
              </div>
            </div>

            <Button
              className="add-to-cart"
              variant="primary"
              label={getMessage(stock === 0 ? "product.outOfStock" : "product.addToCart")}
              disabled={stock === 0}
              onClick={addToCart}
            />
            <p className="cart-feedback" role="status" aria-live="polite">
              {feedback}
            </p>
          </div>
        </article>

        <section className="product-section" aria-labelledby="description-heading">
          <Text as="h2" id="description-heading" messageKey="product.description" />
          <p className="product-description">{product.description}</p>
        </section>

        <section className="product-section" aria-labelledby="specifications-heading">
          <Text as="h2" id="specifications-heading" messageKey="product.specifications" />
          <dl className="specifications">
            <dt><Text messageKey="product.brand" /></dt>
            <dd>{product.brand}</dd>
            <dt><Text messageKey="product.weight" /></dt>
            <dd>{product.weight}</dd>
            <dt><Text messageKey="product.dimensions" /></dt>
            <dd>
              {product.height} <Text messageKey="product.dimensionsSeparator" /> {product.width}{" "}
              <Text messageKey="product.dimensionsSeparator" /> {product.length}
            </dd>
            <dt><Text messageKey="product.modelNumber" /></dt>
            <dd>{product.model_code}</dd>
            <dt><Text messageKey="product.colour" /></dt>
            <dd>{product.colour}</dd>
          </dl>
        </section>
      </main>

    </div>
  );
}