import { useEffect, useState } from 'react';
import { FileText } from '../components/Icons.jsx';

function NoteCard({ topic, initialNote, onSaveNote, onDeleteNote }) {
  const [draft, setDraft] = useState(initialNote || '');

  // Keep draft in sync if initialNote changes externally
  useEffect(() => {
    setDraft(initialNote || '');
  }, [initialNote]);

  const handleChange = (event) => {
    setDraft(event.target.value);
  };

  const handleBlur = () => {
    onSaveNote(topic.id, draft);
  };

  return (
    <article className="panel note-panel">
      <div>
        <p className="topic-section">{topic.category} / {topic.section}</p>
        <h3>{topic.name}</h3>
      </div>
      <textarea
        value={draft}
        rows="5"
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Type revision notes here... (saves automatically when clicking away)"
      />
      <button className="ghost-button danger-text" type="button" onClick={() => onDeleteNote(topic.id)}>
        Delete Note
      </button>
    </article>
  );
}

export default function Notes({ topics, notes, onSaveNote, onDeleteNote }) {
  const topicsWithNotes = topics.filter((topic) => notes[topic.id]);

  return (
    <main className="page">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Revision Notebook</p>
          <h2>Notes</h2>
          <p>Review, update, or remove notes saved from topic cards.</p>
        </div>
        <FileText size={44} />
      </section>

      <section className="notes-list">
        {topicsWithNotes.length ? topicsWithNotes.map((topic) => (
          <NoteCard
            key={topic.id}
            topic={topic}
            initialNote={notes[topic.id]}
            onSaveNote={onSaveNote}
            onDeleteNote={onDeleteNote}
          />
        )) : (
          <div className="empty-large">
            <h3>No notes yet</h3>
            <p>Add notes from any topic card to build a quick revision notebook.</p>
          </div>
        )}
      </section>
    </main>
  );
}

