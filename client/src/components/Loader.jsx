export default function Loader({ text = 'Yüklənir...' }) {
  return (
    <div className="loader">
      <div className="spinner" />
      <p>{text}</p>
    </div>
  );
}
