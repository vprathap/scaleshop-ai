export default function StatCard({ label, value, sub, delta, icon, color = 'teal' }) {
  const colors = {
    teal:   'bg-teal-50 text-teal-600',
    gold:   'bg-amber-50 text-amber-600',
    navy:   'bg-slate-100 text-slate-600',
    red:    'bg-red-50 text-red-600',
    green:  'bg-green-50 text-green-600',
  };
  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500 font-medium">{label}</span>
        {icon && (
          <span className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${colors[color]}`}>
            {icon}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {sub   && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
        {delta != null && (
          <p className={`text-xs font-medium mt-1 ${parseFloat(delta) >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {parseFloat(delta) >= 0 ? '▲' : '▼'} {Math.abs(delta)}% vs last month
          </p>
        )}
      </div>
    </div>
  );
}
