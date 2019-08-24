module.exports = {
    "roots": [
      "<rootDir>/content_scripts",
      "<rootDir>/background"
    ],
    "transform": {
      "^.+\\.tsx?$": "ts-jest"
    },
    "globals": {
      "ts-jest": {
        "tsConfig": "tsconfig.content_scripts.dev.json"
      }
    }
  }