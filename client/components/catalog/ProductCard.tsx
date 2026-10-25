import Link from "next/link";
import { formatPrice, type Product } from "../../lib/products";
import { Button } from "../ui/Button";
import { ProductImage } from "../ui/ProductImage";

export interface ProductCardProps {
  product: Product;
  viewLabel: string;
  outOfStockLabel: string;
}

export function ProductCard({
  product,
  viewLabel,
  outOfStockLabel,
}: ProductCardProps) {
  return (
    <article className="catalog-product">
      <Link
        className="catalog-product-link"
        href={`/product?productId=${encodeURIComponent(product.id)}`}
        aria-label={viewLabel}
      >
        <div className="catalog-product-media">
          <ProductImage
            className="catalog-product-image"
            src={product.img_url}
            fallbackSrc="/philips-plumen.jpg"
            alt={`${product.brand} ${product.name}`}
            fetchPriority="low"
          />
          <div className="catalog-badges">
            {product.quantity === 0 && <span className="catalog-badge catalog-badge--stock">{outOfStockLabel}</span>}
          </div>
        </div>
        <div className="catalog-product-copy">
          <p className="catalog-product-brand">{product.brand}</p>
          <h2>{product.name}</h2>
          <p className="catalog-product-price">{formatPrice(product.price)}</p>
        </div>
      </Link>
      <Button
        className="catalog-quick-view"
        variant="quiet"
        label={viewLabel}
        onClick={() => {
          window.location.assign(`/product?productId=${encodeURIComponent(product.id)}`);
        }}
      />
    </article>
  );
}