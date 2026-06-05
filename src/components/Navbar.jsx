import { Moon, RotateCcw, Sun } from './Icons.jsx';
import SearchBar from './SearchBar.jsx';

export default function Navbar({
  query,
  onQueryChange,
  results,
  onSelectSearchResult,
  theme,
  onToggleTheme,
  onResetProgress,
}) {
  return (
    <header className="navbar">
      <div>
        <p className="eyebrow">Placement Preparation</p>
        <h1>Tracker Dashboard</h1>
      </div>
      <SearchBar
        query={query}
        onQueryChange={onQueryChange}
        results={results}
        onSelect={onSelectSearchResult}
      />
      <div className="nav-actions">
        <button className="icon-button" type="button" onClick={onToggleTheme} title="Toggle theme" aria-label="Toggle theme">
          {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
        </button>
        <button className="icon-button danger" type="button" onClick={onResetProgress} title="Reset progress" aria-label="Reset progress">
          <RotateCcw size={19} />
        </button>
      </div>
    </header>
  );
}
