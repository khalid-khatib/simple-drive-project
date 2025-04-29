const storageService = require("../utils/storageService");
const blobModel = require("../models/blobMeta");

exports.uploadBlob = async (req, res) => {
  try {
    const { id, data } = req.body;
    if (!id || !data) {
      return res.status(400).json({ message: "id and data are required" });
    }

    // Checks if ID already exists
    const existingMetadata = await blobModel.getMetadata(id);
    if (existingMetadata) {
      return res
        .status(409)
        .json({ message: "A blob with this id already exists" });
    }

    // Validates if string is base-64
    let buffer;
    try {
      buffer = Buffer.from(data, "base64");
      const normalized = data.replace(/\s+/g, "");
      if (buffer.toString("base64") !== normalized) {
        throw new Error("Invalid base64");
      }
    } catch (err) {
      return res.status(400).json({ message: "Invalid base64 data" });
    }

    await storageService.save(id, buffer);

    await blobModel.insertMetadata(id, buffer.length);

    res.status(201).json({ message: "Blob saved" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getBlob = async (req, res) => {
  try {
    const id = req.params.id;
    const metadata = await blobModel.getMetadata(id);
    if (!metadata) {
      return res.status(404).json({ message: "Blob not found" });
    }

    const buffer = await storageService.retrieve(id);
    const data = buffer.toString("base64");

    res.json({
      id,
      data,
      size: metadata.size,
      created_at: metadata.created_at,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
