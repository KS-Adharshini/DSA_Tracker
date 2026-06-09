import { useNavigate } from 'react-router-dom';
import { CalendarCheck, Flame, ListChecks, Target, TrendingUp } from '../components/Icons.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import TopicCard from '../components/TopicCard.jsx';

export default function Dashboard({
  topics,
  completed,
  notes,
  favorites,
  recentlyOpenedTopics,
  stats,
  categoryStats,
  weeklyProgress,
  actions,
}) {
  const navigate = useNavigate();
  const favoriteTopics = topics.filter((topic) => favorites.includes(topic.id)).slice(0, 4);

  return (
    <main className="page">
      <section className="dashboard-hero">
        <div>
          <p className="eyebrow">DSA Preparation</p>
          <h2>Plan, practice, revise, repeat.</h2>
          <p>Track your progress across folders, mark completed problems, and take rich notes for every single problem.</p>
        </div>
        <div className="overall-panel">
          <ProgressBar value={stats.completionPercentage} label="Overall completion" />
          <div className="overall-numbers">
            <span>{stats.completedTopics} solved</span>
            <span>{stats.pendingTopics} pending</span>
          </div>
        </div>
      </section>

      <section className="stat-grid">
        <article className="stat-card">
          <ListChecks size={22} />
          <span>Total Problems</span>
          <strong>{stats.totalTopics}</strong>
        </article>
        <article className="stat-card" role="button" tabIndex={0} onClick={() => navigate('/completed')} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') navigate('/completed'); }} style={{ cursor: 'pointer' }}>
          <CalendarCheck size={22} />
          <span>Completed Problems</span>
          <strong>{stats.completedTopics}</strong>
        </article>
        <article className="stat-card">
          <Target size={22} />
          <span>Daily Goal</span>
          <strong>{stats.dailyCompleted}/{stats.dailyGoal}</strong>
        </article>
        <article className="stat-card">
          <Flame size={22} />
          <span>Study Streak</span>
          <strong>{stats.streak} day{stats.streak === 1 ? '' : 's'}</strong>
        </article>
      </section>

      <section className="analytics-grid">
        <article className="panel">
          <div className="section-title-row">
            <h3>Folder Progress</h3>
            <span>{stats.completionPercentage}% overall</span>
          </div>
          <div className="progress-list">
            {categoryStats.map((item) => (
              <ProgressBar key={item.category} value={item.percentage} label={`${item.category}: ${item.completed}/${item.total}`} />
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="section-title-row">
            <h3>Weekly Progress</h3>
            <TrendingUp size={20} />
          </div>
          <div className="week-chart">
            {weeklyProgress.map((day) => (
              <div className="week-day" key={day.label}>
                <span style={{ height: `${Math.max(10, day.percentage)}%` }} />
                <small>{day.label}</small>
                <strong>{day.count}</strong>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="split-grid">
        <article className="panel">
          <div className="section-title-row">
            <h3>Recently Opened</h3>
            <span>{recentlyOpenedTopics.length} items</span>
          </div>
          <div className="mini-list">
            {recentlyOpenedTopics.length ? recentlyOpenedTopics.map((topic) => (
              <a key={topic.id} href={topic.url} target="_blank" rel="noreferrer" onClick={() => actions.onOpenResource(topic.id)}>
                <span>{topic.name}</span>
                <small>{topic.category}</small>
              </a>
            )) : <p className="empty-state">Open a resource to see it here.</p>}
          </div>
        </article>

        <article className="panel">
          <div className="section-title-row">
            <h3>Favorites</h3>
            <span>{favorites.length} saved</span>
          </div>
          <div className="mini-list">
            {favoriteTopics.length ? favoriteTopics.map((topic) => (
              <a key={topic.id} href={topic.url} target="_blank" rel="noreferrer" onClick={() => actions.onOpenResource(topic.id)}>
                <span>{topic.name}</span>
                <small>{topic.section}</small>
              </a>
            )) : <p className="empty-state">Star important topics for quick revision.</p>}
          </div>
        </article>
      </section>

      <section className="topic-section-block">
        <div className="section-title-row">
          <h3>Priority Problems</h3>
          <span>First six pending problems</span>
        </div>
        <div className="topic-grid">
          {topics.filter((topic) => !completed[topic.id]).slice(0, 6).map((topic) => (
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
    </main>
  );
}
