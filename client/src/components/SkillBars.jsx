import { LEVEL_CLASS } from './levels';

export default function SkillBars({ results }) {
  return (
    <div className="skill-bars">
      {results.map((r) => (
        <div key={r.skill} className="skill-row">
          <div className="skill-row-head">
            <strong>{r.skill}</strong>
            <span className={`badge ${LEVEL_CLASS[r.level] || ''}`}>{r.level}</span>
          </div>
          <div className="bar">
            <div
              className={`bar-fill ${LEVEL_CLASS[r.level] || ''}`}
              style={{ width: `${r.percentage}%` }}
            />
          </div>
          <small className="muted">
            {r.correct}/{r.total} düzgün · {r.percentage}%
          </small>
        </div>
      ))}
    </div>
  );
}
