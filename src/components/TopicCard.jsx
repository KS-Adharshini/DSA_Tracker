import { ExternalLink, FilePenLine, Star } from './Icons.jsx';

export default function TopicCard({
  topic,
  completed,
  note,
  favorite,
  onToggleComplete,
  onToggleFavorite,
  onOpenResource,
  onEditNote,
  onDeleteTopic,
}) {
  return (
    <article className={`topic-card ${completed ? 'is-complete' : ''}`}>
      <div className="topic-card-head">
        <div>
          <p className="topic-section">{topic.section}</p>
          <h3>{topic.name}</h3>
        </div>
        <button
          className={`icon-button star ${favorite ? 'active' : ''}`}
          type="button"
          onClick={() => onToggleFavorite(topic.id)}
          title={favorite ? 'Remove from favorites' : 'Add to favorites'}
          aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Star size={18} />
        </button>
      </div>

      <p className="topic-description">{topic.description}</p>

      <div className="topic-meta">
        <span className={`difficulty ${topic.difficulty.toLowerCase()}`}>{topic.difficulty}</span>
        <label className="check-control">
          <input
            type="checkbox"
            checked={completed}
            onChange={(event) => onToggleComplete(topic.id, event.target.checked)}
          />
          <span>{completed ? 'Completed' : 'Pending'}</span>
        </label>
      </div>

      {note && <p className="note-preview">{note}</p>}

      <div className="topic-actions">
        <button className="action-btn delete-btn" type="button" onClick={() => onDeleteTopic(topic.id)} aria-label={`Remove ${topic.name}`}>
          ✕
        </button>
        <a href={topic.url} target="_blank" rel="noreferrer" onClick={() => onOpenResource(topic.id)}>
          Open Resource
          <ExternalLink size={16} />
        </a>
        <button className="ghost-button" type="button" onClick={() => onEditNote(topic.id)}>
          <FilePenLine size={16} />
          {note ? 'Edit Notes' : 'Add Notes'}
        </button>
      </div>
    </article>
  );
}

