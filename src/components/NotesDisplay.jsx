/**
 * NotesDisplay Component
 * Renders saved notes with proper HTML formatting and clean styling
 */
export default function NotesDisplay({ content }) {
  if (!content) return null;

  return (
    <div className="notes-display-container">
      <div 
        className="notes-display-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
