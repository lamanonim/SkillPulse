import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import SkillBars from '../components/SkillBars';

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
      <div className="container page center">
        <h1>Salam, {user?.name}! 👋</h1>
        {error && <div className="alert">{error}</div>}
        <div className="card empty">
          <h2>Hələ test verməmisən</h2>
          <p className="muted">Bacarıqlarını ölçmək və fərdi inkişaf planı almaq üçün testə başla.</p>
          <Link to="/directions" className="btn btn-primary">Testə başla</Link>
        </div>
      </div>
    );
  }

  const { assessment, tasks, summary } = data;
  const bySkill = tasks.reduce((acc, t) => {
    (acc[t.skill] ??= []).push(t);
    return acc;
  }, {});

  return (
    <div className="container page">
      <h1>Salam, {user?.name}! 👋</h1>
      <p className="lead">
        Son test: <strong>{assessment.direction}</strong> ·{' '}
        {new Date(assessment.created_at).toLocaleDateString('az-AZ')}
      </p>

      {error && <div className="alert">{error}</div>}

      <div className="card progress-card">
        <div className="skill-row-head">
          <h3>Ümumi irəliləyiş</h3>
          <strong>{summary.percentage}%</strong>
        </div>
        <div className="bar bar-lg">
          <div className="bar-fill level-strong" style={{ width: `${summary.percentage}%` }} />
        </div>
        <small className="muted">
          {summary.done} / {summary.total} tapşırıq tamamlanıb
        </small>
      </div>

      <div className="result-grid">
        <div className="card">
          <h3>Bacarıqların</h3>
          <SkillBars results={assessment.results} />
          <Link to="/directions" className="btn btn-outline btn-block">Testi yenidən ver</Link>
        </div>

        <div className="card">
          <h3>Tapşırıqlar</h3>
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
                      <small className="muted">{t.description}</small>
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
