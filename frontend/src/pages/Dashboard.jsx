import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Legend
} from 'recharts';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';

const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const PRIORITY_BADGE = {
  high:   <span className="badge-high">High</span>,
  medium: <span className="badge-medium">Medium</span>,
  low:    <span className="badge-low">Low</span>,
};

const TIER_BADGE = {
  basic:     <span className="badge-tier-basic">Basic</span>,
  growth:    <span className="badge-tier-growth">Growth</span>,
  ipo_ready: <span className="badge-tier-ipo">IPO Ready</span>,
};

const QUICK_ACTIONS = [
  { icon: '📥', label: 'Import Sales Data', desc: 'Upload CSV or connect POS', color: 'bg-teal-50 text-teal-700' },
  { icon: '📊', label: 'Generate Report',   desc: 'Monthly PDF for investors',  color: 'bg-violet-50 text-violet-700' },
  { icon: '🚀', label: 'View IPO Tracker',  desc: 'Check compliance progress',  href: '/ipo', color: 'bg-amber-50 text-amber-700' },
];

const fmt   = (n) => n  ? `₹${(n  / 1000).toFixed(0)}K` : '—';
const fmt2  = (n) => n  ? `₹${(n  / 100000).toFixed(1)}L` : '—';

export default function Dashboard() {
  const { user } = useAuth();
  const [shop,    setShop]    = useState(null);
  const [metrics, setMetrics] = useState({ summary: {}, metrics: [] });
  const [recs,    setRecs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    (async () => {
      try {
        const { data: shopsData } = await api.get('/api/shops');
        const firstShop = shopsData.shops[0];
        if (!firstShop) { setLoading(false); return; }
        setShop(firstShop);
        const [metricsRes, recsRes] = await Promise.all([
          api.get(`/api/shops/${firstShop.id}/metrics`),
          api.get(`/api/shops/${firstShop.id}/recommendations`),
        ]);
        setMetrics(metricsRes.data);
        setRecs(recsRes.data.recommendations);
      } catch (e) {
        setError('Failed to load dashboard data.');
      } finally { setLoading(false); }
    })();
  }, []);

  const dismissRec = async (id) => {
    await api.put(`/api/shops/${shop.id}/recommendations/${id}/dismiss`);
    setRecs(r => r.filter(x => x.id !== id));
  };

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Loading your dashboard…</p>
      </div>
    </div>
  );
  if (error) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <p className="text-red-500 text-sm mb-2">{error}</p>
        <button onClick={() => window.location.reload()} className="btn-secondary text-sm">Retry</button>
      </div>
    </div>
  );
  if (!shop) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="text-5xl mb-4">🏪</div>
        <p className="text-gray-600 font-medium mb-2">No shop found for your account</p>
        <p className="text-sm text-gray-400">Contact your admin to get set up.</p>
      </div>
    </div>
  );

  const { summary, metrics: history } = metrics;
  const chartData = [...history].reverse().map(m => ({
    name:     `${MONTH_LABELS[m.month - 1]}`,
    Revenue:  Math.round(m.revenue_inr  / 1000),
    Expenses: Math.round(m.expenses_inr / 1000),
    Savings:  Math.round(m.ai_savings_inr / 1000),
  }));

  const highRecs = recs.filter(r => r.priority === 'high').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Top bar ───────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-extrabold text-gray-900">{shop.name}</h1>
            {TIER_BADGE[shop.tier]}
          </div>
          <p className="text-sm text-gray-500">
            {shop.city && shop.state ? `${shop.city}, ${shop.state} · ` : ''}
            <span className="capitalize">{shop.shop_type}</span>
            {' · '}Onboarded {new Date(shop.onboarding_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {highRecs > 0 && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-700 text-xs font-semibold px-3 py-2 rounded-xl">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              {highRecs} urgent action{highRecs > 1 ? 's' : ''}
            </div>
          )}
          <Link to="/ipo" className="btn-primary text-sm flex items-center gap-2">
            🚀 IPO Tracker
          </Link>
        </div>
      </div>

      {/* ── AI opportunity banner ─────────────────── */}
      {recs.length > 0 && (
        <div className="bg-gradient-to-r from-[#0D1B2A] to-[#1a2d40] border border-[#1A6B5E]/30 rounded-2xl px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🤖</span>
            <div>
              <p className="text-sm font-bold text-white">AI found {recs.length} growth opportunit{recs.length > 1 ? 'ies' : 'y'} for you</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Potential uplift: ₹{recs.reduce((s, r) => s + (r.impact_inr || 0), 0).toLocaleString('en-IN')} / month
              </p>
            </div>
          </div>
          <button onClick={() => setActiveTab('recommendations')}
            className="bg-[#C9963A] hover:bg-amber-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors">
            View All →
          </button>
        </div>
      )}

      {/* ── KPI cards ─────────────────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="card group hover:shadow-md hover:border-teal-100 transition-all">
          <div className="flex items-start justify-between mb-3">
            <span className="text-2xl">💰</span>
            {summary.mrr_growth > 0
              ? <span className="stat-up">↑ {summary.mrr_growth}%</span>
              : summary.mrr_growth < 0
                ? <span className="stat-down">↓ {Math.abs(summary.mrr_growth)}%</span>
                : null
            }
          </div>
          <p className="text-xs text-gray-500 font-medium mb-1">Monthly Revenue</p>
          <p className="text-2xl font-extrabold text-gray-900">{fmt2(summary.revenue_inr)}</p>
          <p className="text-xs text-gray-400 mt-1">vs last month</p>
        </div>

        <div className="card hover:shadow-md hover:border-red-50 transition-all">
          <div className="flex items-start justify-between mb-3">
            <span className="text-2xl">📉</span>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Expenses</span>
          </div>
          <p className="text-xs text-gray-500 font-medium mb-1">Monthly Expenses</p>
          <p className="text-2xl font-extrabold text-gray-900">{fmt2(summary.expenses_inr)}</p>
          <p className="text-xs text-gray-400 mt-1">operating costs</p>
        </div>

        <div className="card hover:shadow-md hover:border-blue-50 transition-all">
          <div className="flex items-start justify-between mb-3">
            <span className="text-2xl">👥</span>
            <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Active</span>
          </div>
          <p className="text-xs text-gray-500 font-medium mb-1">Customers</p>
          <p className="text-2xl font-extrabold text-gray-900">
            {summary.customers_count?.toLocaleString('en-IN') || '—'}
          </p>
          <p className="text-xs text-gray-400 mt-1">{summary.orders_count?.toLocaleString()} orders</p>
        </div>

        <div className="card hover:shadow-md hover:border-amber-50 transition-all">
          <div className="flex items-start justify-between mb-3">
            <span className="text-2xl">🤖</span>
            <span className="stat-up">AI</span>
          </div>
          <p className="text-xs text-gray-500 font-medium mb-1">AI Savings</p>
          <p className="text-2xl font-extrabold text-gray-900">{fmt(summary.ai_savings_inr)}</p>
          <p className="text-xs text-gray-400 mt-1">this month</p>
        </div>
      </div>

      {/* ── Quick actions ─────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {QUICK_ACTIONS.map(a => (
          <div key={a.label} className="card-hover flex items-start gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${a.color}`}>
              {a.icon}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{a.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{a.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Tab bar ───────────────────────────────── */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {[
          ['overview',         '📊 Overview'],
          ['recommendations',  `🤖 AI Tips${recs.length ? ` (${recs.length})` : ''}`],
          ['history',          '📅 History'],
        ].map(([key, label]) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* ── Overview tab ─────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue chart */}
          <div className="card lg:col-span-2">
            <h3 className="text-base font-bold text-gray-900 mb-5">Revenue vs Expenses <span className="text-gray-400 font-normal text-sm">(₹'000s)</span></h3>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={chartData} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ border: 'none', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.12)', fontSize: 12 }}
                    formatter={(v) => [`₹${v}K`]}
                  />
                  <Bar dataKey="Revenue"  fill="#1A6B5E" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Expenses" fill="#C9963A" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Savings"  fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-60 flex items-center justify-center text-gray-400 text-sm">
                No metrics data yet. Add monthly data to see your chart.
              </div>
            )}
            <div className="flex gap-6 mt-4 justify-center">
              {[['#1A6B5E','Revenue'],['#C9963A','Expenses'],['#6366f1','AI Savings']].map(([c,l]) => (
                <span key={l} className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: c }} />
                  {l}
                </span>
              ))}
            </div>
          </div>

          {/* IPO score + shop info */}
          <div className="space-y-4">
            <div className="card">
              <h3 className="text-sm font-bold text-gray-700 mb-4">IPO Readiness</h3>
              <div className="relative flex items-center justify-center mb-4">
                <svg viewBox="0 0 80 80" className="w-24 h-24 -rotate-90">
                  <circle cx="40" cy="40" r="32" fill="none" stroke="#f3f4f6" strokeWidth="8" />
                  <circle cx="40" cy="40" r="32" fill="none" stroke="#1A6B5E" strokeWidth="8"
                    strokeDasharray={`${(70 / 100) * 2 * Math.PI * 32} ${2 * Math.PI * 32}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-center">
                  <p className="text-2xl font-extrabold text-gray-900 leading-none">70</p>
                  <p className="text-xs text-gray-400">/ 100</p>
                </div>
              </div>
              <p className="text-center text-sm font-semibold text-teal-700 mb-1">Good Progress</p>
              <p className="text-center text-xs text-gray-400 mb-4">30 points to IPO-ready</p>
              <Link to="/ipo" className="btn-primary text-xs py-2 w-full text-center block">
                View Checklist →
              </Link>
            </div>

            <div className="card">
              <h3 className="text-sm font-bold text-gray-700 mb-3">Shop Info</h3>
              <dl className="space-y-2">
                {[
                  ['Tier',      TIER_BADGE[shop.tier]],
                  ['Status',    <span className="text-xs text-emerald-600 font-semibold capitalize">{shop.status}</span>],
                  ['Monthly Fee', <span className="text-xs font-mono font-semibold text-gray-800">₹{Number(shop.monthly_fee_inr).toLocaleString('en-IN')}</span>],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between">
                    <dt className="text-xs text-gray-400">{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      )}

      {/* ── AI Recommendations tab ─────────────────── */}
      {activeTab === 'recommendations' && (
        <div>
          {recs.length === 0 ? (
            <div className="card text-center py-16">
              <div className="text-5xl mb-4">✅</div>
              <p className="text-lg font-bold text-gray-700 mb-2">All clear!</p>
              <p className="text-sm text-gray-400">No pending AI recommendations. Check back next week.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recs.map(r => (
                <div key={r.id}
                  className="card hover:shadow-md hover:border-teal-100 transition-all group">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="text-sm font-bold text-gray-900 leading-snug">{r.title}</p>
                    {PRIORITY_BADGE[r.priority]}
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed mb-3">{r.description}</p>
                  {r.impact_inr && (
                    <div className="flex items-center gap-2 bg-teal-50 border border-teal-100 rounded-lg px-3 py-2 mb-3">
                      <span className="text-teal-600 text-sm">💡</span>
                      <span className="text-xs text-teal-700 font-semibold">
                        +₹{(r.impact_inr / 1000).toFixed(0)}K/mo potential impact
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 pt-2 border-t border-gray-50">
                    <button className="text-xs font-semibold text-[#1A6B5E] hover:text-teal-700 transition-colors">
                      Take action →
                    </button>
                    <button onClick={() => dismissRec(r.id)}
                      className="text-xs text-gray-400 hover:text-gray-600 transition-colors ml-auto">
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── History tab ───────────────────────────── */}
      {activeTab === 'history' && (
        <div className="card overflow-hidden p-0">
          <div className="p-6 border-b border-gray-50">
            <h3 className="text-base font-bold text-gray-900">Monthly Performance History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  {['Period','Revenue','Expenses','Profit','Customers','Orders','AI Savings'].map(h => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {history.length === 0 ? (
                  <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400 text-sm">No metrics data yet.</td></tr>
                ) : (
                  [...history].reverse().map((m, i) => {
                    const profit = m.revenue_inr - m.expenses_inr;
                    return (
                      <tr key={m.id}
                        className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${i === 0 ? 'font-semibold' : ''}`}>
                        <td className="px-6 py-4 font-semibold text-gray-800 whitespace-nowrap">
                          {MONTH_LABELS[m.month - 1]} {m.year}
                          {i === 0 && <span className="ml-2 text-[10px] bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded-full">Latest</span>}
                        </td>
                        <td className="px-6 py-4 text-gray-700">{fmt(m.revenue_inr)}</td>
                        <td className="px-6 py-4 text-gray-700">{fmt(m.expenses_inr)}</td>
                        <td className={`px-6 py-4 font-semibold ${profit >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                          {profit >= 0 ? '+' : ''}{fmt(profit)}
                        </td>
                        <td className="px-6 py-4 text-gray-700">{m.customers_count?.toLocaleString()}</td>
                        <td className="px-6 py-4 text-gray-700">{m.orders_count?.toLocaleString()}</td>
                        <td className="px-6 py-4 text-teal-600 font-semibold">{fmt(m.ai_savings_inr)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
