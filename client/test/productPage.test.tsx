import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { ProductPage } from "../components/product/ProductPage";
import { BasketProvider } from "../components/layout/BasketContext";
import { SiteHeader } from "../components/layout/SiteHeader";
import { graphqlEndpoint } from "../mocks/msw/endpoint";
import { server } from "../mocks/msw/server";
import { productFixture } from "../mocks/msw/fixtures";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("ProductPage", () => {
  it("renders GraphQL product data and supports stock-bounded basket actions", async () => {
    server.use(
      http.post(graphqlEndpoint, () =>
        HttpResponse.json({ data: { allProducts: [productFixture] } }),
      ),
    );

    const user = userEvent.setup();
    render(
      <BasketProvider>
        <SiteHeader />
        <ProductPage />
      </BasketProvider>,
    );

    expect(await screen.findByRole("heading", { name: productFixture.name })).toBeInTheDocument();
    expect(screen.getByText("£12.99")).toBeInTheDocument();
    expect(screen.getByText(productFixture.description)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Increase quantity" }));
    expect(screen.getByText("2", { selector: ".quantity-value" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Add to cart" }));

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent("2 items added");
      expect(screen.getByRole("link", { name: "Basket, 2 items" })).toBeInTheDocument();
    });
    expect(screen.getByRole("button", { name: "Increase quantity" })).toBeDisabled();
  });
});