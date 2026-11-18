import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import SkillBars from '../components/SkillBars';
import { DIRECTIONS, directionTitle } from '../components/levels';
import Icon from '../components/Icons';

function summarize(tasks) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === 'done').length;
  return { total, done, pending: total - done, percentage: total ? Math.round((done / total) * 100) : 0 };
}

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    api
      .get('/progress')
      .then((res) => setData(res.data))
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  async function toggle(task) {
    setBusyId(task.id);
    setError('');
    try {
      // task_id yox, user_tasks.id göndərilməlidir
      const res = await api.patch(`/progress/tasks/${task.id}/toggle`);
      const tasks = data.tasks.map((t) => (t.id === task.id ? { ...t, status: res.data.task.status } : t));
      setData({ ...data, tasks, summary: summarize(tasks) });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <Loader />;

  if (!data?.assessment) {
    return (
      <div className="container page">
        <div className="page-head">
          <h1>Salam, {user?.name}! 👋</h1>
          <p>Kabinetinə xoş gəldin.</p>
        </div>
        {error && <div className="alert">{error}</div>}
        <div className="card empty">
          <div className="ficon"><Icon name="target" size={28} /></div>
          <h2>Hələ test verməmisən</h2>
          <p>Bacarıqlarını ölçmək və fərdi inkişaf planı almaq üçün bir istiqamət seç.</p>
          <Link to="/directions" className="btn btn-primary btn-lg">
            Testə başla <Icon name="arrow" size={18} />
          </Link>
        </div>
      </div>
    );
  }

  const { assessment, tasks, summary } = data;
  const bySkill = tasks.reduce((acc, t) => {
    (acc[t.skill] ??= []).push(t);
    return acc;
  }, {});
  const avg = Math.round(assessment.results.reduce((n, r) => n + r.percentage, 0) / assessment.results.length);
  const icon = DIRECTIONS.find((d) => d.id === assessment.direction)?.icon || 'target';

  return (
    <div className="container page">
      <div className="page-head">
        <h1>Salam, {user?.name}! 👋</h1>
        <p>
          Son test: <strong>{directionTitle(assessment.direction)}</strong> ·{' '}
          {new Date(assessment.created_at).toLocaleDateString('az-AZ')}
        </p>
      </div>

      {error && <div className="alert">{error}</div>}

      <div className="stats">
        <div className="card stat">
          <div className="donut" style={{ '--p': summary.percentage, '--size': '64px', '--hole': '7px' }}>
            <span style={{ fontSize: '0.9rem' }}>{summary.percentage}%</span>
          </div>
          <div>
            <strong>{summary.done} / {summary.total}</strong>
            <small>tapşırıq tamamlanıb</small>
          </div>
        </div>
        <div className="card stat">
          <div className="ficon"><Icon name={icon} /></div>
          <div>
            <strong>{avg}%</strong>
            <small>test nəticəsi</small>
          </div>
        </div>
        <div className="card stat">
          <div className="ficon"><Icon name="list" /></div>
          <div>
            <strong>{summary.pending}</strong>
            <small>qalan tapşırıq</small>
          </div>
        </div>
      </div>

      <div className="dash-grid">
        <div className="card">
          <h3 className="card-title">Bacarıqların</h3>
          <SkillBars results={assessment.results} />
          <Link to="/directions" className="btn btn-ghost btn-block" style={{ marginTop: 22 }}>Yeni test ver</Link>
        </div>

        <div className="card">
          <div className="row-between" style={{ marginBottom: 14 }}>
            <h3 className="card-title" style={{ margin: 0 }}>İnkişaf planı</h3>
            <span className="badge badge-primary">{summary.percentage}% tamamlanıb</span>
          </div>
          <div className="bar bar-lg" style={{ marginBottom: 18 }}>
            <div className="bar-fill" style={{ width: `${summary.percentage}%` }} />
          </div>
          {tasks.length === 0 ? (
            <p className="muted">Planında tapşırıq yoxdur, bütün bacarıqlarda güclüsən! 🎉</p>
          ) : (
            Object.entries(bySkill).map(([skill, list]) => (
              <div key={skill} className="task-group">
                <h4>{skill}</h4>
                {list.map((t) => (
                  <label key={t.id} className={`task ${t.status === 'done' ? 'done' : ''}`}>
                    <input
                      type="checkbox"
                      checked={t.status === 'done'}
                      disabled={busyId === t.id}
                      onChange={() => toggle(t)}
                    />
                    <span>
                      <strong>{t.title}</strong>
                      <small>{t.description}</small>
                    </span>
                  </label>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
