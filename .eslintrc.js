module.exports = {
  "env": {
    "browser": true,
    "es6": true,
  },
  "plugins": [
    "react",
  ],
  "globals": {
    "graphql": false,
  },
  "parserOptions": {
    "sourceType": "module",
    "ecmaFeatures": {
      "ecmaVersion": 2018,
      "jsx": true,
    },
  },
  "rules": {
    "react/prop-types": 1,
  }
};
