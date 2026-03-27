const express = require('express');
const { protect, adminOnly } = require('../middlewares/auth.middleware');
const buildResponse = require('../utils/buildResponse');
const handleError = require('../utils/handleError');

// Import Cloudinary Storage
const multer = require('multer');
const { storage } = require('../config/cloudinary');

const router = express.Router();

// File Filter (for images)
function checkFileType(file, cb) {
  if (file.mimetype.startsWith('image/')) {
    return cb(null, true);
  } else {
    cb(new Error('Images only!'));
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// POST /api/upload
// @desc Upload image(s) to Cloudinary
// @access Private
router.post('/', protect, upload.array('image', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      if (req.file) {
        // Fallback for single uploads just in case
        return buildResponse(res, 200, { imageUrl: req.file.path }, 'Image uploaded successfully');
      }
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Return array of URLs and first URL for backward compatibility
    const imageUrls = req.files.map(file => file.path);
    const imageUrl = imageUrls[0];

    return buildResponse(res, 200, { imageUrls, imageUrl }, 'Image(s) uploaded successfully');
  } catch (err) {
    return handleError(res, err);
  }
});

module.exports = router;
