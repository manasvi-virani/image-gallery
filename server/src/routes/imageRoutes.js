const express = require("express");
const router = express.Router();
const upload = require("../utils/multerConfig");
const imageController = require("../controllers/imageController");

router.post("/", upload.single("image"), imageController.uploadImage);
router.get("/", imageController.getImages);
router.get("/:id/data", imageController.getImageData);

module.exports = router;