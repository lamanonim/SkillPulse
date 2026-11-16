import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container page center">
      <h1>404</h1>
      <p className="lead">Belə səhifə tapılmadı.</p>
      <Link to="/" className="btn btn-primary">Ana səhifə</Link>
    </div>
  );
}
