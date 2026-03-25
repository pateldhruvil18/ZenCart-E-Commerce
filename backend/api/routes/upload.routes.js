const express = require('express');
const multer = require('multer');
const path = require('path');
const { protect, adminOnly } = require('../middlewares/auth.middleware');
const buildResponse = require('../utils/buildResponse');
const handleError = require('../utils/handleError');

const router = express.Router();

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// File Filter
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images only!');
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// POST /api/upload
// @desc Upload an image
// @access Private/Admin
router.post('/', protect, adminOnly, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const imageUrl = `/${req.file.path.replace(/\\/g, '/')}`;
    return buildResponse(res, 200, { imageUrl }, 'Image uploaded successfully');
  } catch (err) {
    return handleError(res, err);
  }
});

module.exports = router;
