import { BarChart3, Code2, Menu, Settings } from './Icons.jsx';
import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', path: '/', icon: BarChart3 },
  { label: 'DSA Tracker', path: '/dsa', icon: Code2 },
  { label: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar({ collapsed, onToggle, completionPercentage }) {
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-top">
        <div className="brand-mark">PT</div>
        {!collapsed && (
          <div>
            <strong>Placement Tracker</strong>
            <span>{completionPercentage}% complete</span>
          </div>
        )}
        <button className="icon-button" type="button" onClick={onToggle} title="Toggle sidebar" aria-label="Toggle sidebar">
          <Menu size={19} />
        </button>
      </div>
      <nav className="sidebar-nav" aria-label="Primary navigation">
        {navItems.map(({ label, path, icon: Icon }) => (
          <NavLink key={label} to={path} end={path === '/'} title={collapsed ? label : undefined}>
            <Icon size={19} />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
