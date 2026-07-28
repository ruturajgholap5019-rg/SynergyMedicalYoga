const cloudinary = require('cloudinary').v2;
const fs = require('fs');

if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    secure: true,
  });
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dqugmycrs',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

/**
 * Uploads a file (Multer object or file path string) to Cloudinary
 * @param {Object|String} file - Multer file object or local file path
 * @returns {Promise<String>} - Secure Cloudinary HTTPS URL
 */
const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const isConfigured = process.env.CLOUDINARY_URL || (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
    if (!isConfigured) {
      return reject(new Error('Cloudinary environment variables are missing.'));
    }

    const options = {
      folder: 'synergy_medical_yoga',
      resource_type: 'auto',
    };

    if (file && file.buffer) {
      // Memory storage buffer upload
      const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      });
      stream.end(file.buffer);
    } else {
      // Disk storage file path upload
      const filePath = typeof file === 'string' ? file : file?.path;
      if (!filePath || !fs.existsSync(filePath)) {
        return reject(new Error('File path does not exist for Cloudinary upload.'));
      }
      cloudinary.uploader.upload(filePath, options, (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      });
    }
  });
};

module.exports = { cloudinary, uploadToCloudinary };
