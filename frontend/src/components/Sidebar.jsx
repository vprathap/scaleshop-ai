import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard',   href: '/dashboard', icon: '📊', roles: ['admin','owner'] },
      { label: 'IPO Tracker', href: '/ipo',        icon: '🚀', roles: ['admin','owner'] },
    ],
  },
  {
    label: 'Management',
    items: [
      { label: 'Admin Panel', href: '/admin', icon: '⚙️', roles: ['admin'] },
    ],
  },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const handleLogout = () => { logout(); nav('/'); };

  const initials = user?.full_name
    ? user.full_name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : user?.email?.[0]?.toUpperCase() || '?';

  return (
    <aside className="w-60 min-h-screen bg-[#0D1B2A] text-white flex flex-col border-r border-gray-800">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-xl font-extrabold">
            <span className="text-[#C9963A]">Scale</span>Shop
          </span>
          <span className="text-[9px] bg-[#1A6B5E] text-white px-1.5 py-0.5 rounded-full font-semibold tracking-wide">AI</span>
        </div>
        <p className="text-[10px] text-gray-500 mt-1 font-medium uppercase tracking-widest">Growth Platform</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {NAV_SECTIONS.map(section => {
          const visibleItems = section.items.filter(i => i.roles.includes(user?.role));
          if (!visibleItems.length) return null;
          return (
            <div key={section.label} className="mb-6">
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest px-3 mb-2">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {visibleItems.map(item => (
                  <NavLink key={item.href} to={item.href}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ` +
                      (isActive
                        ? 'bg-[#1A6B5E] text-white shadow-sm'
                        : 'text-gray-400 hover:text-white hover:bg-white/8')
                    }>
                    <span className="text-base leading-none">{item.icon}</span>
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      {/* User profile */}
      <div className="px-3 pb-4 border-t border-gray-800 pt-4">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 transition-colors group">
          <div className="w-8 h-8 bg-[#1A6B5E] rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.full_name || 'User'}</p>
            <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all mt-1">
          <span className="text-base">↩</span>
          Sign out
        </button>
        <p className="text-[10px] text-gray-600 px-3 mt-3">v1.0.0 · Seed Stage</p>
      </div>
    </aside>
  );
}
