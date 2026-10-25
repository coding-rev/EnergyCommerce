import type { Meta, StoryObj } from "@storybook/react";
import { FilterPanel } from "./FilterPanel";

const meta = {
  title: "Catalog/FilterPanel",
  component: FilterPanel,
  args: {
    categories: [
      { id: "all", label: "All products" },
      { id: "lighting", label: "Lighting" },
      { id: "audio", label: "Audio" },
      { id: "cables", label: "Cables" },
    ],
    selectedCategory: "all",
    inStockOnly: false,
    categoryHeading: "Categories",
    ariaLabel: "Product filters",
    availabilityHeading: "Availability",
    allItemsLabel: "All items",
    inStockLabel: "In stock",
    onCategoryChange: () => undefined,
    onInStockChange: () => undefined,
  },
  argTypes: {
    selectedCategory: { control: "select", options: ["all", "lighting", "audio", "cables"] },
    inStockOnly: { control: "boolean" },
    onCategoryChange: { action: "category changed" },
    onInStockChange: { action: "availability changed" },
  },
} satisfies Meta<typeof FilterPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};