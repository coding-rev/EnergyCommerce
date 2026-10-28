import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.js"],
    globals: true,
    include: ["test/{unit,integration}/**/*.test.{ts,tsx,js,jsx}"],
  },
});
