module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.dev.json"],
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
  ],
  plugins: [
    "@typescript-eslint",
    "import",
  ],
  rules: {
    "quotes": "off",
    "import/no-unresolved": 0,
    "linebreak-style": "off",
    "no-trailing-spaces": "off",
    "arrow-parens": ["error", "as-needed"],
    "object-curly-spacing": "off",
    "max-len": ["error", { "code": 3000 }],
    "require-jsdoc": "off",
    "indent": "off",
    "eol-last": ["error", "always"],
    "@typescript-eslint/no-explicit-any": "off",
  },
};
