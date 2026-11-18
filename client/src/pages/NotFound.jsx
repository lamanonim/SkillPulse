import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container page center notfound">
      <h1 className="grad-text">404</h1>
      <p className="muted" style={{ fontSize: '1.1rem', marginBottom: 24 }}>Belə səhifə tapılmadı.</p>
      <Link to="/" className="btn btn-primary">Ana səhifəyə qayıt</Link>
    </div>
  );
}
