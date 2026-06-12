export default function LoadingSpinner({ text = 'Carregando...' }) {
  return (
    <div className="spinner-container">
      <div className="spinner" role="status" aria-label={text} />
      <p className="spinner-text">{text}</p>
    </div>
  );
}
