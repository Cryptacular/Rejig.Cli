// eslint-disable-next-line unicorn/prefer-module
var { REJIG_BASE_URL } = require("../dist/constants/index.js");

if (REJIG_BASE_URL.includes("localhost")) {
  throw new Error(
    "Change configuration back to production mode before publishing! (constants/index.ts)"
  );
}
