import { request } from './api';

// Filters go in the query string. The server matches them exactly.
export function listIssues({ category, status } = {}) {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (status) params.set('status', status);
  const query = params.toString();
  return request(`/issues${query ? `?${query}` : ''}`);
}

export const getIssue = (id) => request(`/issues/${id}`);

// Builds the form for a request that includes a photo. The photo goes in the "image" field.
const withPhoto = (fields, photo) => {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) form.append(key, value);
  form.append('image', photo);
  return form;
};

// Without a photo the request is plain JSON. With one, the fields and the photo go as a form.
export const createIssue = (issue, photo) =>
  photo
    ? request('/issues', { method: 'POST', form: withPhoto(issue, photo) })
    : request('/issues', { method: 'POST', body: issue });

export const updateIssue = (id, issue, photo) =>
  photo
    ? request(`/issues/${id}`, { method: 'PUT', form: withPhoto(issue, photo) })
    : request(`/issues/${id}`, { method: 'PUT', body: issue });

export const deleteIssue = (id) => request(`/issues/${id}`, { method: 'DELETE' });

// The server saves photos at /uploads/... The app reaches it through /api, the same way as the API
export const photoUrl = (imageUrl) => (imageUrl ? `/api${imageUrl}` : null);
