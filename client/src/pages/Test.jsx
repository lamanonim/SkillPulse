import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { errorMessage } from '../api/client';
import Loader from '../components/Loader';
import Icon from '../components/Icons';
import { directionTitle } from '../components/levels';

export default function Test() {
  const { direction } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [confirmSkip, setConfirmSkip] = useState(false);

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
        <Link to="/directions" className="btn btn-ghost">Geri qayıt</Link>
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
    if (questions.length - answeredCount > 0 && !confirmSkip) {
      setConfirmSkip(true);
      return;
    }
    setSending(true);
    setError('');
    try {
      const payload = {
        direction,
        answers: Object.entries(answers).map(([questionId, answer]) => ({
          questionId: Number(questionId),
          // backend variantın indeksini yox, mətnini gözləyir
          answer,
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

  const unanswered = questions.length - answeredCount;
  const letters = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div className="container page narrow">
      <div className="test-head">
        <span>
          <strong>{directionTitle(direction)}</strong> <span className="chip" style={{ marginLeft: 8 }}>{q.skill}</span>
        </span>
        <span className="muted">Sual {index + 1} / {questions.length}</span>
      </div>
      <div className="bar">
        <div className="bar-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="card question-card">
        <h2 className="question">{q.question}</h2>
        <div className="options">
          {q.options.map((opt, i) => (
            <button
              key={opt}
              type="button"
              className={`option ${answers[q.id] === opt ? 'selected' : ''}`}
              onClick={() => choose(opt)}
            >
              <span className="key">{letters[i]}</span>
              <span>{opt}</span>
            </button>
          ))}
        </div>
      </div>

      {error && <div className="alert">{error}</div>}
      {confirmSkip && unanswered > 0 && (
        <div className="alert">
          {unanswered} suala cavab verilməyib, onlar səhv sayılacaq. Bitirmək üçün düyməyə yenidən bas.
        </div>
      )}

      <div className="test-nav">
        <button className="btn btn-ghost" disabled={index === 0} onClick={() => setIndex(index - 1)}>
          ← Əvvəlki
        </button>
        {isLast ? (
          <button className="btn btn-primary" disabled={sending} onClick={submit}>
            {sending ? 'Yoxlanılır...' : <>Testi bitir <Icon name="check" size={17} /></>}
          </button>
        ) : (
          <button className="btn btn-primary" onClick={() => setIndex(index + 1)}>
            Növbəti <Icon name="arrow" size={17} />
          </button>
        )}
      </div>
      <p className="test-foot">Cavablandırılıb: {answeredCount} / {questions.length}</p>
    </div>
  );
}
