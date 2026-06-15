import { useNavigate } from '../router/reactRouterDomCompat.jsx';
import { ExternalLink, FilePenLine, Star } from '../components/Icons.jsx';
import NotesDisplay from '../components/NotesDisplay.jsx';

const categoryToPath = {
  DSA: '/dsa',
  'Core Subjects': '/core-subjects',
  Aptitude: '/aptitude',
  'Interview Preparation': '/interview',
  'Mock Tests': '/mock-tests',
  Bookmarks: '/settings',
};

export default function TopicDetail({ topicById, completed, notes, favorites, actions, params }) {
  const navigate = useNavigate();
  const topicId = params?.topicId;
  const topic = topicById.get(topicId);

  const categoryPath = topic ? categoryToPath[topic.category] || '/' : '/';

  if (!topic) {
    return (
      <main className="page">
        <section className="page-hero">
          <div>
            <p className="eyebrow">Problem not found</p>
            <h2>Unable to locate the selected problem</h2>
            <p>The selected problem does not exist or the link is invalid. Try selecting another problem from search or go back to the dashboard.</p>
            <button className="primary-button" type="button" onClick={() => navigate('/')}>Return to dashboard</button>
          </div>
        </section>
      </main>
    );
  }

  const isDone = Boolean(completed[topic.id]);
  const isFavorite = favorites.includes(topic.id);

  return (
    <main className="page topic-detail-page">
      <section className="page-hero">
        <div>
          <p className="eyebrow">{topic.category}</p>
          <h2>{topic.name}</h2>
          <p>{topic.description}</p>
          <div className="topic-detail-meta">
            <span className={`difficulty ${topic.difficulty.toLowerCase()}`}>{topic.difficulty}</span>
            <span>{topic.section}</span>
          </div>
        </div>
        <div className="hero-actions">
          <button className="ghost-button" type="button" onClick={() => navigate(categoryPath)}>
            Back to {topic.category}
          </button>
        </div>
      </section>

      <section className="topic-detail-actions">
        <button
          className={`icon-button star ${isFavorite ? 'active' : ''}`}
          type="button"
          onClick={() => actions.onToggleFavorite(topic.id)}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Star size={18} />
        </button>

        <label className="check-control">
          <input
            type="checkbox"
            checked={isDone}
            onChange={(event) => actions.onToggleComplete(topic.id, event.target.checked)}
          />
          <span>{isDone ? 'Completed' : 'Mark as completed'}</span>
        </label>

        <button className="ghost-button" type="button" onClick={() => actions.onEditNote(topic.id)}>
          <FilePenLine size={16} />
          {notes[topic.id] ? 'Edit Notes' : 'Add Notes'}
        </button>

        <button
          className="icon-button delete-icon"
          type="button"
          onClick={() => {
            if (actions.onDeleteTopic(topic.id)) {
              navigate(categoryPath);
            }
          }}
          title="Remove problem"
          aria-label="Remove problem"
        >
          ✕
        </button>
      </section>

      <section className="topic-detail-info">
        <div className="topic-detail-card">
          <h3>Problem details</h3>
          <dl>
            <dt>Category</dt>
            <dd>{topic.category}</dd>
            <dt>Section</dt>
            <dd>{topic.section}</dd>
            <dt>Difficulty</dt>
            <dd>{topic.difficulty}</dd>
            <dt>Problem URL</dt>
            <dd>
              <a href={topic.url} target="_blank" rel="noreferrer">
                {topic.url}
              </a>
            </dd>
          </dl>
        </div>

        {notes[topic.id] && (
          <div className="topic-detail-card">
            <h3>Saved notes</h3>
            <NotesDisplay content={notes[topic.id]} />
          </div>
        )}
      </section>
    </main>
  );
}
