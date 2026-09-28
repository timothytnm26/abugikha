import nextPlugin from "@next/eslint-plugin-next";
import globals from "globals";
import react from "./react.js";

/** Cho app Next.js. */
export default [
  ...react,
  {
    plugins: { "@next/next": nextPlugin },
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },
];
