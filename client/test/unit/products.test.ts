import { describe, expect, it } from "vitest";
import { getMatchingCategoryIds, getProductCategory, formatPrice } from "../../lib/products";
import { productFixture } from "../../mocks/msw/fixtures";

describe("product domain helpers", () => {
  it("formats prices from integer pence as GBP", () => {
    expect(formatPrice(1299)).toBe("£12.99");
    expect(formatPrice(50000)).toBe("£500.00");
    expect(formatPrice(0)).toBe("£0.00");
  });

  it("maps product names to catalogue categories", () => {
    expect(getProductCategory(productFixture)).toBe("lighting");
    expect(getProductCategory({ ...productFixture, name: "Wireless headset" })).toBe("audio");
    expect(getProductCategory({ ...productFixture, name: "Unknown item" })).toBe("other");
  });

  it("matches category labels and terms case-insensitively", () => {
    expect(getMatchingCategoryIds("  BULB ")).toEqual(["lighting"]);
    expect(getMatchingCategoryIds("headphone")).toEqual(["audio"]);
    expect(getMatchingCategoryIds("")).toEqual([]);
  });
});
