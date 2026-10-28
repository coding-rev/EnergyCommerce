import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { CatalogPage } from "../../components/catalog/CatalogPage";
import { server } from "../../mocks/msw/server";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("CatalogPage", () => {
  it("loads GraphQL products and applies category, availability, and search filters", async () => {
    const user = userEvent.setup();
    render(<CatalogPage />);

    expect(await screen.findByRole("heading", { name: "Shop all" })).toBeInTheDocument();
    expect(await screen.findByText("3 products")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Headset" })).toBeInTheDocument();

    await user.selectOptions(screen.getByRole("combobox", { name: "Sort" }), "price-ascending");
    await waitFor(() => {
      expect(document.querySelector(".catalog-product h2")?.textContent).toBe("Cables");
    });

    await user.click(screen.getByRole("button", { name: "Lighting" }));
    expect(await screen.findByRole("heading", { name: "Energy saving light bulb" })).toBeInTheDocument();
    expect(screen.getByText("1 product")).toBeInTheDocument();

    await user.click(screen.getByLabelText("In stock"));
    expect(screen.queryByRole("heading", { name: "Cables" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "All products" }));
    await user.type(screen.getByRole("searchbox", { name: "Search listed products" }), "headset");
    expect(await screen.findByRole("heading", { name: "Headset" })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("1 product")).toBeInTheDocument());
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Clear search" }));
    await waitFor(() => expect(screen.getByText("2 products")).toBeInTheDocument());
    expect(screen.queryByRole("heading", { name: "Cables" })).not.toBeInTheDocument();

    expect(screen.getByRole("complementary", { name: "Product filters" })).toBeInTheDocument();
  });
});