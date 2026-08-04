const path = require('path');
const fs = require('fs');
const { uploadToCloudinary } = require('../utils/cloudinary');

const uploadsDir = path.join(__dirname, '../../uploads');
const outFile = path.join(__dirname, 'uploads-to-cloudinary.json');

async function fileList(dir) {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    if (e.isFile()) files.push(path.join(dir, e.name));
  }
  return files;
}

async function main() {
  const isConfigured = Boolean(process.env.CLOUDINARY_URL || (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET));
  if (!isConfigured) {
    console.error('Cloudinary credentials are not configured. Set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET before running.');
    process.exit(2);
  }

  if (!fs.existsSync(uploadsDir)) {
    console.error('Uploads directory does not exist:', uploadsDir);
    process.exit(0);
  }

  console.log('Scanning uploads directory:', uploadsDir);
  const files = await fileList(uploadsDir);
  console.log(`Found ${files.length} file(s) to migrate.`);

  const mapping = {};
  for (const filePath of files) {
    const filename = path.basename(filePath);
    try {
      console.log('Uploading', filename);
      const url = await uploadToCloudinary(filePath);
      mapping[filename] = { url };
      console.log('Uploaded:', filename, '->', url);
      if (process.argv.includes('--delete')) {
        try { await fs.promises.unlink(filePath); console.log('Deleted local file:', filename); } catch (err) { console.warn('Could not delete', filename, err.message); }
      }
    } catch (err) {
      console.error('Failed to upload', filename, err.message);
      mapping[filename] = { error: err.message };
    }
  }

  await fs.promises.writeFile(outFile, JSON.stringify(mapping, null, 2), 'utf8');
  console.log('Migration complete. Mapping written to', outFile);
  console.log('Tip: review the mapping and update any DB records that referenced /uploads/<filename> to the new Cloudinary URL.');
}

main().catch((err) => {
  console.error('Migration failed:', err.message || err);
  process.exit(1);
});
