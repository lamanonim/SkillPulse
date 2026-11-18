import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Logo from './Logo';
import Icon from './Icons';

const SECTIONS = [
  ['how', 'Necə işləyir?'],
  ['directions', 'İstiqamətlər'],
  ['about', 'Haqqımızda'],
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function handleLogout() {
    logout();
    navigate('/');
  }

  const onLanding = pathname === '/';

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-inner">
        <Logo />

        <nav className="nav-links">
          {user ? (
            <>
              <NavLink to="/" end>Ana səhifə</NavLink>
              <NavLink to="/directions">İstiqamətlər</NavLink>
              <NavLink to="/dashboard">Kabinet</NavLink>
            </>
          ) : (
            <>
              <Link to="/" className={onLanding && !hash ? 'active' : ''}>Ana səhifə</Link>
              {SECTIONS.map(([id, label]) => (
                <Link key={id} to={`/#${id}`} className={onLanding && hash === `#${id}` ? 'active' : ''}>
                  {label}
                </Link>
              ))}
            </>
          )}
        </nav>

        <div className="nav-actions">
          <button
            className="icon-btn"
            onClick={toggle}
            title={theme === 'dark' ? 'Açıq rejim' : 'Qaranlıq rejim'}
            aria-label="Rejimi dəyiş"
          >
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
          </button>
          {user ? (
            <>
              <Link to="/dashboard" className="user-chip">
                <span className="avatar">{user.name?.[0]?.toUpperCase()}</span>
                <span className="name">{user.name}</span>
              </Link>
              <button className="icon-btn" onClick={handleLogout} title="Çıxış" aria-label="Çıxış">
                <Icon name="logout" size={18} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Daxil ol</Link>
              <Link to="/register" className="btn btn-primary">
                <span className="hide-sm">Qeydiyyatdan keç</span>
                <span className="show-sm">Qeydiyyat</span>
                <Icon name="arrow" size={16} className="hide-sm" />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
