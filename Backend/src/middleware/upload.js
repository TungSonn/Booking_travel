const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const MAX_SIZE = parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024; // 5MB

// Dynamic storage based on field name
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderMap = {
      thumbnail: 'uploads/hotels',
      avatar:    'uploads/guides',
      images:    req.baseUrl.includes('guide') ? 'uploads/guides'
               : req.baseUrl.includes('tour')  ? 'uploads/tours'
               : 'uploads/hotels',
    };
    cb(null, folderMap[file.fieldname] || 'uploads/hotels');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuidv4()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error('Only jpg, jpeg, png, webp images are allowed'), false);
};

// Factory: thumbnailField (single), imagesField (array), maxCount
const uploadImages = (thumbnailField, imagesField, maxCount = 10) => {
  const fields = [];
  if (thumbnailField) fields.push({ name: thumbnailField, maxCount: 1 });
  if (imagesField)    fields.push({ name: imagesField, maxCount });

  return multer({ storage, fileFilter, limits: { fileSize: MAX_SIZE } }).fields(fields);
};

module.exports = { uploadImages };
