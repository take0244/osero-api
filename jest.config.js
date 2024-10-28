module.exports = {
  coverageProvider: "v8",
  roots: [
    "<rootDir>/src"
  ],
  transformIgnorePatterns: [
    "/node_modules/",
    "\\.pnp\\.[^\\/]+$"
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
};
