module.exports = {
    "roots": [
      "<rootDir>/e2e/tests",
    ],
    "transform": {
      "^.+\\.tsx?$": "ts-jest"
    },
    "globals": {
      "ts-jest": {
        "tsConfig": "tsconfig.content_scripts.dev.json"
      }
    },
  "setupFilesAfterEnv": [
      "<rootDir>/e2e/init.ts",
  ],
};
