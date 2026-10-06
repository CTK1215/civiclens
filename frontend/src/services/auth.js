import { request } from './api';
import { saveToken } from './token';

// Creates the account. The caller logs in next.
export const register = (email, password) =>
  request('/auth/register', { method: 'POST', body: { email, password } });

// Saves the token the server returns, so later requests send it
export async function login(email, password) {
  const { token } = await request('/auth/login', { method: 'POST', body: { email, password } });
  saveToken(token);
}
