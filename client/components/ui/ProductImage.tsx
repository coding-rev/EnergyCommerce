import { useEffect, useState } from "react";

export interface ProductImageProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  fetchPriority?: "high" | "low" | "auto";
}

export function ProductImage({
  src,
  alt,
  fallbackSrc,
  className = "",
  fetchPriority = "auto",
}: ProductImageProps) {
  const [source, setSource] = useState(src || fallbackSrc || "");

  useEffect(() => {
    setSource(src || fallbackSrc || "");
  }, [src, fallbackSrc]);

  return (
    <img
      className={className}
      src={source}
      alt={alt}
      fetchPriority={fetchPriority}
      onError={() => {
        if (fallbackSrc && source !== fallbackSrc) {
          setSource(fallbackSrc);
        }
      }}
    />
  );
}