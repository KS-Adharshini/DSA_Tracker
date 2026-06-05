export default function ProgressBar({ value = 0, label, compact = false }) {
  const safeValue = Math.max(0, Math.min(100, Math.round(value)));

  return (
    <div className={`progress-wrap ${compact ? 'compact' : ''}`}>
      {label && (
        <div className="progress-label">
          <span>{label}</span>
          <strong>{safeValue}%</strong>
        </div>
      )}
      <div className="progress-track" aria-label={label || 'Progress'}>
        <span className="progress-fill" style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  );
}
