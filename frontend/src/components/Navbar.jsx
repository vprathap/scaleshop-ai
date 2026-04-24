import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const handleLogout = () => { logout(); nav('/'); };

  return (
    <nav className="bg-[#0D1B2A] text-white px-6 py-4 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
        <span className="text-[#C9963A]">Scale</span>Shop
        <span className="ml-1 text-xs bg-[#1A6B5E] text-white px-2 py-0.5 rounded-full font-medium">AI</span>
      </Link>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm text-gray-300">
              {user.full_name}
              <span className="ml-2 text-xs bg-gray-700 px-2 py-0.5 rounded-full">{user.role}</span>
            </span>
            {user.role === 'admin' && (
              <Link to="/admin" className="text-sm text-gray-300 hover:text-white transition-colors">Admin</Link>
            )}
            <Link to="/dashboard" className="text-sm text-gray-300 hover:text-white transition-colors">Dashboard</Link>
            <button onClick={handleLogout}
              className="text-sm bg-gray-700 hover:bg-gray-600 px-4 py-1.5 rounded-lg transition-colors">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm text-gray-300 hover:text-white transition-colors">Login</Link>
            <Link to="/login"
              className="text-sm bg-[#1A6B5E] hover:bg-teal-600 px-4 py-1.5 rounded-lg font-medium transition-colors">
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
