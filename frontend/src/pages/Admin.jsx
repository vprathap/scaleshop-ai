import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import api from '../api/client';
import StatCard from '../components/StatCard';

const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const tierColor = { basic: 'text-gray-500', growth: 'text-amber-600', ipo_ready: 'text-teal-600' };
const statusDot  = { active: 'bg-green-400', onboarding: 'bg-amber-400', inactive: 'bg-gray-300', churned: 'bg-red-400' };

export default function Admin() {
  const [overview, setOverview] = useState(null);
  const [shops,    setShops]    = useState([]);
  const [trend,    setTrend]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [page,     setPage]     = useState(1);

  useEffect(() => {
    (async () => {
      try {
        const [ov, sh, tr] = await Promise.all([
          api.get('/api/admin/overview'),
          api.get('/api/admin/shops'),
          api.get('/api/admin/mrr-trend'),
        ]);
        setOverview(ov.data);
        setShops(sh.data.shops);
        setTrend(tr.data.trend.map(t => ({
          name: `${MONTH_LABELS[t.month - 1]} '${String(t.year).slice(2)}`,
          Revenue: Math.round(t.total_revenue / 100000),
          AISavings: Math.round(t.total_ai_savings / 100000),
        })));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const filtered = shops.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.city?.toLowerCase().includes(search.toLowerCase()) ||
    s.user_name?.toLowerCase().includes(search.toLowerCase())
  );

  const fmt = (n) => n ? `₹${(n / 1000).toFixed(0)}K` : '—';
  const fmtL = (n) => n ? `₹${(n / 100000).toFixed(1)}L` : '—';

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-500" />
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Admin Panel</h2>
        <p className="text-sm text-gray-500 mt-1">Platform-wide overview · ScaleShop AI</p>
      </div>

      {/* KPI Overview */}
      {overview && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard label="Total Shops"    value={overview.shops?.total || 0}
            sub={`${overview.shops?.active || 0} active`} icon="🏪" color="teal" />
          <StatCard label="Platform MRR"   value={fmtL(overview.mrr?.total_mrr)}
            icon="💰" color="gold" />
          <StatCard label="IPO-Ready Shops" value={overview.shops?.ipo_ready || 0}
            icon="🚀" color="navy" />
          <StatCard label="Open AI Recs"   value={overview.pending_recommendations || 0}
            icon="🤖" color="red" />
        </div>
      )}

      {/* MRR Trend Chart */}
      {trend.length > 0 && (
        <div className="card">
          <h3 className="text-base font-semibold text-gray-800 mb-5">Platform Revenue Trend (₹ Lakhs)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={trend} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} unit="L" />
              <Tooltip formatter={(v) => `₹${v}L`} />
              <Bar dataKey="Revenue"   fill="#1A6B5E" radius={[4,4,0,0]} />
              <Bar dataKey="AISavings" fill="#C9963A" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-6 mt-3 justify-center text-xs text-gray-500">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#1A6B5E] inline-block rounded-sm" /> Revenue</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#C9963A] inline-block rounded-sm" /> AI Savings</span>
          </div>
        </div>
      )}

      {/* Shop Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
          <h3 className="text-base font-semibold text-gray-800">All Shops ({filtered.length})</h3>
          <input
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, city, owner…"
            className="border border-gray-200 rounded-lg px-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-teal-300"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-100">
                {['Shop','Owner','Location','Type','Tier','Status','Latest Revenue','AI Savings','Joined'].map(h => (
                  <th key={h} className="pb-3 pr-5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.slice((page-1)*15, page*15).map(s => (
                <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 pr-5 font-semibold text-gray-900 whitespace-nowrap">{s.name}</td>
                  <td className="py-3 pr-5 text-gray-600 whitespace-nowrap">{s.owner_name}</td>
                  <td className="py-3 pr-5 text-gray-500 whitespace-nowrap">{s.city}, {s.state}</td>
                  <td className="py-3 pr-5 text-gray-500 capitalize">{s.shop_type}</td>
                  <td className={`py-3 pr-5 font-medium capitalize ${tierColor[s.tier]}`}>
                    {s.tier?.replace('_',' ')}
                  </td>
                  <td className="py-3 pr-5">
                    <span className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${statusDot[s.status]}`} />
                      <span className="capitalize text-gray-600">{s.status}</span>
                    </span>
                  </td>
                  <td className="py-3 pr-5 text-gray-700">{fmt(s.latest_revenue)}</td>
                  <td className="py-3 pr-5 text-teal-600 font-medium">{fmt(s.latest_ai_savings)}</td>
                  <td className="py-3 pr-5 text-gray-400 whitespace-nowrap">
                    {s.onboarding_date ? new Date(s.onboarding_date).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'2-digit' }) : '—'}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="py-10 text-center text-gray-400 text-sm">No shops match your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filtered.length > 15 && (
          <div className="flex items-center justify-between mt-5 text-sm text-gray-500">
            <span>Showing {Math.min((page-1)*15+1, filtered.length)}–{Math.min(page*15, filtered.length)} of {filtered.length}</span>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}
                className="px-3 py-1.5 border rounded-lg disabled:opacity-40 hover:bg-gray-50">← Prev</button>
              <button onClick={() => setPage(p => p+1)} disabled={page*15 >= filtered.length}
                className="px-3 py-1.5 border rounded-lg disabled:opacity-40 hover:bg-gray-50">Next →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
