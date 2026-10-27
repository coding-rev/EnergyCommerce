"use client";

import { getMessage } from "../../lib/language";
import { formatPrice } from "../../lib/products";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { ProductImage } from "../ui/ProductImage";
import { useBasket } from "./BasketContext";

interface BasketDrawerProps {
  onClose: () => void;
}

export function BasketDrawer({ onClose }: BasketDrawerProps) {
  const { items, changeQuantity, removeItem } = useBasket();
  const subtotal = items.reduce(
    (sum, { product, quantity }) => sum + product.price * quantity,
    0,
  );

  return (
    <Modal
      title={getMessage("basket.title")}
      closeLabel={getMessage("common.close")}
      onClose={onClose}
      className="basket-drawer"
      backdropClassName="basket-backdrop"
    >
      {items.length === 0 ? (
        <p className="basket-empty">{getMessage("basket.empty")}</p>
      ) : (
        <ul className="basket-items">
          {items.map(({ product, quantity }) => (
            <li className="basket-item" key={product.id}>
              <ProductImage
                className="basket-item-image"
                src={product.img_url || "/philips-plumen.jpg"}
                fallbackSrc="/philips-plumen.jpg"
                alt=""
              />
              <div className="basket-item-details">
                <h3>{product.name}</h3>
                <div className="basket-quantity-control">
                  <Button
                    className="basket-quantity-button"
                    variant="quiet"
                    label="−"
                    aria-label={getMessage("basket.decreaseQuantity", { name: product.name })}
                    disabled={quantity <= 1}
                    onClick={() => changeQuantity(product.id, -1)}
                  />
                  <span aria-live="polite">{quantity}</span>
                  <Button
                    className="basket-quantity-button"
                    variant="quiet"
                    label="+"
                    aria-label={getMessage("basket.increaseQuantity", { name: product.name })}
                    disabled={quantity >= product.quantity}
                    onClick={() => changeQuantity(product.id, 1)}
                  />
                </div>
                <strong>{formatPrice(product.price * quantity)}</strong>
              </div>
              <Button
                className="basket-remove"
                variant="quiet"
                label={getMessage("basket.remove")}
                aria-label={getMessage("basket.removeItem", { name: product.name })}
                onClick={() => removeItem(product.id)}
              />
            </li>
          ))}
        </ul>
      )}
      <footer className="basket-summary">
        <div>
          <span>{getMessage("basket.subtotal")}</span>
          <strong>{formatPrice(subtotal)}</strong>
        </div>
        <div className="basket-total">
          <span>{getMessage("basket.total")}</span>
          <strong>{formatPrice(subtotal)}</strong>
        </div>
        <Button
          className="basket-checkout"
          variant="primary"
          label={getMessage("basket.checkout")}
          disabled={items.length === 0}
        />
      </footer>
    </Modal>
  );
}