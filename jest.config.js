export default {
  preset: "ts-jest/presets/js-with-ts-esm", // Preset for TypeScript + ES Modules
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/setup.jest.js"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy", // Mock styles
  },
  transform: {
    "^.+\\.ts?$": "ts-jest", // Use ts-jest to handle TypeScript files
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"], // Treat TypeScript files as ES Modules
  testPathIgnorePatterns: ["__tests__/__mocks__"], // Ignore mocks during tests
};
