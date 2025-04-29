require("dotenv").config();
const express = require("express");
const cors = require("cors");
const blobRoutes = require("./routes/blobRoutes");
const { createTables } = require("./db/setup");
const { errorHandler } = require("./middlewares/errorHandler");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
  })
);
app.use(express.json());

app.use("/v1/blobs", blobRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

module.exports = app;

(async () => {
  await createTables();

  if (require.main === module) {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
})();
