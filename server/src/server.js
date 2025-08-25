const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const { v4: uuid } = require("uuid");
const path = require("path");
const fs = require("fs");
require('dotenv').config();

const connectDB = require('./db');
const Image = require('./models/Image');

// Connect to MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Configure multer for memory storage
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (_, file, cb) => {
    // Only allow image files
    if (/image\/(png|jpe?g|gif|webp)/.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type - only images are allowed"));
    }
  },
});

// Upload a new image
app.post("/api/images", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const imageDoc = new Image({
      filename: `${uuid()}${path.extname(req.file.originalname)}`,
      originalName: req.file.originalname,
      data: req.file.buffer,
      size: req.file.size,
      mimeType: req.file.mimetype,
    });

    await imageDoc.save();
    
    // Return the document without the binary data
    const response = imageDoc.toObject();
    delete response.data;
    res.status(201).json(response);
  } catch (err) {
    console.error('Error uploading image:', err);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Get all images
// Get all images metadata
app.get("/api/images", async (_, res) => {
  try {
    const images = await Image.find()
      .sort({ createdAt: -1 })
      .select('-data -__v')
      .lean();
    
    // Add image URL
    const baseUrl = process.env.API_URL || 'http://localhost:4000';
    images.forEach(img => {
      img.url = `${baseUrl}/api/images/${img._id}/data`;
    });
    
    res.json(images);
  } catch (err) {
    console.error('Error fetching images:', err);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

// Serve image data directly from MongoDB
app.get("/api/images/:id/data", async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.set('Content-Type', image.mimeType);
    res.send(image.data);
  } catch (err) {
    console.error('Error serving image:', err);
    res.status(500).json({ error: 'Failed to serve image' });
  }
});

// Delete an image
app.delete("/api/images/:id", async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Delete the image from MongoDB
    await image.deleteOne();
    res.sendStatus(204);
  } catch (err) {
    console.error('Error deleting image:', err);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Something went wrong!' });
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});