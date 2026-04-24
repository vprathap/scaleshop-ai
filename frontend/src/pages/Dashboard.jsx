import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';

const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const priorityBadge = (p) => ({
  high:   <span className="badge-high">High</span>,
  medium: <span className="badge-medium">Medium</span>,
  low:    <span className="badge-low">Low</span>,
}[p] || null);

export default function Dashboard() {
  const { user } = useAuth();
  const [shop,    setShop]    = useState(null);
  const [metrics, setMetrics] = useState({ summary: {}, metrics: [] });
  const [recs,    setRecs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

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

  const dismissRec = async (recId) => {
    await api.put(`/api/shops/${shop.id}/recommendations/${recId}/dismiss`);
    setRecs(r => r.filter(x => x.id !== recId));
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-500" />
    </div>
  );
  if (error) return <div className="text-red-600 text-sm">{error}</div>;
  if (!shop)  return (
    <div className="text-center py-24">
      <p className="text-gray-500 mb-4">No shop found for your account.</p>
      <p className="text-sm text-gray-400">Contact your admin to get set up.</p>
    </div>
  );

  const { summary, metrics: history } = metrics;
  const chartData = [...history].reverse().map(m => ({
    name: `${MONTH_LABELS[m.month - 1]} ${m.year}`,
    Revenue: Math.round(m.revenue_inr / 1000),
    Expenses: Math.round(m.expenses_inr / 1000),
    AISavings: Math.round(m.ai_savings_inr / 1000),
  }));

  const fmt = (n) => n ? `₹${(n / 1000).toFixed(0)}K` : '—';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{shop.name}</h2>
          <p className="text-sm text-gray-500 mt-1">
            {shop.city}, {shop.state} ·{' '}
            <span className="capitalize">{shop.shop_type}</span> ·{' '}
            <span className={`font-medium ${
              shop.tier === 'ipo_ready' ? 'text-teal-600' :
              shop.tier === 'growth'    ? 'text-amber-600' : 'text-gray-500'
            }`}>{shop.tier.replace('_',' ').toUpperCase()}</span>
          </p>
        </div>
        <Link to="/ipo"
          className="btn-primary text-sm flex items-center gap-2">
          🚀 IPO Tracker
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="Monthly Revenue"  value={fmt(summary.revenue_inr)}
          delta={summary.mrr_growth} icon="💰" color="teal" />
        <StatCard label="Monthly Expenses" value={fmt(summary.expenses_inr)}
          icon="📉" color="red" />
        <StatCard label="Active Customers" value={summary.customers_count?.toLocaleString() || '—'}
          icon="👥" color="navy" />
        <StatCard label="AI Savings"       value={fmt(summary.ai_savings_inr)}
          sub="This month" icon="🤖" color="gold" />
      </div>

      {/* Revenue chart + Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="card lg:col-span-2">
          <h3 className="text-base font-semibold text-gray-800 mb-5">Revenue vs Expenses (₹'000s)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => `₹${v}K`} />
              <Line type="monotone" dataKey="Revenue"   stroke="#1A6B5E" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="Expenses"  stroke="#C9963A" strokeWidth={2} dot={false} strokeDasharray="5 3" />
              <Line type="monotone" dataKey="AISavings" stroke="#6366f1" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-6 mt-4 justify-center text-xs text-gray-500">
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-[#1A6B5E] inline-block rounded" /> Revenue</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-[#C9963A] inline-block rounded" /> Expenses</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-indigo-400 inline-block rounded" /> AI Savings</span>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="card">
          <h3 className="text-base font-semibold text-gray-800 mb-4">
            🤖 AI Recommendations
            {recs.length > 0 && (
              <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">{recs.length}</span>
            )}
          </h3>
          {recs.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">All clear! No new recommendations.</p>
          ) : (
            <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
              {recs.map(r => (
                <div key={r.id} className="border border-gray-100 rounded-xl p-3 hover:border-teal-200 transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-sm font-semibold text-gray-800 leading-snug">{r.title}</p>
                    {priorityBadge(r.priority)}
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{r.description}</p>
                  {r.impact_inr && (
                    <p className="text-xs text-teal-600 font-medium mt-1.5">
                      💡 Potential impact: ₹{(r.impact_inr/1000).toFixed(0)}K/mo
                    </p>
                  )}
                  <button onClick={() => dismissRec(r.id)}
                    className="mt-2 text-xs text-gray-400 hover:text-gray-600 transition-colors">
                    Dismiss ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Metrics table */}
      <div className="card">
        <h3 className="text-base font-semibold text-gray-800 mb-5">Monthly Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-100">
                {['Period','Revenue','Expenses','Profit','Customers','Orders','Inventory','AI Savings'].map(h => (
                  <th key={h} className="pb-3 pr-6 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...history].reverse().map(m => {
                const profit = m.revenue_inr - m.expenses_inr;
                return (
                  <tr key={m.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 pr-6 font-medium text-gray-800">
                      {MONTH_LABELS[m.month - 1]} {m.year}
                    </td>
                    <td className="py-3 pr-6 text-gray-700">{fmt(m.revenue_inr)}</td>
                    <td className="py-3 pr-6 text-gray-700">{fmt(m.expenses_inr)}</td>
                    <td className={`py-3 pr-6 font-medium ${profit >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {fmt(profit)}
                    </td>
                    <td className="py-3 pr-6 text-gray-700">{m.customers_count?.toLocaleString()}</td>
                    <td className="py-3 pr-6 text-gray-700">{m.orders_count?.toLocaleString()}</td>
                    <td className="py-3 pr-6 text-gray-700">{fmt(m.inventory_value)}</td>
                    <td className="py-3 pr-6 text-teal-600 font-medium">{fmt(m.ai_savings_inr)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
