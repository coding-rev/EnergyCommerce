import type { Meta, StoryObj } from "@storybook/react";
import { ProductImage } from "./ProductImage";

const meta = {
  title: "Components/Image",
  component: ProductImage,
  args: {
    src: "/philips-plumen.jpg",
    alt: "Philips energy saving light bulb",
    fallbackSrc: "/philips-plumen.jpg",
    className: "product-image-story",
    fetchPriority: "auto",
  },
  argTypes: {
    src: { control: "text" },
    alt: { control: "text" },
    fallbackSrc: { control: "text" },
    className: { control: "text" },
    fetchPriority: { control: "inline-radio", options: ["high", "low", "auto"] },
  },
  decorators: [
    (Story) => (
      <div className="product-image-story-frame">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProductImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};