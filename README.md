# Placement Preparation Tracker

A production-ready React + Vite dashboard for organizing placement preparation across DSA, core CS subjects, aptitude, interviews, mock tests, notes, and learning resources.

## Features

- Dashboard cards for total, completed, pending, percentage, daily goal, weekly progress, and streak.
- Collapsible sidebar with Dashboard, DSA, Core Subjects, Aptitude, Interview Preparation, Mock Tests, Notes, and Settings routes.
- Dynamic search across topic names, problem/resource names, subject names, categories, and descriptions.
- Topic cards with difficulty, resource hyperlinks, completion checkbox, notes, and favorites.
- Local Storage persistence for progress, notes, theme, favorites, daily goal, recent topics, bookmarks, and activity history.
- Progress analytics with overall and category-wise progress bars.
- Light and dark mode with saved preference.
- Import HTML bookmark exports and convert links into saved resources.
- Export progress as JSON.
- Responsive desktop, tablet, and mobile layouts.
- Includes all 2,138 hyperlinks imported from the provided `DSA_sheet.html` bookmark export.

## Folder Structure

```text
src/
├── components/
│   ├── Navbar.jsx
│   ├── ProgressBar.jsx
│   ├── SearchBar.jsx
│   ├── Sidebar.jsx
│   └── TopicCard.jsx
├── data/
│   └── topics.js
├── hooks/
│   └── useLocalStorage.js
├── pages/
│   ├── Aptitude.jsx
│   ├── CategoryPage.jsx
│   ├── CoreSubjects.jsx
│   ├── DSA.jsx
│   ├── Dashboard.jsx
│   ├── InterviewPreparation.jsx
│   ├── MockTests.jsx
│   ├── Notes.jsx
│   └── Settings.jsx
├── App.jsx
├── main.jsx
└── styles.css
```

## Getting Started

```bash
npm install
npm run dev
```

Open the local URL shown by Vite, usually `http://localhost:5173`.

## Build

```bash
npm run build
```

## Notes

No backend is required. All user data is stored in browser Local Storage.
