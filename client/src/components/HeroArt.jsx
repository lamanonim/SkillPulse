import heroPhoto from '../assets/hero-students.webp';

export default function HeroArt() {
  return (
    <div className="art">
      <div className="photo">
        <img src={heroPhoto} alt="Laptop arxasında birlikdə işləyən iki tələbə" width="760" height="1140" />
      </div>

      <div className="float toast" aria-hidden="true">
        <span className="ok">✓</span>
        <div>
          <strong>Tapşırıq tamamlandı</strong>
          <small>Flexbox Froggy · CSS</small>
        </div>
      </div>

      <div className="float chart" aria-hidden="true">
        <h4 style={{ margin: 0 }}>İrəliləyiş</h4>
        <span className="up">+24%</span>
        <div className="bars">
          {[35, 50, 42, 65, 58, 80, 95].map((h, i) => (
            <span key={i} style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>

      <div className="float map" aria-hidden="true">
        <h4>Bacarıq xəritən</h4>
        <div className="map-row">
          <div className="donut" style={{ '--p': 78 }}>
            <span>78%</span>
          </div>
          <div className="legend">
            <div><i style={{ background: '#5b4cf0' }} />Frontend<em>90%</em></div>
            <div><i style={{ background: '#f59e0b' }} />Backend<em>65%</em></div>
            <div><i style={{ background: '#22b8f0' }} />Data<em>50%</em></div>
          </div>
        </div>
      </div>
    </div>
  );
}
