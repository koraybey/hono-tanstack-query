import { configs } from "@koraybey/eslint-config";

export default [
  ...configs.all,
  {
    ignores: ["**/dist"],
  },
];
