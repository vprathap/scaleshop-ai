import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const user = await login(email, password);
      nav(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Check credentials.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#0D1B2A] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md">
        <Link to="/" className="block text-center mb-8">
          <span className="text-2xl font-extrabold">
            <span className="text-[#C9963A]">Scale</span>Shop
            <span className="ml-1 text-xs bg-[#1A6B5E] text-white px-2 py-0.5 rounded-full">AI</span>
          </span>
        </Link>
        <h2 className="text-xl font-bold text-gray-900 mb-1 text-center">Welcome back</h2>
        <p className="text-sm text-gray-500 text-center mb-8">Sign in to your dashboard</p>

        {error && (
          <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg mb-6 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              required placeholder="you@example.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              required placeholder="••••••••"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
          <button type="submit" disabled={loading}
            className="w-full btn-primary py-3 text-sm disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 p-4 bg-gray-50 rounded-xl text-xs text-gray-500 space-y-1">
          <p className="font-medium text-gray-700 mb-2">Demo credentials</p>
          <p>Admin: admin@scaleshop.ai / Admin@123</p>
          <p>Owner: ravi@kirana.com / Shop@123</p>
        </div>
      </div>
    </div>
  );
}
