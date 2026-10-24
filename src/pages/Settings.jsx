import { Download, Upload } from '../components/Icons.jsx';

export default function Settings({
  dailyGoal,
  setDailyGoal,
  theme,
  setTheme,
  importedTopics,
  onImportBookmarks,
  onExportProgress,
  onResetProgress,
}) {
  return (
    <main className="page">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Preferences</p>
          <h2>Settings</h2>
          <p>Personalize your tracker, import resources, and export your preparation data.</p>
        </div>
      </section>

      <section className="settings-grid">
        <article className="panel settings-panel">
          <h3>Daily Study Goal</h3>
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

        <article className="panel settings-panel">
          <h3>Theme</h3>
          <div className="segmented">
            <button className={theme === 'light' ? 'active' : ''} type="button" onClick={() => setTheme('light')}>Light</button>
            <button className={theme === 'dark' ? 'active' : ''} type="button" onClick={() => setTheme('dark')}>Dark</button>
          </div>
        </article>

        <article className="panel settings-panel">
          <h3>Bookmarks</h3>
          <label className="file-import">
            <Upload size={18} />
            Import HTML Bookmarks
            <input type="file" accept=".html,.htm" onChange={onImportBookmarks} />
          </label>
          <p>{importedTopics.length} imported resource{importedTopics.length === 1 ? '' : 's'} saved.</p>
        </article>

        <article className="panel settings-panel">
          <h3>Data</h3>
          <div className="button-stack">
            <button className="primary-button" type="button" onClick={onExportProgress}>
              <Download size={18} />
              Export Progress JSON
            </button>
            <button className="ghost-button danger-text" type="button" onClick={onResetProgress}>
              Reset Progress
            </button>
          </div>
        </article>
      </section>
    </main>
  );
}
