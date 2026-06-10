import { useMemo, useState } from 'react';
import { CalendarCheck, ListChecks, Target, TrendingUp } from '../components/Icons.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import { useLocalStorage } from '../hooks/useLocalStorage.js';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const formatDateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

export default function Calendar() {
  const today = useMemo(() => new Date(), []);
  const [selectedDate, setSelectedDate] = useState(today);
  const [visibleMonth, setVisibleMonth] = useState(startOfMonth(today));
  const [taskText, setTaskText] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const [taskDraft, setTaskDraft] = useState('');
  const [activitiesByDate, setActivitiesByDate] = useLocalStorage('pt-calendar-activities', {});

  const selectedKey = formatDateKey(selectedDate);
  const selectedActivities = activitiesByDate[selectedKey] || [];

  const statistics = useMemo(() => {
    const total = selectedActivities.length;
    const completed = selectedActivities.filter((task) => task.completed).length;
    return {
      total,
      completed,
      pending: total - completed,
      percentage: total ? Math.round((completed / total) * 100) : 0,
    };
  }, [selectedActivities]);

  const monthCalendar = useMemo(() => {
    const days = [];
    const firstDay = startOfMonth(visibleMonth);
    const firstWeekday = firstDay.getDay();
    const totalDays = daysInMonth(visibleMonth);
    const prevMonthEnd = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 0).getDate();

    for (let i = 0; i < firstWeekday; i += 1) {
      const date = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, prevMonthEnd - firstWeekday + i + 1);
      days.push({ date, otherMonth: true });
    }

    for (let day = 1; day <= totalDays; day += 1) {
      days.push({ date: new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day), otherMonth: false });
    }

    while (days.length % 7 !== 0) {
      const nextDay = days.length - firstWeekday + 1;
      const date = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, nextDay);
      days.push({ date, otherMonth: true });
    }

    return days;
  }, [visibleMonth]);

  const dateHasTasks = (date) => {
    return Boolean(activitiesByDate[formatDateKey(date)]?.length);
  };

  const handleAddTask = () => {
    const trimmed = taskText.trim();
    if (!trimmed) return;

    const nextTask = {
      id: `${selectedKey}-${Date.now()}`,
      text: trimmed,
      completed: false,
    };

    setActivitiesByDate((current) => ({
      ...current,
      [selectedKey]: [...(current[selectedKey] || []), nextTask],
    }));
    setTaskText('');
  };

  const handleSaveEdit = () => {
    if (!taskDraft.trim()) return;
    setActivitiesByDate((current) => ({
      ...current,
      [selectedKey]: current[selectedKey].map((task) => (
        task.id === editTaskId ? { ...task, text: taskDraft } : task
      )),
    }));
    setEditTaskId(null);
    setTaskDraft('');
  };

  const updateTask = (taskId, updates) => {
    setActivitiesByDate((current) => ({
      ...current,
      [selectedKey]: current[selectedKey].map((task) => (
        task.id === taskId ? { ...task, ...updates } : task
      )),
    }));
  };

  const deleteTask = (taskId) => {
    setActivitiesByDate((current) => {
      const next = current[selectedKey]?.filter((task) => task.id !== taskId) || [];
      const updated = { ...current, [selectedKey]: next };
      if (!next.length) {
        delete updated[selectedKey];
      }
      return updated;
    });
  };

  const handleMonthChange = (direction) => {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + direction, 1));
  };

  const selectedDateLabel = selectedDate.toLocaleDateString(undefined, {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  return (
    <main className="page">
      <section className="page-hero calendar-hero">
        <div>
          <p className="eyebrow">Calendar</p>
          <h2>Track your daily practice and tasks.</h2>
          <p>Choose a date, review your activities, and manage daily tasks with a visual monthly calendar.</p>
        </div>
        <div className="calendar-hero-stats">
          <div className="panel stats-card">
            <div className="section-title-row">
              <h3>Tasks for {selectedDateLabel}</h3>
            </div>
            <div className="stats-grid">
              <article>
                <strong>{statistics.total}</strong>
                <span>Total tasks</span>
              </article>
              <article>
                <strong>{statistics.completed}</strong>
                <span>Completed</span>
              </article>
              <article>
                <strong>{statistics.pending}</strong>
                <span>Pending</span>
              </article>
            </div>
            <ProgressBar value={statistics.percentage} label="Daily completion" />
          </div>
        </div>
      </section>

      <section className="calendar-layout">
        <div className="calendar-panel">
          <div className="calendar-header">
            <button type="button" className="ghost-button" onClick={() => handleMonthChange(-1)}>
              ‹ Prev
            </button>
            <div className="calendar-title">
              <span>{MONTH_NAMES[visibleMonth.getMonth()]}</span>
              <strong>{visibleMonth.getFullYear()}</strong>
            </div>
            <button type="button" className="ghost-button" onClick={() => handleMonthChange(1)}>
              Next ›
            </button>
          </div>

          <div className="calendar-grid calendar-week-header">
            {DAY_NAMES.map((name) => (
              <div key={name} className="weekday-cell">{name}</div>
            ))}
          </div>

          <div className="calendar-grid">
            {monthCalendar.map(({ date, otherMonth }) => {
              const key = formatDateKey(date);
              const isSelected = key === selectedKey;
              const hasTasks = dateHasTasks(date);

              return (
                <button
                  key={key}
                  type="button"
                  className={`calendar-day ${otherMonth ? 'other-month' : ''} ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedDate(date)}
                >
                  <div className="day-number">{date.getDate()}</div>
                  {hasTasks && <span className="day-indicator" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="activity-panel">
          <div className="section-title-row">
            <h3>Daily Activities</h3>
            <span>{selectedActivities.length} items</span>
          </div>

          <div className="task-form">
            <input
              type="text"
              value={editTaskId ? taskDraft : taskText}
              placeholder={editTaskId ? 'Update activity text' : 'Add a new activity for this date'}
              onChange={(event) => {
                if (editTaskId) setTaskDraft(event.target.value);
                else setTaskText(event.target.value);
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  editTaskId ? handleSaveEdit() : handleAddTask();
                }
              }}
            />
            <button
              type="button"
              className="primary-button"
              onClick={editTaskId ? handleSaveEdit : handleAddTask}
            >
              {editTaskId ? 'Save' : 'Add activity'}
            </button>
            {editTaskId && (
              <button
                type="button"
                className="ghost-button"
                onClick={() => {
                  setEditTaskId(null);
                  setTaskDraft('');
                }}
              >
                Cancel
              </button>
            )}
          </div>

          {selectedActivities.length ? (
            <div className="task-list">
              {selectedActivities.map((task) => (
                <div key={task.id} className="task-item">
                  <label className="check-control">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={(event) => updateTask(task.id, { completed: event.target.checked })}
                    />
                    <span className={task.completed ? 'completed-task' : ''}>{task.text}</span>
                  </label>
                  <div className="task-actions">
                    <button
                      type="button"
                      className="ghost-button"
                      onClick={() => {
                        setEditTaskId(task.id);
                        setTaskDraft(task.text);
                      }}
                    >
                      Edit
                    </button>
                    <button type="button" className="ghost-button danger-text" onClick={() => deleteTask(task.id)} aria-label="Remove task">
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No activities for this date yet. Add a new task to get started.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
