#!/usr/bin/env node

const path = require("path");
const fs = require("fs-extra");

const srcDir = path.join(__dirname, "../server");
const destDir = process.cwd();

fs.copy(srcDir, destDir, (err) => {
  if (err) {
    console.error("Error copying backend setup:", err);
  } else {
    console.log("Backend setup successfully copied!");
    console.log("You can start your server by running:");
    console.log("cd server");
    console.log("yarn install");
    console.log("yarn dev");
  }
});
