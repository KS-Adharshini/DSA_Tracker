function IconBase({ children, size = 20, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const Search = (props) => <IconBase {...props}><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></IconBase>;
export const Moon = (props) => <IconBase {...props}><path d="M20 14.5A8 8 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" /></IconBase>;
export const Sun = (props) => <IconBase {...props}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" /></IconBase>;
export const RotateCcw = (props) => <IconBase {...props}><path d="M3 7v6h6" /><path d="M21 12a9 9 0 0 0-15-6.7L3 8" /></IconBase>;
export const Menu = (props) => <IconBase {...props}><path d="M4 6h16M4 12h16M4 18h16" /></IconBase>;
export const BarChart3 = (props) => <IconBase {...props}><path d="M4 20V10M12 20V4M20 20v-7" /></IconBase>;
export const BookOpen = (props) => <IconBase {...props}><path d="M4 5.5A3.5 3.5 0 0 1 7.5 4H11v16H7.5A3.5 3.5 0 0 0 4 21.5Z" /><path d="M20 5.5A3.5 3.5 0 0 0 16.5 4H13v16h3.5a3.5 3.5 0 0 1 3.5 1.5Z" /></IconBase>;
export const Brain = (props) => <IconBase {...props}><path d="M9 4a4 4 0 0 0-4 4v1a4 4 0 0 0 0 8v1a3 3 0 0 0 5 2.2V4.8A3 3 0 0 0 9 4Z" /><path d="M15 4a4 4 0 0 1 4 4v1a4 4 0 0 1 0 8v1a3 3 0 0 1-5 2.2V4.8A3 3 0 0 1 15 4Z" /></IconBase>;
export const ClipboardCheck = (props) => <IconBase {...props}><path d="M9 4h6l1 2h3v16H5V6h3Z" /><path d="m9 14 2 2 4-5" /></IconBase>;
export const Code2 = (props) => <IconBase {...props}><path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 4l-4 16" /></IconBase>;
export const FileText = (props) => <IconBase {...props}><path d="M6 2h8l4 4v16H6Z" /><path d="M14 2v5h5M8 12h8M8 16h8M8 8h3" /></IconBase>;
export const MessageSquareText = (props) => <IconBase {...props}><path d="M4 5h16v11H8l-4 4Z" /><path d="M8 9h8M8 13h6" /></IconBase>;
export const Settings = (props) => <IconBase {...props}><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" /></IconBase>;
export const ExternalLink = (props) => <IconBase {...props}><path d="M14 3h7v7M10 14 21 3M20 14v6H4V4h6" /></IconBase>;
export const FilePenLine = (props) => <IconBase {...props}><path d="M6 2h8l4 4v16H6Z" /><path d="M14 2v5h5M8 17l5-5 3 3-5 5H8Z" /></IconBase>;
export const Star = (props) => <IconBase {...props}><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.1L12 17.2 6.4 20.1 7.5 14 3 9.6l6.2-.9Z" /></IconBase>;
export const Trash2 = (props) => <IconBase {...props}><path d="M3 6h18M8 6V4h8v2M6 6l1 16h10l1-16M10 11v6M14 11v6" /></IconBase>;
export const CalendarCheck = (props) => <IconBase {...props}><path d="M7 2v4M17 2v4M4 8h16v14H4ZM8 14l2 2 5-5" /></IconBase>;
export const Flame = (props) => <IconBase {...props}><path d="M13 2s1 4-2 7c-2 2-4 4-4 7a5 5 0 0 0 10 0c0-3-2-5-1-8 2 2 4 4 4 8A8 8 0 0 1 4 16c0-5 5-7 9-14Z" /></IconBase>;
export const ListChecks = (props) => <IconBase {...props}><path d="m3 6 2 2 4-4M3 14l2 2 4-4M12 7h9M12 15h9" /></IconBase>;
export const Target = (props) => <IconBase {...props}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></IconBase>;
export const TrendingUp = (props) => <IconBase {...props}><path d="M3 17 9 11l4 4 8-8" /><path d="M15 7h6v6" /></IconBase>;
export const Download = (props) => <IconBase {...props}><path d="M12 3v12M7 10l5 5 5-5M5 21h14" /></IconBase>;
export const Upload = (props) => <IconBase {...props}><path d="M12 21V9M7 14l5-5 5 5M5 3h14" /></IconBase>;
export const X = (props) => <IconBase {...props}><path d="M18 6 6 18M6 6l12 12" /></IconBase>;

