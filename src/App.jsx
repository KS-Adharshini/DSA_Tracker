import { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import { BookOpen, BarChart3, CalendarCheck, Code2, Settings as SettingsIcon } from './components/Icons.jsx';
import { defaultTopics, navCategories } from './data/topics.js';
import { useLocalStorage } from './hooks/useLocalStorage.js';
import Dashboard from './pages/Dashboard.jsx';
import DSA from './pages/DSA.jsx';
import Completed from './pages/Completed.jsx';
import Calendar from './pages/Calendar.jsx';
import CoreSubjects from './pages/CoreSubjects.jsx';
import Aptitude from './pages/Aptitude.jsx';
import InterviewPreparation from './pages/InterviewPreparation.jsx';
import MockTests from './pages/MockTests.jsx';
import Settings from './pages/Settings.jsx';
import TopicDetail from './pages/TopicDetail.jsx';
import NotesDrawer from './components/NotesDrawer.jsx';

const formatDateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const todayKey = () => formatDateKey(new Date());

const categoryToPath = {
  DSA: '/dsa',
  'Core Subjects': '/core-subjects',
  Aptitude: '/aptitude',
  'Interview Preparation': '/interview',
  'Mock Tests': '/mock-tests',
  Bookmarks: '/settings',
};

function getCompletionPercentage(completedCount, totalCount) {
  return totalCount ? Math.round((completedCount / totalCount) * 100) : 0;
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function App() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useLocalStorage('pt-sidebar-collapsed', false);
  const [theme, setTheme] = useLocalStorage('pt-theme', 'light');
  const [completed, setCompleted] = useLocalStorage('pt-completed', {});
  const [notes, setNotes] = useLocalStorage('pt-notes', {});
  const [favorites, setFavorites] = useLocalStorage('pt-favorites', []);
  const [recentlyOpened, setRecentlyOpened] = useLocalStorage('pt-recently-opened', []);
  const [activityLog, setActivityLog] = useLocalStorage('pt-activity-log', {});
  const [dailyGoal, setDailyGoal] = useLocalStorage('pt-daily-goal', 3);
  const [importedTopics, setImportedTopics] = useLocalStorage('pt-imported-topics', []);
  const [deletedTopics, setDeletedTopics] = useLocalStorage('pt-deleted-topics', {});
  const [permanentlyDeletedTopicIds, setPermanentlyDeletedTopicIds] = useLocalStorage('pt-permanently-deleted-topics', []);
  const [query, setQuery] = useState('');
  const [activeNoteTopicId, setActiveNoteTopicId] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  const allTopics = useMemo(() => [...defaultTopics, ...importedTopics], [importedTopics]);
  const allTopicById = useMemo(() => new Map(allTopics.map((topic) => [topic.id, topic])), [allTopics]);
  const topics = useMemo(
    () => allTopics.filter((topic) => !deletedTopics[topic.id] && !permanentlyDeletedTopicIds.includes(topic.id)),
    [allTopics, deletedTopics, permanentlyDeletedTopicIds],
  );

  const topicById = useMemo(() => new Map(topics.map((topic) => [topic.id, topic])), [topics]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const completedCount = topics.filter((topic) => completed[topic.id]).length;
  const dailyCompleted = activityLog[todayKey()]?.length || 0;
  const stats = {
    totalTopics: topics.length,
    completedTopics: completedCount,
    pendingTopics: topics.length - completedCount,
    completionPercentage: getCompletionPercentage(completedCount, topics.length),
    dailyGoal,
    dailyCompleted,
    streak: calculateStreak(activityLog),
  };

  const dsaFolders = [
    'Core Subjects',
    'Aptitude',
    'Interview Preparation',
    'Mock Tests',
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
    if (s.includes('reverse') || s.includes('rotate') || s.includes('rotation')) return 'Reverse';
    if (s.includes('linked list') || s.includes('list') || s.includes('cache')) return 'Linked List';
    if (s.includes('stack') || s.includes('parenthesis') || s.includes('infix') || s.includes('postfix') || s.includes('prefix') || s.includes('expression')) return 'Stack';
    if (s.includes('queue') || s.includes('deque') || s.includes('lru') || s.includes('mru')) return 'Queue';
    if (s.includes('tree') || s.includes('bst') || s.includes('heap') || s.includes('trie') || s.includes('segment')) return 'Trees';
    if (s.includes('graph') || s.includes('bfs') || s.includes('dfs') || s.includes('shortest path') || s.includes('mst') || s.includes('topological') || s.includes('cycle') || s.includes('disjoint') || s.includes('dsu') || s.includes('bipartite') || s.includes('bridge') || s.includes('articulation')) return 'Graphs';
    if (s.includes('dynamic programming') || s.includes('dp') || s.includes('coin') || s.includes('knapsack') || s.includes('lcs') || s.includes('lis') || s.includes('mcm') || s.includes('catalan') || s.includes('edit distance')) return 'Dynamic Programming';
    if (s.includes('string') || s.includes('word') || s.includes('anagram') || s.includes('pattern') || s.includes('palindrome') || s.includes('text') || s.includes('regex')) return 'Strings';
    return 'Arrays';
  };

  const categoryStats = useMemo(() => {
    const statsMap = {};
    dsaFolders.forEach(folder => {
      statsMap[folder] = { total: 0, completed: 0 };
    });

    topics.forEach(topic => {
      const folder = mapSectionToCategory(topic.section, topic.category);
      if (statsMap[folder]) {
        statsMap[folder].total += 1;
        if (completed[topic.id]) {
          statsMap[folder].completed += 1;
        }
      }
    });

    return dsaFolders.map(folder => ({
      category: folder,
      total: statsMap[folder].total,
      completed: statsMap[folder].completed,
      percentage: getCompletionPercentage(statsMap[folder].completed, statsMap[folder].total),
    }));
  }, [topics, completed]);

  const weeklyProgress = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const key = formatDateKey(date);
    const count = activityLog[key]?.length || 0;
    return {
      label: date.toLocaleDateString(undefined, { weekday: 'short' }),
      count,
      percentage: getCompletionPercentage(count, dailyGoal),
    };
  });

  const searchResults = query.trim()
    ? topics.filter((topic) => {
        const searchable = `${topic.name} ${topic.section} ${topic.category} ${topic.description}`.toLowerCase();
        return searchable.includes(query.trim().toLowerCase());
      })
    : [];

  const deletedTopicDetails = useMemo(() => Object.entries(deletedTopics)
    .filter(([topicId]) => !permanentlyDeletedTopicIds.includes(topicId))
    .map(([topicId, metadata]) => ({
      id: topicId,
      ...metadata,
      topic: allTopicById.get(topicId),
    }))
    .filter((entry) => entry.topic)
    .sort((a, b) => new Date(b.deletedAt) - new Date(a.deletedAt)),
  [deletedTopics, allTopicById, permanentlyDeletedTopicIds]);

  const recentlyOpenedTopics = recentlyOpened
    .map((id) => topicById.get(id))
    .filter(Boolean)
    .slice(0, 6);

  const toggleComplete = (topicId, isCompleted) => {
    setCompleted((current) => ({ ...current, [topicId]: isCompleted }));
    setActivityLog((current) => {
      const key = todayKey();
      const todaysItems = new Set(current[key] || []);
      if (isCompleted) {
        todaysItems.add(topicId);
      } else {
        todaysItems.delete(topicId);
      }
      return { ...current, [key]: Array.from(todaysItems) };
    });
  };

  const saveNote = (topicId, value) => {
    setNotes((current) => {
      if (!value.trim()) {
        const next = { ...current };
        delete next[topicId];
        return next;
      }
      return { ...current, [topicId]: value };
    });
  };

  const deleteNote = (topicId) => {
    setNotes((current) => {
      const next = { ...current };
      delete next[topicId];
      return next;
    });
  };

  const deleteTopic = (topicId) => {
    const topic = allTopicById.get(topicId);
    if (!topic) {
      setDeleteError('Unable to delete the selected problem. It may already have been removed.');
      return false;
    }

    if (!window.confirm(`Move "${topic.name}" to Deleted Problems?`)) {
      return false;
    }

    try {
      const deletedAt = new Date().toISOString();
      setDeletedTopics((current) => ({
        ...current,
        [topicId]: { deletedAt },
      }));
      setCompleted((current) => {
        const next = { ...current };
        delete next[topicId];
        return next;
      });
      setNotes((current) => {
        const next = { ...current };
        delete next[topicId];
        return next;
      });
      setFavorites((current) => current.filter((id) => id !== topicId));
      setRecentlyOpened((current) => current.filter((id) => id !== topicId));
      setActivityLog((current) => {
        const next = {};
        Object.entries(current).forEach(([date, ids]) => {
          const filtered = ids.filter((id) => id !== topicId);
          if (filtered.length) next[date] = filtered;
        });
        return next;
      });
      return true;
    } catch (error) {
      setDeleteError('Something went wrong while deleting the problem. Please try again.');
      return false;
    }
  };

  const restoreTopic = (topicId) => {
    const topic = allTopicById.get(topicId);
    if (!topic) {
      setDeleteError('Unable to restore the selected problem.');
      return;
    }

    setDeletedTopics((current) => {
      const next = { ...current };
      delete next[topicId];
      return next;
    });
  };

  const deleteTopicPermanently = (topicId) => {
    const topic = allTopicById.get(topicId);
    if (!topic) {
      setDeleteError('Unable to permanently delete the selected problem.');
      return;
    }

    if (!window.confirm(`Permanently delete "${topic.name}"? This cannot be restored.`)) {
      return;
    }

    try {
      setPermanentlyDeletedTopicIds((current) => (
        current.includes(topicId) ? current : [...current, topicId]
      ));
      setDeletedTopics((current) => {
        const next = { ...current };
        delete next[topicId];
        return next;
      });
      setCompleted((current) => {
        const next = { ...current };
        delete next[topicId];
        return next;
      });
      setNotes((current) => {
        const next = { ...current };
        delete next[topicId];
        return next;
      });
      setFavorites((current) => current.filter((id) => id !== topicId));
      setRecentlyOpened((current) => current.filter((id) => id !== topicId));
      setActivityLog((current) => {
        const next = {};
        Object.entries(current).forEach(([date, ids]) => {
          const filtered = ids.filter((id) => id !== topicId);
          if (filtered.length) next[date] = filtered;
        });
        return next;
      });
    } catch (error) {
      setDeleteError('Something went wrong while deleting the problem permanently. Please try again.');
    }
  };

  const toggleFavorite = (topicId) => {
    setFavorites((current) => (
      current.includes(topicId)
        ? current.filter((id) => id !== topicId)
        : [topicId, ...current]
    ));
  };

  const openResource = (topicId) => {
    setRecentlyOpened((current) => [topicId, ...current.filter((id) => id !== topicId)].slice(0, 10));
  };

  const resetProgress = () => {
    if (!window.confirm('Reset completed topics and activity progress? Notes and favorites will stay saved.')) {
      return;
    }
    setCompleted({});
    setActivityLog({});
  };

  const importBookmarks = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const html = await file.text();
    const documentFragment = new DOMParser().parseFromString(html, 'text/html');
    const links = Array.from(documentFragment.querySelectorAll('a[href]'));
    const imported = links.slice(0, 80).map((link, index) => {
      const name = link.textContent.trim() || `Imported Resource ${index + 1}`;
      return {
        id: `bookmark-${slugify(name)}-${Date.now()}-${index}`,
        category: 'Bookmarks',
        section: 'Imported Resources',
        name,
        description: 'Imported from an HTML bookmark export.',
        difficulty: 'Easy',
        url: link.href,
      };
    });

    setImportedTopics((current) => [...imported, ...current]);
    event.target.value = '';
  };

  useEffect(() => {
    if (!deleteError) return;
    const timer = window.setTimeout(() => setDeleteError(''), 4000);
    return () => window.clearTimeout(timer);
  }, [deleteError]);

  const exportProgress = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      completed,
      notes,
      favorites,
      recentlyOpened,
      activityLog,
      dailyGoal,
      importedTopics,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'placement-tracker-progress.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const actions = {
    onToggleComplete: toggleComplete,
    onSaveNote: saveNote,
    onDeleteNote: deleteNote,
    onDeleteTopic: deleteTopic,
    onToggleFavorite: toggleFavorite,
    onOpenResource: openResource,
    onEditNote: (topicId) => setActiveNoteTopicId(topicId),
  };

  const categoryPageProps = (category) => {
    const categoryTopics = topics.filter((topic) => topic.category === category);
    const categoryCompleted = categoryTopics.filter((topic) => completed[topic.id]).length;

    return {
      topics: categoryTopics,
      completed,
      notes,
      favorites,
      categoryStats: {
        total: categoryTopics.length,
        completed: categoryCompleted,
        percentage: getCompletionPercentage(categoryCompleted, categoryTopics.length),
      },
      actions,
    };
  };

  const navItems = [
    { label: 'Dashboard', path: '/', icon: BarChart3 },
    { label: 'DSA Tracker', path: '/dsa', icon: Code2 },
    { label: 'Calendar', path: '/calendar', icon: CalendarCheck },
    ...navCategories
      .filter((category) => category !== 'DSA')
      .map((category) => ({
        label: category,
        path: categoryToPath[category],
        icon: BookOpen,
      })),
    { label: 'Settings', path: '/settings', icon: SettingsIcon },
  ];

  const selectSearchResult = (topic) => {
    setQuery('');
    navigate(`/topic/${topic.id}`);
  };

  return (
    <div className="app-shell">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((current) => !current)}
        completionPercentage={stats.completionPercentage}
        navItems={navItems}
      />
      <div className="main-shell">
        <Navbar
          query={query}
          onQueryChange={setQuery}
          results={searchResults}
          onSelectSearchResult={selectSearchResult}
          theme={theme}
          onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          onResetProgress={resetProgress}
        />
        {deleteError && (
          <div className="app-banner error-banner" role="alert">
            <span>{deleteError}</span>
            <button type="button" className="icon-button danger" onClick={() => setDeleteError('')} aria-label="Dismiss error">✕</button>
          </div>
        )}
        <Routes>
          <Route
            path="/"
            element={(
              <Dashboard
                topics={topics}
                completed={completed}
                notes={notes}
                favorites={favorites}
                recentlyOpenedTopics={recentlyOpenedTopics}
                stats={stats}
                categoryStats={categoryStats}
                weeklyProgress={weeklyProgress}
                actions={actions}
              />
            )}
          />
          <Route path="/dsa" element={<DSA topics={topics} completed={completed} notes={notes} actions={actions} />} />
          <Route path="/topic/:topicId" element={<TopicDetail topicById={topicById} completed={completed} notes={notes} favorites={favorites} actions={actions} />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/completed" element={<Completed topics={topics} completed={completed} notes={notes} favorites={favorites} actions={actions} />} />
          <Route path="/core-subjects" element={<CoreSubjects {...categoryPageProps('Core Subjects')} />} />
          <Route path="/aptitude" element={<Aptitude {...categoryPageProps('Aptitude')} />} />
          <Route path="/interview" element={<InterviewPreparation {...categoryPageProps('Interview Preparation')} />} />
          <Route path="/mock-tests" element={<MockTests {...categoryPageProps('Mock Tests')} />} />
          <Route
            path="/settings"
            element={(
              <Settings
                dailyGoal={dailyGoal}
                setDailyGoal={setDailyGoal}
                deletedTopicDetails={deletedTopicDetails}
                onRestoreTopic={restoreTopic}
                onDeleteTopicPermanently={deleteTopicPermanently}
              />
            )}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <NotesDrawer
        topic={topicById.get(activeNoteTopicId)}
        initialNote={notes[activeNoteTopicId] || ''}
        onClose={() => setActiveNoteTopicId(null)}
        onSaveDraft={(value) => saveNote(activeNoteTopicId, value)}
        onSaveNote={(value) => {
          saveNote(activeNoteTopicId, value);
          setActiveNoteTopicId(null);
        }}
        onDeleteNote={() => {
          deleteNote(activeNoteTopicId);
          setActiveNoteTopicId(null);
        }}
      />
    </div>
  );
}

function calculateStreak(activityLog) {
  let streak = 0;
  const cursor = new Date();

  // If no activity today, check yesterday to continue the streak check.
  const todayStr = formatDateKey(cursor);
  if (!activityLog[todayStr]?.length) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (streak < 365) {
    const key = formatDateKey(cursor);
    if (!activityLog[key]?.length) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}
