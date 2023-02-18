/* eslint-disable unicorn/prefer-module */
var fs = require("fs");

var readme = fs.readFileSync("./README.md", "utf-8");
var updatedReadme = readme.replace(/\*.+yaml-language-server.+\n/m, "");

fs.writeFileSync("./README.md", updatedReadme, "utf-8");
