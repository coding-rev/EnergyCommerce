import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta = {
  title: "Components/Button",
  component: Button,
  args: {
    label: "Add to cart",
    variant: "primary",
    disabled: false,
  },
  argTypes: {
    label: { control: "text" },
    variant: { control: "inline-radio", options: ["primary", "stepper", "quiet"] },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};