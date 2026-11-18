import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DIRECTIONS } from '../components/levels';
import HeroArt from '../components/HeroArt';
import Icon from '../components/Icons';

const FEATURES = [
  ['bolt', 'Bacarıqlarını qiymətləndir', 'Seçdiyin istiqamət üzrə hazırkı səviyyəni öyrən'],
  ['target', 'Çatışmayan bilikləri gör', 'Hansı bacarıqlar üzərində işləməli olduğunu müəyyən et'],
  ['growth', 'Fərdi inkişaf planı al', 'Konkret tapşırıqlarla irəlilə və nəticəni izlə'],
];

const STEPS = [
  ['Qeydiyyatdan keç', 'Bir dəqiqəyə pulsuz hesab yarat.'],
  ['İstiqamət seç', '10 karyera istiqamətindən sənə uyğun olanı seç.'],
  ['Testi keç', 'Real situasiyalara əsaslanan suallarla səviyyəni ölç.'],
  ['Planla irəlilə', 'Zəif bacarıqlar üçün tapşırıqları tamamla, irəliləyişini izlə.'],
];

export default function Landing() {
  const { user } = useAuth();
  const { hash } = useLocation();
  const start = user ? '/directions' : '/register';

  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
  }, [hash]);

  return (
    <div className="container">
      <section className="hero">
        <div>
          <span className="pill"><Icon name="sparkle" size={14} /> Karyera yolunda ilk addım</span>
          <h1>
            Karyera yolunu
            <br />
            öz <span className="grad-text">bacarıqlarınla</span> qur!
          </h1>
          <p className="lead">
            Bacarıqlarını qiymətləndir, çatışmayan biliklərini müəyyənləşdir və məqsədinə uyğun fərdi
            inkişaf planı əldə et.
          </p>
          <div className="hero-cta">
            <Link to={start} className="btn btn-primary btn-lg">
              İndi başla <Icon name="arrow" size={18} />
            </Link>
          </div>
        </div>
        <HeroArt />
      </section>

      <section className="features">
        {FEATURES.map(([icon, title, text]) => (
          <div key={title} className="card feature">
            <div className="ficon"><Icon name={icon} size={26} /></div>
            <div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          </div>
        ))}
      </section>

      <section id="how" className="section">
        <div className="section-head">
          <span className="pill">Necə işləyir?</span>
          <h2>4 addımda karyera planın hazırdır</h2>
          <p>Məlumatı ayrı-ayrı yerlərdə axtarmaq əvəzinə hər şey bir platformada.</p>
        </div>
        <div className="steps">
          {STEPS.map(([title, text], i) => (
            <div key={title} className="card step">
              <div className="step-num">{i + 1}</div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="directions" className="section">
        <div className="section-head">
          <span className="pill">İstiqamətlər</span>
          <h2>Sənə uyğun istiqaməti seç</h2>
          <p>Proqramlaşdırmadan dizayna, data analitikadan marketinqə qədər.</p>
        </div>
        <div className="dir-mini">
          {DIRECTIONS.map((d) => (
            <Link key={d.id} to={user ? `/test/${d.id}` : '/register'} className="card">
              <div className="ficon"><Icon name={d.icon} /></div>
              <strong>{d.title}</strong>
              <small>{d.skills.length} bacarıq · {d.questions} sual</small>
            </Link>
          ))}
        </div>
      </section>

      <section id="about" className="section">
        <div className="about">
          <div>
            <span className="pill">Haqqımızda</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.4vw, 2.5rem)', fontWeight: 800, marginTop: 14 }}>
              Tələbələr üçün <span className="grad-text">aydın başlanğıc nöqtəsi</span>
            </h2>
            <p>
              Tələbələr karyeraya hazırlaşarkən çox vaxt haradan başlamalı və hansı bacarıqları inkişaf
              etdirməli olduqlarını bilmirlər. SkillPulse qiymətləndirməni, əvvəlcədən müəyyən edilmiş
              meyarlarla müqayisəni, fərdi inkişaf planını və irəliləyişin izlənməsini vahid platformada
              birləşdirir.
            </p>
          </div>
          <div className="about-list">
            {[
              ['target', 'Şəffaf meyarlar', 'Nəticə hər bacarıq üzrə faizlə və aydın səviyyələrlə göstərilir.'],
              ['list', 'Konkret tapşırıqlar', 'Ümumi məsləhət yox, real resurslarla praktiki işlər.'],
              ['growth', 'İrəliləyişin izlənməsi', 'Tamamladığın hər tapşırıq kabinetində görünür.'],
            ].map(([icon, title, text]) => (
              <div key={title} className="card">
                <div className="ficon"><Icon name={icon} size={20} /></div>
                <div>
                  <h4>{title}</h4>
                  <p className="muted">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="cta-banner">
          <div>
            <h2>Bacarıqlarını bu gün yoxla</h2>
            <p>Bir neçə dəqiqəlik test, ömürlük aydın plan.</p>
          </div>
          <Link to={start} className="btn btn-white btn-lg">
            Pulsuz başla <Icon name="arrow" size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
