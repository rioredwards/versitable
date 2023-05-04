/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  reporters: [
    "default",
    [
      "error-affirmations",
      { mode: "normal", color: "driven", border: "waves" },
    ],
  ],
  testPathIgnorePatterns: ["/node_modules/", "/fixtures/"],
};
