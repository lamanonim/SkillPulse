import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="logo">
          <span className="logo-dot" /> SkillPulse
        </Link>
        <nav className="nav-links">
          {user ? (
            <>
              <NavLink to="/directions">Test</NavLink>
              <NavLink to="/dashboard">Kabinet</NavLink>
              <span className="nav-user">{user.name}</span>
              <button className="btn btn-ghost" onClick={handleLogout}>
                Çıxış
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Daxil ol</NavLink>
              <Link to="/register" className="btn btn-primary btn-sm">
                Qeydiyyat
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
