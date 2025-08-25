const Image = require("../models/Image");
const { v4: uuid } = require("uuid");
const path = require("path");

const BASE_URL = process.env.API_URL;

// Upload image
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    const imageDoc = new Image({
      filename: `${uuid()}${path.extname(req.file.originalname)}`,
      originalName: req.file.originalname,
      data: req.file.buffer,
      size: req.file.size,
      mimeType: req.file.mimetype,
    });

    await imageDoc.save();

    const response = imageDoc.toObject();
    delete response.data;
    res.status(201).json(response);
  } catch (err) {
    console.error("Error uploading image:", err);
    res.status(500).json({ error: "Failed to upload image" });
  }
};

// Get all images metadata
exports.getImages = async (req, res) => {
  try {
    const images = await Image.find()
      .sort({ createdAt: -1 })
      .select("-data -__v")
      .lean();

    images.forEach((img) => {
      img.url = `${BASE_URL}/api/images/${img._id}/data`; 
    });

    res.json(images);
  } catch (err) {
    console.error("Error fetching images:", err);
    res.status(500).json({ error: "Failed to fetch images" });
  }
};

// Serve image data
exports.getImageData = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    res.set("Content-Type", image.mimeType);
    res.send(image.data);
  } catch (err) {
    console.error("Error serving image:", err);
    res.status(500).json({ error: "Failed to serve image" });
  }
};
