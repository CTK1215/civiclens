// Values match the strings stored on each issue. The server accepts any text,
// so the form offers these choices and keeps the data consistent.
export const CATEGORIES = ['pothole', 'streetlight', 'graffiti', 'intersection', 'abandoned', 'other'];
export const STATUSES = ['open', 'closed'];

// Photo rules. The server enforces the same rules, so these only give an early message.
export const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const PHOTO_MAX_BYTES = 5 * 1024 * 1024;

// Returns a message if the file can't be used as a photo, or null if it's fine
export function checkPhoto(file) {
  if (!file) return null;
  if (!PHOTO_TYPES.includes(file.type)) return 'Upload a JPG, PNG, or WebP image';
  if (file.size > PHOTO_MAX_BYTES) return 'Image must be 5 MB or smaller';
  return null;
}
