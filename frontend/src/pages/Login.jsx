import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [tab,      setTab]      = useState('login');   // 'login' | 'signup'
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [name,     setName]     = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      nav(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1B2A] flex">
      {/* ── Left panel (hidden on mobile) ─────────── */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-[#0D1B2A] via-[#112233] to-[#0D1B2A] px-16 py-12 relative overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-amber-500/8 rounded-full blur-3xl" />

        <Link to="/" className="flex items-center gap-2 relative z-10">
          <span className="text-2xl font-extrabold text-white">
            <span className="text-[#C9963A]">Scale</span>Shop
          </span>
          <span className="text-[10px] bg-[#1A6B5E] text-white px-2 py-0.5 rounded-full font-semibold">AI</span>
        </Link>

        <div className="relative z-10">
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-6">
            Your shop's<br />
            <span className="bg-gradient-to-r from-[#C9963A] to-amber-400 bg-clip-text text-transparent">
              growth engine
            </span><br />
            awaits you.
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-10">
            Join 365+ shop owners using ScaleShop AI to track KPIs,
            get AI recommendations, and prepare for IPO.
          </p>

          {/* Social proof */}
          <div className="space-y-4">
            {[
              { text: "IPO score improved 42 → 79 in 6 months", icon: '🚀' },
              { text: "₹4L monthly savings identified automatically", icon: '💰' },
              { text: "GST compliance fully automated", icon: '✅' },
            ].map(item => (
              <div key={item.text} className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm text-gray-300">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          {['RK','PM','AS','NK'].map((a, i) => (
            <div key={a} className="w-8 h-8 bg-[#1A6B5E] rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ marginLeft: i > 0 ? '-8px' : '0', zIndex: 4 - i }}>
              {a}
            </div>
          ))}
          <span className="text-sm text-gray-400 ml-2">+361 shop owners online</span>
        </div>
      </div>

      {/* ── Right panel (login form) ───────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 justify-center mb-8 lg:hidden">
            <span className="text-2xl font-extrabold text-white">
              <span className="text-[#C9963A]">Scale</span>Shop
            </span>
            <span className="text-[10px] bg-[#1A6B5E] text-white px-2 py-0.5 rounded-full font-semibold">AI</span>
          </Link>

          <div className="bg-white rounded-3xl shadow-2xl p-8">
            {/* Tab switcher */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
              {[['login', 'Sign In'], ['signup', 'Create Account']].map(([key, label]) => (
                <button key={key} onClick={() => { setTab(key); setError(''); }}
                  className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                    tab === key
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}>
                  {label}
                </button>
              ))}
            </div>

            {tab === 'login' ? (
              <>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Welcome back</h2>
                <p className="text-sm text-gray-500 mb-8">Sign in to your ScaleShop AI dashboard</p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Get started free</h2>
                <p className="text-sm text-gray-500 mb-8">Create your account — no credit card required</p>
              </>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-xl mb-6 flex items-start gap-2">
                <span className="mt-0.5">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {tab === 'signup' && (
                <div>
                  <label className="input-label">Full name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)}
                    required placeholder="Ravi Kumar"
                    className="input" />
                </div>
              )}

              <div>
                <label className="input-label">Email address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  required placeholder="you@example.com"
                  className="input" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="input-label mb-0">Password</label>
                  {tab === 'login' && (
                    <button type="button" className="text-xs text-[#1A6B5E] hover:underline font-medium">
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)}
                    required placeholder="••••••••"
                    className="input pr-12" />
                  <button type="button" onClick={() => setShowPw(p => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm">
                    {showPw ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {tab === 'signup' && (
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" required className="mt-0.5 w-4 h-4 accent-teal-600 rounded" />
                  <span className="text-xs text-gray-500 leading-relaxed">
                    I agree to the{' '}
                    <span className="text-[#1A6B5E] font-medium">Terms of Service</span> and{' '}
                    <span className="text-[#1A6B5E] font-medium">Privacy Policy</span>
                  </span>
                </label>
              )}

              <button type="submit" disabled={loading}
                className="w-full bg-[#1A6B5E] hover:bg-teal-700 active:bg-teal-800 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed">
                {loading
                  ? <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {tab === 'login' ? 'Signing in…' : 'Creating account…'}
                    </span>
                  : tab === 'login' ? 'Sign In →' : 'Create Account →'
                }
              </button>
            </form>

            {/* Demo credentials */}
            <div className="mt-6 p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-2xl">
              <p className="text-xs font-bold text-amber-800 mb-2.5 flex items-center gap-1.5">
                <span>🔑</span> Demo Credentials
              </p>
              <div className="space-y-1.5">
                {[
                  { role: 'Admin', email: 'admin@scaleshop.ai', pw: 'Admin@123', color: 'bg-amber-100 text-amber-700' },
                  { role: 'Owner', email: 'ravi@kirana.com',    pw: 'Shop@123',  color: 'bg-teal-100 text-teal-700' },
                ].map(d => (
                  <button key={d.role} type="button"
                    onClick={() => { setEmail(d.email); setPassword(d.pw); setTab('login'); }}
                    className="w-full flex items-center gap-3 text-left hover:bg-white/60 rounded-lg px-2 py-1.5 transition-colors group">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${d.color} flex-shrink-0`}>{d.role}</span>
                    <span className="text-xs text-gray-600 font-mono truncate">{d.email}</span>
                    <span className="text-xs text-gray-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">Click to fill →</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-gray-500 mt-6">
            © 2025 ScaleShop AI · Prathap Velavaluri
          </p>
        </div>
      </div>
    </div>
  );
}
