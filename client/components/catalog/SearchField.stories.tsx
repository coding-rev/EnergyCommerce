import type { Meta, StoryObj } from "@storybook/react";
import { SearchField } from "./SearchField";

const meta = {
  title: "Catalog/SearchField",
  component: SearchField,
  args: {
    value: "",
    label: "Search products",
    placeholder: "Search the store",
    clearLabel: "Clear search",
    onChange: () => undefined,
  },
  argTypes: {
    value: { control: "text" },
    label: { control: "text" },
    placeholder: { control: "text" },
    clearLabel: { control: "text" },
    onChange: { action: "search changed" },
  },
} satisfies Meta<typeof SearchField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};