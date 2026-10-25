import type { Preview } from "@storybook/nextjs-vite";
import "../styles/globals.css";

const preview: Preview = {
  parameters: {
    layout: "fullscreen",
    a11y: { test: "error" },
  },
};

export default preview;