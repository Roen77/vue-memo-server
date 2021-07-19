module.exports = {
    preset: '@vue/cli-plugin-unit-jest',
    setupFiles: ["./tests/setup.js"],
    testMatch: [
      '<rootDir>/src/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)',
    ],
  };
  
