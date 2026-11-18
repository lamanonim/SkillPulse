import { Link } from 'react-router-dom';

export default function Logo() {
  return (
    <Link to="/" className="logo" aria-label="SkillPulse ana səhifə">
      <svg width="32" height="30" viewBox="0 0 34 32" aria-hidden="true">
        <defs>
          <linearGradient id="logo-g" x1="0" x2="1">
            <stop stopColor="#5b4cf0" />
            <stop offset="1" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <rect x="0" y="19" width="7" height="12" rx="2" fill="url(#logo-g)" />
        <rect x="9" y="13" width="7" height="18" rx="2" fill="url(#logo-g)" />
        <rect x="18" y="7" width="7" height="24" rx="2" fill="url(#logo-g)" />
        <path d="M2 15 L12 8 L20 11 L31 2" stroke="url(#logo-g)" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M25 2 H31 V8" stroke="url(#logo-g)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>
        Skill<b>Pulse</b>
      </span>
    </Link>
  );
}
