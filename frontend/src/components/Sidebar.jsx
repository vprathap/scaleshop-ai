import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'Dashboard',    href: '/dashboard',  icon: '📊', roles: ['admin','owner'] },
  { label: 'IPO Tracker',  href: '/ipo',         icon: '🚀', roles: ['admin','owner'] },
  { label: 'Admin Panel',  href: '/admin',       icon: '⚙️', roles: ['admin'] },
];

export default function Sidebar() {
  const { user } = useAuth();
  const items = navItems.filter(i => i.roles.includes(user?.role));

  return (
    <aside className="w-56 min-h-screen bg-[#0D1B2A] text-white flex flex-col">
      <div className="px-5 py-6 border-b border-gray-700">
        <p className="font-bold text-lg">
          <span className="text-[#C9963A]">Scale</span>Shop AI
        </p>
        <p className="text-xs text-gray-400 mt-1 truncate">{user?.email}</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map(item => (
          <NavLink key={item.href} to={item.href}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ` +
              (isActive
                ? 'bg-[#1A6B5E] text-white font-semibold'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white')
            }>
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-5 py-4 border-t border-gray-700 text-xs text-gray-500">
        v1.0.0 · Seed Stage
      </div>
    </aside>
  );
}
