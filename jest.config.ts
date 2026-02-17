import type { Config } from "jest";

const config: Config = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "src",
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  collectCoverageFrom: [
    "**/*.ts",
    "!**/*.spec.ts",
    "!**/*.interface.ts",
    "!**/index.ts",
    "!main.ts",
  ],
  coverageDirectory: "../coverage",
  testEnvironment: "node",
};

export default config;
