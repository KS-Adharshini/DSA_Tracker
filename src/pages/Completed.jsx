import TopicCard from '../components/TopicCard.jsx';

export default function Completed({ topics, completed, notes, favorites, actions }) {
  const completedTopics = topics.filter((topic) => completed[topic.id]);

  return (
    <main className="page">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Completed Problems</p>
          <h2>All solved topics</h2>
          <p>Review everything you have marked complete and reopen resources or notes as needed.</p>
        </div>
      </section>

      <section className="topic-section-block">
        {completedTopics.length ? (
          <div className="topic-grid">
            {completedTopics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                completed={Boolean(completed[topic.id])}
                note={notes[topic.id]}
                favorite={favorites.includes(topic.id)}
                {...actions}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No completed problems yet. Mark a problem complete to see it here.</p>
          </div>
        )}
      </section>
    </main>
  );
}
