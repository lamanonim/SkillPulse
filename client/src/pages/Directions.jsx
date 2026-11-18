import { Link } from 'react-router-dom';
import { DIRECTIONS, DIRECTION_GROUPS } from '../components/levels';
import Icon from '../components/Icons';

export default function Directions() {
  return (
    <div className="container page">
      <div className="page-head">
        <h1>İstiqamət seç</h1>
        <p>{DIRECTIONS.length} karyera istiqaməti. Birini seç, qısa testlə səviyyəni öyrən və fərdi inkişaf planı al.</p>
      </div>

      {DIRECTION_GROUPS.map((group) => (
        <section key={group.id} className="dir-group">
          <h2>{group.title}</h2>
          <div className="grid-3">
            {DIRECTIONS.filter((d) => d.group === group.id).map((d) => (
              <Link key={d.id} to={`/test/${d.id}`} className="card dir-card">
                <div className="dir-head">
                  <div className="ficon"><Icon name={d.icon} /></div>
                  {d.featured && <span className="badge badge-primary">Ətraflı test</span>}
                </div>
                <h3>{d.title}</h3>
                <p>{d.text}</p>
                <div className="chips">
                  {d.skills.map((s) => (
                    <span key={s} className="chip">{s}</span>
                  ))}
                </div>
                <div className="dir-meta">
                  <span><Icon name="clock" size={15} /> {d.questions} sual · ~{Math.ceil(d.questions / 3)} dəq</span>
                  <b>Başla <Icon name="arrow" size={15} /></b>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
