import { BarChart3, BookOpen, Code2, Menu, Settings } from './Icons.jsx';
import { NavLink } from 'react-router-dom';

export default function Sidebar({ collapsed, onToggle, completionPercentage, navItems }) {
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
            {Icon ? <Icon size={19} /> : <BookOpen size={19} />}
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
