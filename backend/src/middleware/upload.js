const multer = require('multer');
const path = require('path');
const fs = require('fs');
const AppError = require('../utils/AppError');

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// If Cloudinary is configured, prefer memory storage so files can be streamed
// directly to Cloudinary without touching disk. Otherwise fall back to disk storage.
const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_URL || (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)
);

const storage = isCloudinaryConfigured
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: (req, file, cb) => cb(null, uploadDir),
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, `img-${uniqueSuffix}${ext}`);
      },
    });

const fileFilter = (req, file, cb) => {
  const allowed = new Map([
    ['image/jpeg', ['.jpg', '.jpeg']],
    ['image/png', ['.png']],
    ['image/webp', ['.webp']],
    ['image/gif', ['.gif']],
  ]);
  const ext = path.extname(file.originalname || '').toLowerCase();
  if (allowed.has(file.mimetype) && allowed.get(file.mimetype).includes(ext)) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        'Invalid image upload. Please upload only JPG, PNG, WEBP, or GIF files.',
        400
      ),
      false
    );
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
  fileFilter: fileFilter,
});

module.exports = upload;
