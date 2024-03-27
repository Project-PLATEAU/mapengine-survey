import { defineConfig } from "vite";

export default defineConfig({
  base: "/mapengine-survey/step2/itowns",
  resolve: {
    alias: {
      "./runtimeConfig": "./runtimeConfig.browser",
    },
  },
  define: {
    "window.global": {},
  },
});
