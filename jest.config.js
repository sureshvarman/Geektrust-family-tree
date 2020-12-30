module.exports = {
    preset: 'ts-jest',
    modulePathIgnorePatterns: ["dist"],
    transform: {
      '^.+\\.(ts|tsx)?$': 'ts-jest',
      "^.+\\.(js|jsx)$": "babel-jest",
    }
  };