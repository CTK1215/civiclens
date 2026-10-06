import { useEffect, useState } from 'react';
import { checkPhoto, PHOTO_TYPES } from '../constants';

// Picks an optional photo and shows a preview. Calls onChange with the file, or null.
// currentUrl shows the photo an issue already has, while no new photo is chosen.
function PhotoInput({ onChange, currentUrl }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');

  // Frees the preview's memory when it is replaced or the form closes
  useEffect(() => {
    if (!previewUrl) return undefined;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const handleChange = (event) => {
    const file = event.target.files?.[0] || null;
    const problem = checkPhoto(file);

    if (!file || problem) {
      setError(problem || '');
      setPreviewUrl(null);
      onChange(null);
      // Clear the input, so the same file can be picked again after a fix
      event.target.value = '';
      return;
    }

    setError('');
    setPreviewUrl(URL.createObjectURL(file));
    onChange(file);
  };

  const shownUrl = previewUrl || currentUrl;

  return (
    <div>
      <label>
        Photo (optional: JPG, PNG, or WebP, up to 5 MB){' '}
        <input type="file" accept={PHOTO_TYPES.join(',')} onChange={handleChange} />
      </label>
      {error && <p role="alert">{error}</p>}
      {shownUrl && (
        <img
          className="photo-preview"
          src={shownUrl}
          alt={previewUrl ? 'New photo to upload' : 'Current photo'}
        />
      )}
    </div>
  );
}

export default PhotoInput;
