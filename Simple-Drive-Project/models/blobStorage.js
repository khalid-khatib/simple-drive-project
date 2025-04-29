const db = require("../db");

exports.insertStorage = async (id, storageBackend, storagePath) => {
  await db.query(
    "INSERT INTO blob_storage (id, storage_backend, storage_path) VALUES ($1, $2)",
    [id, storageBackend, storagePath]
  );
};

exports.getStorage = async (id) => {
  const res = await db.query("SELECT * FROM blob_storage WHERE id = $1", [id]);
  return res.rows[0];
};
