import type { Meta, StoryObj } from "@storybook/react";
import { Text } from "./Text";
import type { MessageKey } from "../../lib/language";

const messageKeys: MessageKey[] = [
  "product.addToCart",
  "product.outOfStock",
  "product.packet",
  "product.loading",
  "product.specifications",
  "basket.label",
];

const meta = {
  title: "Components/Text",
  component: Text,
  args: {
    messageKey: "product.addToCart",
    as: "span",
    values: { power: "25W", count: 2 },
    language: "en",
  },
  argTypes: {
    messageKey: { control: "select", options: messageKeys },
    as: { control: "select", options: ["span", "p", "h1", "h2", "strong"] },
    values: { control: "object" },
    language: { control: "select", options: ["en"] },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};