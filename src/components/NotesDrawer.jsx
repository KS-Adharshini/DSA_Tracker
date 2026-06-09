import React, { useState, useEffect } from 'react';
import { FilePenLine, Trash2, X } from './Icons.jsx';
import RichTextEditor from './RichTextEditor.jsx';

export default function NotesDrawer({
  topic,
  initialNote,
  onClose,
  onSaveNote,
  onSaveDraft,
  onDeleteNote,
}) {
  const [draft, setDraft] = useState(initialNote || '');

  useEffect(() => {
    setDraft(initialNote || '');
  }, [initialNote]);

  // Debounced auto-save notes to prevent data loss on refresh
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (topic && draft !== initialNote) {
        const saveFn = onSaveDraft || onSaveNote;
        saveFn(draft);
      }
    }, 800); // Save after 800ms of inactivity

    return () => clearTimeout(delayDebounce);
  }, [draft, initialNote, topic, onSaveDraft, onSaveNote]);

  if (!topic) return null;

  const handleSave = () => {
    onSaveNote(draft);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm('Delete note for this topic?')) {
      onDeleteNote();
    }
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div>
            <span className="eyebrow">{topic.category} / {topic.section}</span>
            <h2>{topic.name}</h2>
          </div>
          <button className="icon-button close-btn" onClick={onClose} aria-label="Close panel">
            <X size={20} />
          </button>
        </div>

        <div className="drawer-body">
          <div className="drawer-meta-section">
            <p className="drawer-desc">{topic.description}</p>
            <div className="drawer-tags">
              <span className={`difficulty ${topic.difficulty.toLowerCase()}`}>{topic.difficulty}</span>
              <a href={topic.url} target="_blank" rel="noreferrer" className="drawer-link">
                Open Original Resource
              </a>
            </div>
          </div>

          <div className="drawer-editor">
            <label>
              <FilePenLine size={16} />
              Revisions, key concepts, or links:
            </label>
            <RichTextEditor
              value={draft}
              onChange={(html) => setDraft(html)}
            />
          </div>
        </div>

        <div className="drawer-footer">
          <button className="primary-button" onClick={handleSave}>
            Save & Close
          </button>
          <button className="ghost-button" onClick={onClose}>
            Close
          </button>
          {initialNote && (
            <button className="icon-button danger delete-btn" onClick={handleDelete} title="Delete note">
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
