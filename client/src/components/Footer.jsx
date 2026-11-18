import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <Logo />
        <div className="footer-links">
          <Link to="/#how">Necə işləyir?</Link>
          <Link to="/#directions">İstiqamətlər</Link>
          <Link to="/#about">Haqqımızda</Link>
        </div>
        <span>© {new Date().getFullYear()} SkillPulse</span>
      </div>
    </footer>
  );
}
