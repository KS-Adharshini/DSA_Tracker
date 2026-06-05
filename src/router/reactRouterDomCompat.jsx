import { Children, createContext, isValidElement, useContext, useEffect, useMemo, useState } from 'react';

const RouterContext = createContext(null);

function getPath() {
  return window.location.pathname || '/';
}

export function BrowserRouter({ children }) {
  const [path, setPath] = useState(getPath);

  useEffect(() => {
    const handlePopState = () => setPath(getPath());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const value = useMemo(() => ({
    path,
    navigate(to, options = {}) {
      if (to === path && !options.replace) return;
      if (options.replace) {
        window.history.replaceState({}, '', to);
      } else {
        window.history.pushState({}, '', to);
      }
      setPath(getPath());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  }), [path]);

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useNavigate() {
  const context = useContext(RouterContext);
  if (!context) throw new Error('useNavigate must be used inside BrowserRouter');
  return context.navigate;
}

export function NavLink({ to, end = false, className = '', children, ...props }) {
  const context = useContext(RouterContext);
  const active = end ? context.path === to : context.path === to || context.path.startsWith(`${to}/`);
  const resolvedClassName = typeof className === 'function'
    ? className({ isActive: active })
    : `${className} ${active ? 'active' : ''}`.trim();

  return (
    <a
      {...props}
      href={to}
      className={resolvedClassName}
      onClick={(event) => {
        event.preventDefault();
        context.navigate(to);
      }}
    >
      {children}
    </a>
  );
}

export function Routes({ children }) {
  const context = useContext(RouterContext);
  const routes = Children.toArray(children).filter(isValidElement);
  const match = routes.find((route) => {
    const routePath = route.props.path;
    return routePath === '*' || routePath === context.path;
  });

  return match?.props.element || null;
}

export function Route() {
  return null;
}

export function Navigate({ to, replace = false }) {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(to, { replace });
  }, [navigate, replace, to]);

  return null;
}
