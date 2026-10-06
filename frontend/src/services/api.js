import { clearToken, getToken } from './token';

// Every request goes through here, so the token, the error messages, and the expired-session
// redirect all live in one place. The Vite proxy sends /api/... to the Express server.
// Pass `body` for JSON, or `form` for a request with a photo. The browser sets the upload headers itself.
export async function request(path, { method = 'GET', body, form } = {}) {
  const token = getToken();
  const headers = {};
  let payload;

  if (form) {
    payload = form;
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`/api${path}`, { method, headers, body: payload });

  // A token the server rejects means the session expired
  if (res.status === 401 && token) {
    clearToken();
    window.location.assign('/login');
    throw new Error('Your session ended. Log in again.');
  }

  // Delete returns 204 with no body
  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error || `Request failed with status ${res.status}`);
  }
  return data;
}
