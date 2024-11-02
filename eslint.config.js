import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";

export default [
  js.configs.recommended,
  importPlugin.flatConfigs.recommended,
  {
    rules: {
      "no-unused-vars": "off",
      "no-undef": "off",
      "import/no-default-export": "error",
    },
  },
];
