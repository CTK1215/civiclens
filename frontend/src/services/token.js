const TOKEN_KEY = 'civiclens-token';

// localStorage keeps the token across page reloads. Private windows and blocked storage can
// throw, so every read and write is guarded. Without storage the app still works, just logged out.
export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function saveToken(token) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // Storage is unavailable, so the user stays logged out after a reload
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Nothing was stored, so there is nothing to clear
  }
}

// Reads the id and email from the token so the page can show who is logged in and which
// issues are theirs. This does not check the signature. The server checks it on every request.
export function currentUser() {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (payload.exp * 1000 < Date.now()) return null;
    return { id: Number(payload.sub), email: payload.email };
  } catch {
    return null;
  }
}
