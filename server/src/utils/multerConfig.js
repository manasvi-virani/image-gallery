const multer = require("multer");

// Multer memory storage
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_, file, cb) => {
    if (/image\/(png|jpe?g|gif|webp)/.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type - only images are allowed"));
    }
  },
});

module.exports = upload;
