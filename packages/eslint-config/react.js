import reactHooks from "eslint-plugin-react-hooks";
import base from "./base.js";

/** Cho code React (web và mobile). */
export default [
  ...base,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: { "react-hooks": reactHooks },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];
