import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { BasketProvider } from "../components/layout/BasketContext";
import { SiteHeader } from "../components/layout/SiteHeader";
import { graphqlEndpoint } from "../mocks/msw/endpoint";
import { server } from "../mocks/msw/server";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function renderHeader() {
  return render(
    <BasketProvider>
      <SiteHeader />
    </BasketProvider>,
  );
}

describe("SiteHeader", () => {
  it("does not show a Categories navigation item", () => {
    renderHeader();

    expect(screen.queryByRole("link", { name: "Shop" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "About" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Categories" })).not.toBeInTheDocument();
  });

  it("shows debounced global product search results and supports clearing", async () => {
    const user = userEvent.setup();
    renderHeader();

    await user.click(screen.getByRole("button", { name: "Open global search" }));
    const input = screen.getByRole("searchbox", { name: "Search products and categories" });
    await user.type(input, "headset");
    expect(screen.getByRole("status")).toHaveTextContent("Searching…");

    expect(await screen.findByRole("link", { name: /Headset/ })).toHaveAttribute(
      "href",
      "/product?productId=2",
    );
    await waitFor(() => expect(input).toHaveValue("headset"));

    await user.click(screen.getByRole("button", { name: "Clear search" }));
    expect(input).toHaveValue("");
    expect(screen.getByText("Start typing to search products and categories.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows an empty state when no products or categories match", async () => {
    const user = userEvent.setup();
    server.use(
      http.post(graphqlEndpoint, () =>
        HttpResponse.json({ data: { allProducts: [] } }),
      ),
    );
    renderHeader();

    await user.click(screen.getByRole("button", { name: "Open global search" }));
    await user.type(
      screen.getByRole("searchbox", { name: "Search products and categories" }),
      "qzx-no-match",
    );

    expect(await screen.findByText("No matching products or categories found.")).toBeInTheDocument();
  });

  it("matches category keywords as global search results", async () => {
    const user = userEvent.setup();
    renderHeader();

    await user.click(screen.getByRole("button", { name: "Open global search" }));
    await user.type(
      screen.getByRole("searchbox", { name: "Search products and categories" }),
      "bulb",
    );

    expect(await screen.findByRole("link", { name: "Lighting" })).toHaveAttribute(
      "href",
      "/?category=lighting",
    );
  });

  it("shows an error state when the global search API fails", async () => {
    const user = userEvent.setup();
    server.use(
      http.post(graphqlEndpoint, () =>
        HttpResponse.json({ errors: [{ message: "Search failure" }] }),
      ),
    );
    renderHeader();

    await user.click(screen.getByRole("button", { name: "Open global search" }));
    await user.type(
      screen.getByRole("searchbox", { name: "Search products and categories" }),
      "headset",
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Search is temporarily unavailable. Please try again.",
    );
  });
});