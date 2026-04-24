import { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const CATEGORY_META = {
  financial:   { label: 'Financial',   icon: '💰', color: 'bg-blue-50   text-blue-600   border-blue-200' },
  legal:       { label: 'Legal',       icon: '⚖️', color: 'bg-purple-50 text-purple-600 border-purple-200' },
  compliance:  { label: 'Compliance',  icon: '🛡️', color: 'bg-amber-50  text-amber-600  border-amber-200' },
  operations:  { label: 'Operations',  icon: '⚙️', color: 'bg-green-50  text-green-600  border-green-200' },
  governance:  { label: 'Governance',  icon: '🏛️', color: 'bg-gray-50   text-gray-600   border-gray-200' },
};

const STATUS_OPTIONS = [
  { value: 'pending',     label: 'Pending',     color: 'text-gray-400'  },
  { value: 'in_progress', label: 'In Progress', color: 'text-amber-500' },
  { value: 'completed',   label: 'Completed',   color: 'text-green-600' },
  { value: 'na',          label: 'N/A',         color: 'text-gray-300'  },
];

const statusIcon = { pending: '○', in_progress: '◑', completed: '●', na: '—' };

export default function IPOTracker() {
  const { user } = useAuth();
  const [shopId,    setShopId]    = useState(null);
  const [data,      setData]      = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [updating,  setUpdating]  = useState(null);
  const [error,     setError]     = useState('');
  const [expanded,  setExpanded]  = useState({});

  useEffect(() => {
    (async () => {
      try {
        const { data: shopsData } = await api.get('/api/shops');
        const id = shopsData.shops[0]?.id;
        if (!id) { setLoading(false); return; }
        setShopId(id);
        const { data: ipoData } = await api.get(`/api/shops/${id}/ipo`);
        setData(ipoData);
        // Expand all categories by default
        const exp = {};
        Object.keys(ipoData.checklist).forEach(k => exp[k] = true);
        setExpanded(exp);
      } catch (e) { setError('Failed to load IPO tracker.'); }
      finally { setLoading(false); }
    })();
  }, []);

  const updateStatus = async (itemId, newStatus, notes) => {
    setUpdating(itemId);
    try {
      await api.put(`/api/shops/${shopId}/ipo/${itemId}`, { status: newStatus, notes });
      // Refresh
      const { data: ipoData } = await api.get(`/api/shops/${shopId}/ipo`);
      setData(ipoData);
    } catch (e) { setError('Failed to update item.'); }
    finally { setUpdating(null); }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-500" />
    </div>
  );
  if (error)  return <div className="text-red-600 text-sm">{error}</div>;
  if (!data)  return (
    <div className="text-center py-24 text-gray-400 text-sm">No IPO checklist available yet.</div>
  );

  const { checklist, score, total, completed } = data;
  const scoreColor = score >= 80 ? 'text-green-600' : score >= 50 ? 'text-amber-500' : 'text-red-500';
  const trackColor = score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-amber-400' : 'bg-red-400';

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">🚀 IPO Readiness Tracker</h2>
        <p className="text-sm text-gray-500 mt-1">
          Track your compliance across financial, legal, and governance requirements.
        </p>
      </div>

      {/* Score card */}
      <div className="card bg-gradient-to-br from-[#0D1B2A] to-[#1A3A52] text-white">
        <div className="flex items-center justify-between flex-wrap gap-6">
          <div>
            <p className="text-sm text-gray-300 mb-1">IPO Readiness Score</p>
            <p className={`text-6xl font-extrabold ${scoreColor}`}>{score}<span className="text-2xl">%</span></p>
            <p className="text-sm text-gray-300 mt-2">{completed} of {total} items completed</p>
          </div>
          <div className="flex-1 min-w-48">
            <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
              <div className={`${trackColor} h-3 rounded-full transition-all duration-500`}
                   style={{ width: `${score}%` }} />
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {STATUS_OPTIONS.map(s => {
                const count = Object.values(checklist).flat().filter(i => i.status === s.value).length;
                return (
                  <div key={s.value} className="bg-white/10 rounded-lg px-3 py-2">
                    <span className="text-gray-300 text-xs">{s.label}</span>
                    <p className="text-white font-bold">{count}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="text-right text-sm text-gray-300">
            <p className="font-semibold text-white text-lg mb-1">
              {score >= 80 ? '✅ IPO Ready' : score >= 50 ? '⏳ In Progress' : '🔴 Early Stage'}
            </p>
            <p>{score >= 80 ? 'Ready for underwriter introduction' :
                score >= 50 ? 'Keep completing checklist items' :
                'Start with financial & legal items'}</p>
          </div>
        </div>
      </div>

      {/* Checklist by category */}
      {Object.entries(checklist).map(([cat, items]) => {
        const meta = CATEGORY_META[cat] || { label: cat, icon: '📋', color: 'bg-gray-50 text-gray-600 border-gray-200' };
        const catDone   = items.filter(i => i.status === 'completed').length;
        const catScore  = Math.round((catDone / items.length) * 100);
        const isOpen    = expanded[cat] !== false;

        return (
          <div key={cat} className="card">
            {/* Category header */}
            <button
              className="w-full flex items-center justify-between text-left"
              onClick={() => setExpanded(e => ({ ...e, [cat]: !e[cat] }))}>
              <div className="flex items-center gap-3">
                <span className={`w-10 h-10 rounded-xl flex items-center justify-center border ${meta.color}`}>
                  {meta.icon}
                </span>
                <div>
                  <p className="font-semibold text-gray-900">{meta.label}</p>
                  <p className="text-xs text-gray-400">{catDone}/{items.length} completed · {catScore}%</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-24 bg-gray-100 rounded-full h-1.5">
                  <div className="bg-teal-500 h-1.5 rounded-full transition-all duration-300"
                       style={{ width: `${catScore}%` }} />
                </div>
                <span className="text-gray-400 text-sm">{isOpen ? '▲' : '▼'}</span>
              </div>
            </button>

            {/* Items */}
            {isOpen && (
              <div className="mt-5 space-y-3">
                {items.map(item => (
                  <div key={item.id}
                    className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${
                      item.status === 'completed' ? 'bg-green-50 border-green-100' :
                      item.status === 'in_progress' ? 'bg-amber-50 border-amber-100' :
                      'bg-gray-50 border-gray-100'
                    }`}>
                    <span className={`text-lg mt-0.5 flex-shrink-0 ${
                      item.status === 'completed' ? 'text-green-500' :
                      item.status === 'in_progress' ? 'text-amber-500' : 'text-gray-300'
                    }`}>
                      {statusIcon[item.status]}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${
                        item.status === 'completed' ? 'text-green-800 line-through' : 'text-gray-800'
                      }`}>{item.item}</p>
                      {item.notes && (
                        <p className="text-xs text-gray-500 mt-0.5">{item.notes}</p>
                      )}
                      {item.due_date && (
                        <p className="text-xs text-amber-600 mt-0.5">
                          Due: {new Date(item.due_date).toLocaleDateString('en-IN')}
                        </p>
                      )}
                    </div>
                    <select
                      value={item.status}
                      disabled={updating === item.id}
                      onChange={e => updateStatus(item.id, e.target.value, item.notes)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-teal-400 disabled:opacity-50 flex-shrink-0">
                      {STATUS_OPTIONS.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      <p className="text-xs text-gray-400 text-center pb-4">
        IPO checklist powered by ScaleShop AI · Based on SEBI SME IPO Framework
      </p>
    </div>
  );
}
