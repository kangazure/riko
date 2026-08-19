import { defineConfig, globalIgnores } from "eslint/config";
import next from "eslint-config-next";

const eslintConfig = defineConfig([
  ...next,
  globalIgnores([".next/**"]),
]);

export default eslintConfig;
