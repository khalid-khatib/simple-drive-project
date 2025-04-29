require("dotenv").config();

const type = process.env.STORAGE_TYPE || "local";

let selectedStorage;

switch (type) {
  case "db":
    selectedStorage = require("./dbStorage");
    break;
  case "s3":
    selectedStorage = require("./s3Storage");
    break;
  case "ftp":
    selectedStorage = require("./ftpStorage");
    break;
  case "local":
  default:
    selectedStorage = require("./localStorage");
    break;
}

module.exports = selectedStorage;
