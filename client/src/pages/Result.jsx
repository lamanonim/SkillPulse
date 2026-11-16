// Nəticə: test bitəndə POST /assessments cavabı ilə açılır.
// Səhifə yenilənsə (state itər), son nəticə GET /progress-dən götürülür.
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api, { errorMessage } from '../api/client';
import Loader from '../components/Loader';
import SkillBars from '../components/SkillBars';
import { LEVEL_CLASS } from '../components/levels';

// GET /progress cavabından plan qurmaq (tapşırıqları bacarığa görə qruplaşdırır)
function planFromProgress(progress) {
  const levels = Object.fromEntries(progress.assessment.results.map((r) => [r.skill, r.level]));
  const groups = {};
  for (const t of progress.tasks) {
    groups[t.skill] ??= { skill: t.skill, level: levels[t.skill], tasks: [] };
    groups[t.skill].tasks.push(t);
  }
  return Object.values(groups);
}

export default function Result() {
  const { state } = useLocation();
  const [data, setData] = useState(state);
  const [loading, setLoading] = useState(!state);
  const [error, setError] = useState('');

  useEffect(() => {
    if (state) return;
    api
      .get('/progress')
      .then((res) => {
        if (res.data.assessment) {
          setData({
            direction: res.data.assessment.direction,
            results: res.data.assessment.results,
            plan: planFromProgress(res.data),
          });
        }
      })
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, [state]);

  if (loading) return <Loader />;
  if (error) return <div className="container page"><div className="alert">{error}</div></div>;
  if (!data) {
    return (
      <div className="container page center">
        <h2>Hələ nəticə yoxdur</h2>
        <Link to="/directions" className="btn btn-primary">Testə başla</Link>
      </div>
    );
  }

  const avg = Math.round(data.results.reduce((s, r) => s + r.percentage, 0) / data.results.length);

  return (
    <div className="container page">
      <span className="eyebrow">{data.direction}</span>
      <h1>Nəticən</h1>

      <div className="result-grid">
        <div className="card score-card">
          <div className="score-circle" style={{ '--p': avg }}>
            <span>{avg}%</span>
          </div>
          <p className="muted">Ümumi nəticə</p>
        </div>
        <div className="card">
          <h3>Bacarıqlar üzrə</h3>
          <SkillBars results={data.results} />
        </div>
      </div>

      <h2 className="section-title">Sənin inkişaf planın</h2>
      {data.plan.length === 0 ? (
        <div className="card center">
          <h3>🎉 Əla nəticə!</h3>
          <p className="muted">Bütün bacarıqlarda güclüsən. Başqa istiqaməti də yoxlaya bilərsən.</p>
          <Link to="/directions" className="btn btn-outline">Başqa istiqamət</Link>
        </div>
      ) : (
        <div className="plan">
          {data.plan.map((group) => (
            <div key={group.skill} className="card">
              <div className="skill-row-head">
                <h3>{group.skill}</h3>
                <span className={`badge ${LEVEL_CLASS[group.level] || ''}`}>{group.level}</span>
              </div>
              <ul className="task-list">
                {group.tasks.map((t) => (
                  <li key={t.id}>
                    <strong>{t.title}</strong>
                    <p className="muted">{t.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <div className="hero-actions">
        <Link to="/dashboard" className="btn btn-primary">Kabinetə keç və tapşırıqlara başla</Link>
        <Link to="/directions" className="btn btn-outline">Testi yenidən ver</Link>
      </div>
    </div>
  );
}
