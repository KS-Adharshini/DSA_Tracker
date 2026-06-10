import React, { useState, useEffect, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { ExternalLink, FilePenLine, Search } from '../components/Icons.jsx';

const FOLDER_NAMES = [
  'Leetcode',
  'Reverse',
  'Arrays',
  'Strings',
  'Linked List',
  'Stack',
  'Queue',
  'Trees',
  'Graphs',
  'Dynamic Programming'
];

const mapSectionToCategory = (section, category = 'DSA') => {
  if (category !== 'DSA') return category;

  const s = section.toLowerCase();
  if (['arrays', 'recursion', 'backtracking', 'hashing', 'greedy', 'database'].includes(s)) return 'Leetcode';
  if (s.includes('reverse') || s.includes('rotate') || s.includes('rotation')) return 'Reverse';
  if (s.includes('linked list') || s.includes('list') || s.includes('cache')) return 'Linked List';
  if (s.includes('stack') || s.includes('parenthesis') || s.includes('infix') || s.includes('postfix') || s.includes('prefix') || s.includes('expression')) return 'Stack';
  if (s.includes('queue') || s.includes('deque') || s.includes('lru') || s.includes('mru')) return 'Queue';
  if (s.includes('tree') || s.includes('bst') || s.includes('heap') || s.includes('trie') || s.includes('segment')) return 'Trees';
  if (s.includes('graph') || s.includes('bfs') || s.includes('dfs') || s.includes('shortest path') || s.includes('mst') || s.includes('topological') || s.includes('cycle') || s.includes('disjoint') || s.includes('dsu') || s.includes('bipartite') || s.includes('bridge') || s.includes('articulation')) return 'Graphs';
  if (s.includes('dynamic programming') || s.includes('dp') || s.includes('coin') || s.includes('knapsack') || s.includes('lcs') || s.includes('lis') || s.includes('mcm') || s.includes('catalan') || s.includes('edit distance')) return 'Dynamic Programming';
  if (s.includes('string') || s.includes('word') || s.includes('anagram') || s.includes('pattern') || s.includes('palindrome') || s.includes('text') || s.includes('regex')) return 'Strings';
  return 'Arrays'; // default fallback for any other DSA problem
};

export default function DSA({
  topics,
  completed,
  notes,
  actions,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFolders, setExpandedFolders] = useLocalStorage('pt-dsa-expanded-folders', ['Reverse']);

  // Preserve scroll position
  useEffect(() => {
    const handleScroll = () => {
      localStorage.setItem('pt-dsa-scroll-y', window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const savedScrollY = localStorage.getItem('pt-dsa-scroll-y');
    if (savedScrollY) {
      const timer = setTimeout(() => {
        window.scrollTo(0, parseInt(savedScrollY, 10));
      }, 150);
      return () => clearTimeout(timer);
    }
  }, []);

  const toggleFolder = (folderName) => {
    setExpandedFolders((current) => {
      const next = Array.isArray(current) ? current : [];
      if (next.includes(folderName)) {
        return next.filter(f => f !== folderName);
      } else {
        return [...next, folderName];
      }
    });
  };

  // Use only DSA-specific topics in this view.
  const sheetTopics = useMemo(() => {
    return topics.filter((topic) => topic.category === 'DSA');
  }, [topics]);

  // 2. Classify and group topics into the old themed folders.
  const groupedDSA = useMemo(() => {
    const groups = {};
    FOLDER_NAMES.forEach(f => {
      groups[f] = [];
    });

    sheetTopics.forEach(topic => {
      const category = mapSectionToCategory(topic.section, topic.category);
      if (groups[category]) {
        groups[category].push(topic);
      }
    });

    return groups;
  }, [sheetTopics]);

  // 3. Filter by search query within each group
  const searchFilteredGroupedDSA = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return groupedDSA;

    const filtered = {};
    FOLDER_NAMES.forEach(f => {
      filtered[f] = groupedDSA[f].filter(topic => 
        topic.name.toLowerCase().includes(query) ||
        topic.section.toLowerCase().includes(query) ||
        (topic.url && topic.url.toLowerCase().includes(query))
      );
    });
    return filtered;
  }, [groupedDSA, searchQuery]);

  // Calculate folder statistics
  const folderStats = useMemo(() => {
    const stats = {};
    FOLDER_NAMES.forEach(f => {
      const total = groupedDSA[f].length;
      const done = groupedDSA[f].filter(t => completed[t.id]).length;
      const pct = total ? Math.round((done / total) * 100) : 0;
      stats[f] = { total, completed: done, percentage: pct };
    });
    return stats;
  }, [groupedDSA, completed]);

  return (
    <main className="page dsa-tracker-page">
      <section className="page-hero dsa-hero">
        <div>
          <p className="eyebrow">Practice Tracker</p>
          <h2>Complete Placement Sheet</h2>
          <p>All imported DSA_sheet.html resources are available here with hyperlinks, progress tracking, and rich notes.</p>
        </div>
        <div className="search-bar-wrap">
          <div className="search-box">
            <Search size={18} aria-hidden="true" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search problems, topics, or numbers..."
              aria-label="Search problems"
            />
          </div>
        </div>
      </section>

      <section className="folders-container">
        {FOLDER_NAMES.map(folder => {
          const stats = folderStats[folder];
          const problems = searchFilteredGroupedDSA[folder];
          const isExpanded = expandedFolders.includes(folder);
          
          // If searching and this folder has no matches, we can hide it or show empty
          if (searchQuery.trim() && problems.length === 0) return null;

          return (
            <div className={`folder-wrapper ${isExpanded ? 'is-expanded' : ''}`} key={folder}>
              <div 
                className="folder-header" 
                onClick={() => toggleFolder(folder)}
                role="button"
                aria-expanded={isExpanded}
              >
                <div className="folder-title">
                  <span className="folder-icon">📂</span>
                  <h3>{folder}</h3>
                  <span className="folder-count">{stats.completed} / {stats.total} solved</span>
                </div>
                <div className="folder-meta-right">
                  <div className="folder-progress">
                    <span className="pct-text">{stats.percentage}%</span>
                    <div className="mini-track">
                      <span className="mini-fill" style={{ width: `${stats.percentage}%` }} />
                    </div>
                  </div>
                  <span className={`chevron ${isExpanded ? 'up' : 'down'}`}>▼</span>
                </div>
              </div>

              {isExpanded && (
                <div className="folder-body">
                  {problems.length === 0 ? (
                    <p className="empty-folder">No matching problems in this folder.</p>
                  ) : (
                    <div className="problem-table-container">
                      <table className="problem-table">
                        <thead>
                          <tr>
                            <th width="48">Status</th>
                            <th>Problem Title</th>
                            <th width="220">Sub-Topic</th>
                            <th width="120">Difficulty</th>
                            <th width="200" style={{ textAlign: 'right' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {problems.map((problem) => {
                            const hasNote = notes[problem.id];
                            const isDone = completed[problem.id];

                            return (
                              <tr key={problem.id} className={`problem-row ${isDone ? 'done' : ''}`}>
                                <td>
                                  <label className="checkbox-cell">
                                    <input
                                      type="checkbox"
                                      checked={Boolean(isDone)}
                                      onChange={(e) => actions.onToggleComplete(problem.id, e.target.checked)}
                                    />
                                  </label>
                                </td>
                                <td className="problem-name-cell">
                                  <strong>{problem.name}</strong>
                                </td>
                                <td>
                                  <span className="sub-topic-tag">{problem.section}</span>
                                </td>
                                <td>
                                  <span className={`difficulty ${problem.difficulty.toLowerCase()}`}>
                                    {problem.difficulty}
                                  </span>
                                </td>
                                <td>
                                  <div className="row-actions">
                                    <a 
                                      href={problem.url} 
                                      target="_blank" 
                                      rel="noreferrer" 
                                      className="action-btn link-btn"
                                      title="Open LeetCode/GFG"
                                      onClick={() => actions.onOpenResource(problem.id)}
                                    >
                                      Solve <ExternalLink size={14} />
                                    </a>
                                    <button 
                                      className={`action-btn note-btn ${hasNote ? 'has-note' : ''}`}
                                      onClick={() => actions.onEditNote(problem.id)}
                                      title={hasNote ? 'Edit Notes (Saved)' : 'Add Notes'}
                                    >
                                      <FilePenLine size={14} /> {hasNote ? 'Revise' : 'Notes'}
                                    </button>
                                    <button 
                                      className="action-btn delete-icon-btn"
                                      onClick={() => actions.onDeleteTopic(problem.id)}
                                      title="Delete Problem"
                                      aria-label={`Delete ${problem.name}`}
                                    >
                                      ✕
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </section>
    </main>
  );
}
