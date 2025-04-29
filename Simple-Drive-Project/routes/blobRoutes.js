const { Router } = require("express");
const { uploadBlob, getBlob } = require("../controllers/blobController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = Router();

router.post("/", authMiddleware, uploadBlob);
router.get("/:id", authMiddleware, getBlob);

module.exports = router;
