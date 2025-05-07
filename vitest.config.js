import { defineConfig } from "vite";

export default defineConfig({
  test: {
    setupFiles: ["./tests/setupVitest.ts"],
  },
});
