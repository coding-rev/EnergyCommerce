import { http, HttpResponse } from "msw";
import { graphqlEndpoint } from "./endpoint";
import { productFixtures } from "./fixtures";

interface ProductsRequest {
  variables?: {
    search?: string | null;
    quantityGt?: number | null;
    sortField?: string;
    sortOrder?: string;
  };
}

export const productsSuccessHandler = http.post(
  graphqlEndpoint,
  async ({ request }) => {
    const body = (await request.json()) as ProductsRequest;
    const variables = body.variables ?? {};
    const search = variables.search?.trim().toLowerCase();
    let products = productFixtures.filter((product) => {
      const searchableText = `${product.name} ${product.brand} ${product.description}`.toLowerCase();
      const matchesSearch = !search || searchableText.includes(search);
      const matchesAvailability =
        variables.quantityGt == null || product.quantity > variables.quantityGt;
      return matchesSearch && matchesAvailability;
    });

    products = [...products].sort((left, right) => {
      const direction = variables.sortOrder === "ASC" ? 1 : -1;
      const leftValue = variables.sortField === "price" ? left.price : Number(left.id);
      const rightValue = variables.sortField === "price" ? right.price : Number(right.id);
      return (leftValue - rightValue) * direction;
    });

    return HttpResponse.json({ data: { allProducts: products } });
  },
);

export const productsEmptyHandler = http.post(graphqlEndpoint, () =>
  HttpResponse.json({ data: { allProducts: [] } }),
);

export const productsErrorHandler = http.post(graphqlEndpoint, () =>
  HttpResponse.json({ errors: [{ message: "Product service is unavailable." }] }),
);

export const handlers = [productsSuccessHandler];