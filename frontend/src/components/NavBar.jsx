import { Link, useLocation, useNavigate } from 'react-router-dom';
import { clearToken, currentUser } from '../services/token';

function NavBar() {
  const navigate = useNavigate();
  // Reading the location makes the bar re-render after login, logout, and navigation
  useLocation();
  const user = currentUser();

  const logOut = () => {
    clearToken();
    navigate('/');
  };

  return (
    <nav>
      <Link to="/">CivicLens</Link>{' '}
      <Link to="/issues/new">Report an issue</Link>{' '}
      {user ? (
        <>
          <span>{user.email}</span>{' '}
          <button type="button" onClick={logOut}>Log out</button>
        </>
      ) : (
        <>
          <Link to="/login">Log in</Link>{' '}
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}

export default NavBar;
