export interface Product {
  id: string;
  name: string;
  power: string;
  description: string;
  price: number;
  quantity: number;
  brand: string;
  weight: number;
  height: number;
  width: number;
  length: number;
  model_code: string;
  colour: string;
  img_url: string;
}

export type ProductSort = "newest" | "price-ascending" | "price-descending";

export interface ProductFilters {
  search?: string;
  inStockOnly?: boolean;
  sort?: ProductSort;
}

export const productsQuery = `
  query Products(
    $search: String
    $quantityGt: Int
    $sortField: String
    $sortOrder: String
  ) {
    allProducts(
      sortField: $sortField
      sortOrder: $sortOrder
      filter: { q: $search, quantity_gt: $quantityGt }
    ) {
      id
      name
      power
      description
      price
      quantity
      brand
      weight
      height
      width
      length
      model_code
      colour
      img_url
    }
  }
`;

export async function fetchProducts(
  filters: ProductFilters = {},
  signal?: AbortSignal,
): Promise<Product[]> {
  const sort = filters.sort ?? "newest";
  const sortField = sort.startsWith("price") ? "price" : "id";
  const sortOrder = sort === "price-ascending" ? "ASC" : "DESC";
  const response = await fetch(
    process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "http://localhost:3001/graphql",
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        query: productsQuery,
        variables: {
          search: filters.search?.trim() || null,
          quantityGt: filters.inStockOnly ? 0 : null,
          sortField,
          sortOrder,
        },
      }),
      signal,
    },
  );

  if (!response.ok) {
    throw new Error(`Product request failed (${response.status})`);
  }

  const result: {
    data?: { allProducts?: Product[] | null };
    errors?: { message: string }[];
  } = await response.json();

  if (result.errors?.length) {
    throw new Error(result.errors[0].message);
  }

  const products = result.data?.allProducts ?? [];
  return sort === "newest"
    ? [...products].sort((left, right) => Number(right.id) - Number(left.id))
    : products;
}

const productCategories = [
  { id: "lighting", label: "Lighting", terms: ["bulb", "lamp", "light"] },
  { id: "audio", label: "Audio", terms: ["headset", "headphone", "speaker"] },
  { id: "cables", label: "Cables", terms: ["cable", "wire", "charger"] },
];

export function getProductCategory(product: Product): string {
  const text = product.name.toLowerCase();
  return (
    productCategories.find((category) =>
      category.terms.some((term) => text.includes(term)),
    )?.id ?? "other"
  );
}

export function getMatchingCategoryIds(query: string): string[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return [];

  return productCategories
    .filter(
      (category) =>
        category.label.toLowerCase().includes(normalizedQuery) ||
        category.terms.some((term) => term.includes(normalizedQuery)),
    )
    .map((category) => category.id);
}

export const catalogCategories = [
  { id: "all", label: "All products" },
  ...productCategories.map(({ id, label }) => ({ id, label })),
  { id: "other", label: "Other" },
];

export function formatPrice(priceInPence: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(priceInPence / 100);
}