import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { BasketProvider } from "../../components/layout/BasketContext";
import { SiteHeader } from "../../components/layout/SiteHeader";
import { ProductPage } from "../../components/product/ProductPage";
import { server } from "../../mocks/msw/server";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("storefront integration", () => {
  it("loads a product from GraphQL and shares basket updates with the header and drawer", async () => {
    const user = userEvent.setup();
    window.history.replaceState({}, "", "/product?productId=1");
    render(
      <BasketProvider>
        <SiteHeader />
        <ProductPage />
      </BasketProvider>,
    );

    expect(
      await screen.findByRole("heading", { name: "Energy saving light bulb" }),
    ).toBeInTheDocument();
    expect(screen.getByText("£12.99")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Add to cart" }));
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Basket, 1 items" })).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Basket, 1 items" }));
    const drawer = screen.getByRole("dialog", { name: "Your basket" });
    expect(drawer).toHaveTextContent("Energy saving light bulb");
    expect(drawer).toHaveTextContent("£12.99");

    await user.click(
      screen.getByRole("button", { name: "Remove Energy saving light bulb" }),
    );
    expect(screen.getByText("Your basket is empty.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Basket, 0 items" })).toBeInTheDocument();
  });
});
