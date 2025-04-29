require("dotenv").config();
const { Pool } = require("pg");
const type = process.env.STORAGE_TYPE || "local";
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432, // Default PostgreSQL port
});
const createTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS blob_metadata_${type} (
        id TEXT PRIMARY KEY,
        size INTEGER NOT NULL,
        created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc') NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS blob_storage (
        id TEXT PRIMARY KEY,
        data BYTEA NOT NULL
      );
    `);

    console.log("✅ Tables created successfully.");
  } catch (error) {
    console.error("❌ Error creating tables:", error);
  } finally {
    await pool.end();
  }
};

module.exports = { createTables };
