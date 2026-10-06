const crypto = require('crypto');
const fs = require('fs/promises');
const path = require('path');
const multer = require('multer');

const { badRequest } = require('./errorHandler');

// Photos are saved here, outside src/. The folder is gitignored, so uploads never reach GitHub.
const UPLOAD_DIR = path.resolve(__dirname, '../../uploads');
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const TOO_LARGE = 'Image must be 5 MB or smaller';
const ONE_IMAGE = 'Attach one image in the "image" field';
const UNSUPPORTED = 'Upload a JPG, PNG, or WebP image';

// The browser's claimed type is checked here, but it is easy to fake. detectImageType
// checks the file's first bytes after the upload as well.
const parseUpload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    // Random name. The user's filename is never used, so it can't clash or escape the folder.
    filename: (req, file, cb) => cb(null, crypto.randomUUID()),
  }),
  limits: { fileSize: MAX_BYTES, files: 1 },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) return cb(null, true);
    cb(new Error(UNSUPPORTED));
  },
}).single('image');

// Returns the extension for a JPEG, PNG, or WebP file, or null for anything else.
// Reads only the first 12 bytes, which is where each format's signature lives.
async function detectImageType(filePath) {
  const handle = await fs.open(filePath, 'r');
  try {
    const head = Buffer.alloc(12);
    await handle.read(head, 0, 12, 0);

    if (head.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) return '.jpg';
    if (head.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return '.png';
    if (head.toString('ascii', 0, 4) === 'RIFF' && head.toString('ascii', 8, 12) === 'WEBP') return '.webp';
    return null;
  } finally {
    await handle.close();
  }
}

// Runs before a controller. It does nothing for JSON requests and for forms without a photo.
const uploadImage = (req, res, next) => {
  parseUpload(req, res, async (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') return badRequest(res, TOO_LARGE);
      if (err.code === 'LIMIT_FILE_COUNT' || err.code === 'LIMIT_UNEXPECTED_FILE') return badRequest(res, ONE_IMAGE);
      return badRequest(res, UNSUPPORTED);
    }

    if (!req.file) return next();

    try {
      const extension = await detectImageType(req.file.path);
      if (!extension) {
        await fs.unlink(req.file.path);
        return badRequest(res, UNSUPPORTED);
      }

      // The extension lets the static server send the right Content-Type
      const finalPath = `${req.file.path}${extension}`;
      await fs.rename(req.file.path, finalPath);
      req.file.path = finalPath;
      req.file.filename = path.basename(finalPath);

      // If the controller rejects the request (bad fields, not the owner, unknown id),
      // the photo just saved is removed, so nothing is left behind unused
      res.on('finish', () => {
        if (res.statusCode >= 400) removeImage(imageUrlFor(req.file)).catch(() => {});
      });

      next();
    } catch (error) {
      next(error);
    }
  });
};

// The public path a browser uses for a saved photo. The app serves UPLOAD_DIR at /uploads.
const imageUrlFor = (file) => `/uploads/${file.filename}`;

// Deletes a saved photo. A photo that is already gone is not an error.
async function removeImage(imageUrl) {
  if (!imageUrl) return;
  try {
    await fs.unlink(path.join(UPLOAD_DIR, path.basename(imageUrl)));
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }
}

module.exports = { uploadImage, imageUrlFor, removeImage, UPLOAD_DIR };
