import type { Meta, StoryObj } from "@storybook/react";
import { productFixture } from "../../mocks/msw/fixtures";
import { ProductCard } from "./ProductCard";

const meta = {
  title: "Catalog/ProductCard",
  component: ProductCard,
  args: {
    product: productFixture,
    viewLabel: "View Energy saving light bulb",
    outOfStockLabel: "Out of stock",
  },
  argTypes: {
    product: { control: "object" },
    viewLabel: { control: "text" },
    outOfStockLabel: { control: "text" },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 280 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProductCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};