export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-message" role="alert">
      <span className="error-icon">⚠️</span>
      <p className="error-text">{message}</p>
      {onRetry && (
        <button className="btn btn--sm btn--secondary" onClick={onRetry}>
          Tentar novamente
        </button>
      )}
    </div>
  );
}
