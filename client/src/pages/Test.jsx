// Test: suallar bir-bir göstərilir, sonda POST /assessments
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { errorMessage } from '../api/client';
import Loader from '../components/Loader';

export default function Test() {
  const { direction } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({}); // { questionId: "variantın mətni" }
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/assessments/questions/${direction}`)
      .then((res) => setQuestions(res.data.questions))
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, [direction]);

  if (loading) return <Loader text="Suallar yüklənir..." />;

  if (error && questions.length === 0) {
    return (
      <div className="container page">
        <div className="alert">{error}</div>
        <Link to="/directions" className="btn btn-outline">Geri qayıt</Link>
      </div>
    );
  }

  const q = questions[index];
  const isLast = index === questions.length - 1;
  const answeredCount = Object.keys(answers).length;
  const progress = Math.round(((index + 1) / questions.length) * 100);

  function choose(option) {
    setAnswers({ ...answers, [q.id]: option });
  }

  async function submit() {
    if (answeredCount === 0) {
      setError('Ən azı bir suala cavab verin.');
      return;
    }
    const unanswered = questions.length - answeredCount;
    if (unanswered > 0 && !window.confirm(`${unanswered} suala cavab verilməyib. Onlar səhv sayılacaq. Davam edək?`)) {
      return;
    }
    setSending(true);
    setError('');
    try {
      const payload = {
        direction,
        answers: Object.entries(answers).map(([questionId, answer]) => ({
          questionId: Number(questionId),
          answer, // variantın tam mətni (indeks yox)
        })),
      };
      const res = await api.post('/assessments', payload);
      navigate('/result', { state: res.data });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="container page narrow">
      <div className="test-head">
        <span className="chip">{q.skill}</span>
        <span className="muted">
          Sual {index + 1} / {questions.length}
        </span>
      </div>
      <div className="bar">
        <div className="bar-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="card question-card">
        <h2 className="question">{q.question}</h2>
        <div className="options">
          {q.options.map((opt) => (
            <button
              key={opt}
              type="button"
              className={`option ${answers[q.id] === opt ? 'selected' : ''}`}
              onClick={() => choose(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="alert">{error}</div>}

      <div className="test-nav">
        <button className="btn btn-outline" disabled={index === 0} onClick={() => setIndex(index - 1)}>
          ← Əvvəlki
        </button>
        {isLast ? (
          <button className="btn btn-primary" disabled={sending} onClick={submit}>
            {sending ? 'Yoxlanılır...' : 'Testi bitir'}
          </button>
        ) : (
          <button className="btn btn-primary" onClick={() => setIndex(index + 1)}>
            Növbəti →
          </button>
        )}
      </div>
      <p className="muted center">Cavablandırılıb: {answeredCount} / {questions.length}</p>
    </div>
  );
}
