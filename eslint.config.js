export default tseslint.config(
  { ignores: ["dist"] },

  // Modern code (strict)
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },

  // Legacy code (allow any)
  {
    files: ["src/legacy/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  }
);
