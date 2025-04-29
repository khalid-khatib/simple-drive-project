require("dotenv").config();
const fs = require("fs/promises");
const path = require("path");

const storagePath = path.join(
  __dirname,
  "../",
  process.env.LOCAL_STORAGE_PATH || "localStorage"
);

exports.save = async (id, buffer) => {
  await fs.mkdir(storagePath, { recursive: true });
  await fs.writeFile(path.join(storagePath, id), buffer);
};

exports.retrieve = async (id) => {
  return fs.readFile(path.join(storagePath, id));
};
