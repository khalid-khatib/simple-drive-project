const db = require("../db");

exports.save = async (id, buffer) => {
  await db.query("INSERT INTO blob_storage (id, data) VALUES ($1, $2)", [
    id,
    buffer,
  ]);
};

exports.retrieve = async (id) => {
  const res = await db.query("SELECT data FROM blob_storage WHERE id = $1", [
    id,
  ]);
  if (res.rows.length === 0) throw new Error("Blob not found in DB");
  return res.rows[0].data;
};
