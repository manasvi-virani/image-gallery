const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  data: {
    type: Buffer,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Add indexes for common queries
imageSchema.index({ createdAt: -1 });
imageSchema.index({ filename: 1 });

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
