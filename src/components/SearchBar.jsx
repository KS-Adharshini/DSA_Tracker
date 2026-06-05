import { Search } from './Icons.jsx';

export default function SearchBar({ query, onQueryChange, results, onSelect }) {
  return (
    <div className="search-box">
      <Search size={18} aria-hidden="true" />
      <input
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Search topics, problems, subjects..."
        aria-label="Search topics"
      />
      {query.trim() && (
        <div className="search-results">
          {results.length > 0 ? (
            results.slice(0, 8).map((topic) => (
              <button key={topic.id} type="button" onClick={() => onSelect(topic)}>
                <span>{topic.name}</span>
                <small>{topic.category} / {topic.section}</small>
              </button>
            ))
          ) : (
            <p>No matching topics found.</p>
          )}
        </div>
      )}
    </div>
  );
}
