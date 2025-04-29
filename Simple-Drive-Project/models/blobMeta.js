const db = require("../db");
const type = process.env.STORAGE_TYPE || "local";

exports.insertMetadata = async (id, size) => {
  await db.query(
    `INSERT INTO blob_metadata_${type} (id, size) VALUES ($1, $2)`,
    [id, size]
  );
};

exports.getMetadata = async (id) => {
  const res = await db.query(
    `SELECT * FROM blob_metadata_${type} WHERE id = $1`,
    [id]
  );
  return res.rows[0];
};
