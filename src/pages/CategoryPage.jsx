import TopicCard from '../components/TopicCard.jsx';
import ProgressBar from '../components/ProgressBar.jsx';

export default function CategoryPage({
  title,
  subtitle,
  topics,
  completed,
  notes,
  favorites,
  categoryStats,
  actions,
}) {
  const groupedTopics = topics.reduce((groups, topic) => {
    groups[topic.section] = groups[topic.section] || [];
    groups[topic.section].push(topic);
    return groups;
  }, {});

  return (
    <main className="page">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Preparation Track</p>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        <div className="hero-progress">
          <ProgressBar value={categoryStats.percentage} label={`${categoryStats.completed}/${categoryStats.total} completed`} />
        </div>
      </section>

      {Object.entries(groupedTopics).map(([section, sectionTopics]) => (
        <section className="topic-section-block" key={section}>
          <div className="section-title-row">
            <h3>{section}</h3>
            <span>{sectionTopics.length} topic{sectionTopics.length > 1 ? 's' : ''}</span>
          </div>
          <div className="topic-grid">
            {sectionTopics.map((topic) => (
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
        </section>
      ))}
    </main>
  );
}
