import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="container">
      <section className="hero">
        <span className="eyebrow">Tələbələr üçün karyera hazırlığı</span>
        <h1>
          Bacarıqlarını ölç. <span className="accent">Boşluqları gör.</span> Planla inkişaf et.
        </h1>
        <p className="lead">
          SkillPulse seçdiyin istiqamət üzrə hazırkı səviyyəni müəyyən edir, hansı bacarıqlar üzərində
          işləməli olduğunu göstərir və sənə konkret tapşırıqlardan ibarət inkişaf planı verir.
        </p>
        <div className="hero-actions">
          {user ? (
            <>
              <Link to="/directions" className="btn btn-primary">Testə başla</Link>
              <Link to="/dashboard" className="btn btn-outline">Kabinetim</Link>
            </>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary">Pulsuz başla</Link>
              <Link to="/login" className="btn btn-outline">Daxil ol</Link>
            </>
          )}
        </div>
      </section>

      <section className="steps">
        {[
          ['1', 'İstiqamət seç', 'Frontend və ya Backend, hansı sahədə inkişaf etmək istədiyini seç.'],
          ['2', 'Testi keç', 'Qısa suallarla hər bacarıq üzrə səviyyən ölçülür.'],
          ['3', 'Nəticəni gör', 'Hansı bacarıqda güclü, hansında zəif olduğunu faizlə gör.'],
          ['4', 'Planla irəlilə', 'Fərdi tapşırıqları tamamla və irəliləyişini izlə.'],
        ].map(([n, title, text]) => (
          <div key={n} className="card step">
            <span className="step-num">{n}</span>
            <h3>{title}</h3>
            <p className="muted">{text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
