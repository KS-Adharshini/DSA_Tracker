import React, { useRef, useEffect } from 'react';

export default function RichTextEditor({ value, onChange }) {
  const editorRef = useRef(null);

  // Load the initial value into the editor once on mount
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, []);

  // Update editor innerHTML if value changes externally and doesn't match
  useEffect(() => {
    if (editorRef.current && value !== undefined && editorRef.current.innerHTML !== value) {
      // Only update if the user isn't currently editing to avoid cursor jumping
      if (document.activeElement !== editorRef.current) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const executeCommand = (command, val = null) => {
    document.execCommand(command, false, val);
    handleInput();
    // Keep focus in the editor
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handleLink = () => {
    const url = prompt('Enter the link URL (e.g. https://leetcode.com):');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  const handleCodeBlock = () => {
    // Wrap selection in pre/code block
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    
    const selectedText = selection.toString();
    const codeHtml = `<pre style="background: rgba(100, 116, 139, 0.12); padding: 12px; border-radius: 6px; font-family: monospace; font-size: 0.9rem; overflow-x: auto; margin: 8px 0; border-left: 3px solid #6366f1; white-space: pre-wrap;"><code>${selectedText || 'Code block...'}</code></pre><p><br></p>`;
    
    executeCommand('insertHTML', codeHtml);
  };

  return (
    <div className="rich-editor-container">
      <div className="rich-editor-toolbar">
        {/* Undo / Redo */}
        <button type="button" onClick={() => executeCommand('undo')} title="Undo" className="toolbar-btn">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
        </button>
        <button type="button" onClick={() => executeCommand('redo')} title="Redo" className="toolbar-btn">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"/></svg>
        </button>

        <span className="toolbar-separator" />

        {/* Font Family */}
        <select 
          onChange={(e) => executeCommand('fontName', e.target.value)} 
          className="toolbar-select font-select"
          title="Font Family"
        >
          <option value="Inter, sans-serif">Sans-Serif</option>
          <option value="Georgia, serif">Serif</option>
          <option value="Courier New, monospace">Code/Monospace</option>
          <option value="Comic Sans MS">Casual</option>
        </select>

        {/* Font Size */}
        <select 
          onChange={(e) => executeCommand('fontSize', e.target.value)} 
          className="toolbar-select size-select"
          defaultValue="3"
          title="Font Size"
        >
          <option value="2">Small</option>
          <option value="3">Normal</option>
          <option value="5">Large</option>
          <option value="7">Huge</option>
        </select>

        <span className="toolbar-separator" />

        {/* Text styling */}
        <button type="button" onClick={() => executeCommand('bold')} title="Bold" className="toolbar-btn bold">B</button>
        <button type="button" onClick={() => executeCommand('italic')} title="Italic" className="toolbar-btn italic">I</button>
        <button type="button" onClick={() => executeCommand('underline')} title="Underline" className="toolbar-btn underline">U</button>
        <button type="button" onClick={() => executeCommand('strikeThrough')} title="Strikethrough" className="toolbar-btn strike">S</button>

        <span className="toolbar-separator" />

        {/* Colors */}
        <div className="color-picker-btn" title="Text Color">
          <span className="color-indicator">A</span>
          <input type="color" onChange={(e) => executeCommand('foreColor', e.target.value)} />
        </div>
        <div className="color-picker-btn highlight" title="Highlight Color">
          <span className="color-indicator">✏️</span>
          <input type="color" onChange={(e) => executeCommand('hiliteColor', e.target.value)} defaultValue="#ffff00" />
        </div>

        <span className="toolbar-separator" />

        {/* Alignment */}
        <button type="button" onClick={() => executeCommand('justifyLeft')} title="Align Left" className="toolbar-btn">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="6" x2="3" y2="6"/><line x1="15" y1="12" x2="3" y2="12"/><line x1="17" y1="18" x2="3" y2="18"/></svg>
        </button>
        <button type="button" onClick={() => executeCommand('justifyCenter')} title="Align Center" className="toolbar-btn">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="6"/><line x1="21" y1="12" x2="3" y2="12"/><line x1="18" y1="18" x2="6" y2="18"/></svg>
        </button>
        <button type="button" onClick={() => executeCommand('justifyRight')} title="Align Right" className="toolbar-btn">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="12" x2="9" y2="12"/><line x1="21" y1="18" x2="7" y2="18"/></svg>
        </button>

        <span className="toolbar-separator" />

        {/* Lists */}
        <button type="button" onClick={() => executeCommand('insertUnorderedList')} title="Bullet List" className="toolbar-btn">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
        </button>
        <button type="button" onClick={() => executeCommand('insertOrderedList')} title="Numbered List" className="toolbar-btn">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>
        </button>

        <span className="toolbar-separator" />

        {/* Interactive Insertions */}
        <button type="button" onClick={handleCodeBlock} title="Format as Code Block" className="toolbar-btn block-btn">&lt;/&gt;</button>
        <button type="button" onClick={handleLink} title="Insert Link" className="toolbar-btn">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        </button>
      </div>

      <div
        ref={editorRef}
        className="rich-editor-content"
        contentEditable
        onInput={handleInput}
        placeholder="Type detailed rich text notes, trace tables, solutions, or snippets here..."
      />
    </div>
  );
}
