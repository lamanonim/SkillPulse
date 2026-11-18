import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api, { errorMessage } from '../api/client';
import Loader from '../components/Loader';
import SkillBars from '../components/SkillBars';
import { LEVEL_CLASS, directionTitle } from '../components/levels';
import Icon from '../components/Icons';

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

  // səhifə yenilənəndə state itir, ona görə nəticə /progress-dən götürülür
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
      <div className="container page">
        <div className="card empty">
          <div className="ficon"><Icon name="target" size={28} /></div>
          <h2>Hələ nəticə yoxdur</h2>
          <p>Bacarıqlarını ölçmək üçün bir istiqamət seç və testi keç.</p>
          <Link to="/directions" className="btn btn-primary">Testə başla</Link>
        </div>
      </div>
    );
  }

  const avg = Math.round(data.results.reduce((s, r) => s + r.percentage, 0) / data.results.length);

  const verdict = avg >= 70 ? 'Əla hazırlıq səviyyəsi' : avg >= 40 ? 'Yaxşı başlanğıc' : 'İnkişaf üçün böyük potensial';

  return (
    <div className="container page">
      <div className="page-head">
        <span className="pill">{directionTitle(data.direction)}</span>
        <h1 style={{ marginTop: 14 }}>Nəticən hazırdır</h1>
        <p>Hər bacarıq üzrə səviyyən və sənə uyğun hazırlanmış inkişaf planı.</p>
      </div>

      <div className="result-grid">
        <div className="card score-card">
          <div className="donut donut-lg" style={{ '--p': avg }}>
            <span>{avg}%</span>
          </div>
          <strong>{verdict}</strong>
          <small className="muted">Ümumi nəticə</small>
        </div>
        <div className="card">
          <h3 className="card-title">Bacarıqlar üzrə</h3>
          <SkillBars results={data.results} />
        </div>
      </div>

      <h2 className="section-title">Sənin inkişaf planın</h2>
      {data.plan.length === 0 ? (
        <div className="card empty">
          <div className="ficon"><Icon name="target" size={28} /></div>
          <h3>Əla nəticə! 🎉</h3>
          <p>Bütün bacarıqlarda güclüsən. Başqa istiqaməti də yoxlaya bilərsən.</p>
          <Link to="/directions" className="btn btn-ghost">Başqa istiqamət seç</Link>
        </div>
      ) : (
        <div className="plan-grid">
          {data.plan.map((group) => (
            <div key={group.skill} className="card">
              <div className="row-between">
                <h3 style={{ margin: 0 }}>{group.skill}</h3>
                <span className={`badge ${LEVEL_CLASS[group.level] || ''}`}>{group.level}</span>
              </div>
              <ul className="task-list">
                {group.tasks.map((t) => (
                  <li key={t.id}>
                    <strong>{t.title}</strong>
                    <p>{t.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <div className="actions-row">
        <Link to="/dashboard" className="btn btn-primary btn-lg">
          Kabinetə keç və tapşırıqlara başla <Icon name="arrow" size={18} />
        </Link>
        <Link to="/directions" className="btn btn-ghost btn-lg">Başqa test ver</Link>
      </div>
    </div>
  );
}
