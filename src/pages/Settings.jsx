import { useMemo, useState } from 'react';

export default function Settings({
  dailyGoal,
  setDailyGoal,
  deletedTopicDetails,
  onRestoreTopic,
  onDeleteTopicPermanently,
}) {
  const [searchValue, setSearchValue] = useState('');

  const normalizedSearch = searchValue.trim().toLowerCase();

  const filteredDeletedTopics = useMemo(() => deletedTopicDetails.filter(({ topic }) => {
    if (!normalizedSearch) return true;
    const searchable = `${topic.name} ${topic.category} ${topic.section} ${topic.difficulty}`.toLowerCase();
    return searchable.includes(normalizedSearch);
  }), [deletedTopicDetails, normalizedSearch]);

  return (
    <main className="page settings-page">
      <section className="page-hero settings-hero">
        <div>
          <p className="eyebrow">Settings</p>
          <h2>Daily Study Goal</h2>
          <p>Keep your preparation focused by setting a single daily topic goal.</p>
        </div>
      </section>

      <section className="settings-content">
        <article className="panel settings-goal-panel">
          <h3>Daily Study Goal</h3>
          <p>How many topics would you like to study per day?</p>
          <label className="field">
            Topics per day
            <input
              type="number"
              min="1"
              max="20"
              value={dailyGoal}
              onChange={(event) => setDailyGoal(Number(event.target.value) || 1)}
            />
          </label>
        </article>

        <article className="panel deleted-problems-panel">
          <div className="deleted-header">
            <div>
              <p className="eyebrow">Removed Problems</p>
              <h3>Recover or remove removed problems</h3>
              <p>Restore recently removed problems or permanently remove them from your tracker.</p>
            </div>
            <input
              className="search-input"
              type="search"
              placeholder="Search removed problems..."
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              aria-label="Search removed problems"
            />
          </div>

          {filteredDeletedTopics.length ? (
            <div className="deleted-list">
              <div className="deleted-row deleted-row-heading">
                <span>Title</span>
                <span>Topic / Category</span>
                <span>Difficulty</span>
                <span>Actions</span>
              </div>
              {filteredDeletedTopics.map(({ id, topic }) => (
                <div className="deleted-row" key={id}>
                  <span>{topic.name}</span>
                  <span>{topic.category} / {topic.section}</span>
                  <span>
                    <span className={`difficulty ${topic.difficulty.toLowerCase()}`}>
                      {topic.difficulty}
                    </span>
                  </span>
                  <span className="deleted-row-actions">
                    <button
                      className="icon-button restore-icon"
                      type="button"
                      onClick={() => onRestoreTopic(id)}
                      title="Restore problem"
                      aria-label="Restore problem"
                    >
                      ↩
                    </button>
                    <button
                      className="action-btn delete-icon-btn"
                      type="button"
                      onClick={() => onDeleteTopicPermanently(id)}
                      title="Remove permanently"
                    >
                      ✕
                    </button>
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No removed problems found.</p>
            </div>
          )}
        </article>
      </section>
    </main>
  );
}
