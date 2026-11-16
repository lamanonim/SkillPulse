import { Link } from 'react-router-dom';
import { DIRECTIONS } from '../components/levels';

export default function Directions() {
  return (
    <div className="container page">
      <h1>İstiqamət seç</h1>
      <p className="lead">Hansı sahədə bacarıqlarını yoxlamaq istəyirsən?</p>

      <div className="grid-2">
        {DIRECTIONS.map((d) => (
          <Link key={d.id} to={`/test/${d.id}`} className="card direction-card">
            <h2>{d.title}</h2>
            <p className="muted">{d.text}</p>
            <div className="chips">
              {d.skills.map((s) => (
                <span key={s} className="chip">{s}</span>
              ))}
            </div>
            <span className="link-arrow">Testə başla →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
