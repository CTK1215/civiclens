import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login, register } from '../services/auth';

const MIN_PASSWORD_LENGTH = 8;

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  // Creates the account, then logs in so the visitor lands on the issue list signed in
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(email, password);
      await login(email, password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <section>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <p>
          <label>
            Email{' '}
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
        </p>
        <p>
          <label>
            Password (at least {MIN_PASSWORD_LENGTH} characters){' '}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={MIN_PASSWORD_LENGTH}
              required
            />
          </label>
        </p>
        {error && <p role="alert">{error}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? 'Creating account...' : 'Register'}
        </button>
      </form>
      <p>Already registered? <Link to="/login">Log in</Link></p>
    </section>
  );
}

export default RegisterPage;
