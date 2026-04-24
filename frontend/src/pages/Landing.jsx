import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const features = [
  { icon: '📊', title: 'Live KPI Dashboard', desc: 'Revenue, inventory, customers — updated in real time. See what's driving growth and what's dragging it down.' },
  { icon: '🤖', title: 'AI Recommendations', desc: 'Personalised actions every week. Reduce overstock, capture peak-hour revenue, cut wasted spend.' },
  { icon: '🚀', title: 'IPO Readiness Tracker', desc: 'Step-by-step compliance checklist across financial, legal, and governance requirements. Know your IPO score today.' },
  { icon: '🔒', title: 'Secure & Compliant', desc: 'GST filing integration, audit-ready reports, and bank-grade data encryption for every shop on the platform.' },
];

const tiers = [
  { name: 'Basic', price: '₹10,000', desc: 'Small kirana & retail shops', features: ['Dashboard', 'AI recommendations', 'GST reports', 'Email support'] },
  { name: 'Growth', price: '₹25,000', highlight: true, desc: 'Multi-outlet & fast-growing shops', features: ['Everything in Basic', 'IPO Tracker (Lite)', 'Inventory automation', 'Priority support'] },
  { name: 'IPO Ready', price: '₹50,000', desc: 'Shops preparing for listing', features: ['Everything in Growth', 'Full IPO Tracker', 'SEBI compliance', 'Underwriter introductions'] },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-[#0D1B2A] text-white py-24 px-6 text-center">
        <p className="text-[#C9963A] font-semibold text-sm tracking-widest uppercase mb-4">
          India's AI-Powered SME Growth Platform
        </p>
        <h1 className="text-5xl font-extrabold max-w-3xl mx-auto leading-tight">
          From Corner Shop to Listed Company
        </h1>
        <p className="mt-6 text-gray-300 text-xl max-w-2xl mx-auto">
          ScaleShop AI gives every Indian kirana & SME owner the same intelligence that Fortune 500s use —
          to grow faster, reduce waste, and IPO-ready their business.
        </p>
        <div className="mt-10 flex justify-center gap-4 flex-wrap">
          <Link to="/login"
            className="bg-[#1A6B5E] hover:bg-teal-600 text-white font-semibold px-8 py-3.5 rounded-xl text-lg transition-colors">
            Start Free Trial
          </Link>
          <a href="#features"
            className="border border-gray-600 hover:border-gray-400 text-white font-semibold px-8 py-3.5 rounded-xl text-lg transition-colors">
            See How It Works
          </a>
        </div>
        <div className="mt-16 flex justify-center gap-12 text-center flex-wrap">
          {[['365+', 'Shops Onboarded'], ['₹91L', 'Projected MRR'], ['₹45Cr', 'Series A Target'], ['33x', 'Investor Return']].map(([v, l]) => (
            <div key={l}>
              <p className="text-3xl font-bold text-[#C9963A]">{v}</p>
              <p className="text-sm text-gray-400 mt-1">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 max-w-6xl mx-auto">
        <h2 className="text-center text-3xl font-bold text-gray-900 mb-4">Everything a shop needs to scale</h2>
        <p className="text-center text-gray-500 mb-14 max-w-xl mx-auto">
          One platform. Real AI. Built for the 63 million Indian SMEs that deserve better tools.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map(f => (
            <div key={f.title} className="card hover:shadow-md transition-shadow">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-gray-50 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-3xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h2>
          <p className="text-center text-gray-500 mb-14">Monthly SaaS. No hidden fees. Cancel anytime.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map(t => (
              <div key={t.name}
                className={`rounded-2xl p-8 ${t.highlight
                  ? 'bg-[#0D1B2A] text-white ring-2 ring-[#C9963A]'
                  : 'bg-white border border-gray-100 shadow-sm'}`}>
                {t.highlight && (
                  <span className="text-xs bg-[#C9963A] text-white px-3 py-1 rounded-full font-semibold mb-4 inline-block">
                    Most Popular
                  </span>
                )}
                <h3 className={`text-xl font-bold mb-1 ${t.highlight ? 'text-white' : 'text-gray-900'}`}>{t.name}</h3>
                <p className={`text-sm mb-4 ${t.highlight ? 'text-gray-300' : 'text-gray-500'}`}>{t.desc}</p>
                <p className={`text-3xl font-extrabold mb-6 ${t.highlight ? 'text-[#C9963A]' : 'text-gray-900'}`}>
                  {t.price}<span className="text-sm font-normal">/mo</span>
                </p>
                <ul className="space-y-3 mb-8">
                  {t.features.map(f => (
                    <li key={f} className={`text-sm flex items-center gap-2 ${t.highlight ? 'text-gray-200' : 'text-gray-600'}`}>
                      <span className="text-green-400">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link to="/login"
                  className={`block text-center py-3 rounded-xl font-semibold transition-colors ${t.highlight
                    ? 'bg-[#1A6B5E] hover:bg-teal-600 text-white'
                    : 'border border-gray-200 hover:bg-gray-50 text-gray-700'}`}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center bg-[#1A6B5E]">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to scale your shop?</h2>
        <p className="text-teal-100 mb-8 max-w-lg mx-auto">
          Join hundreds of shop owners already using ScaleShop AI to grow revenue and prepare for the future.
        </p>
        <Link to="/login"
          className="inline-block bg-[#C9963A] hover:bg-amber-600 text-white font-bold px-10 py-4 rounded-xl text-lg transition-colors">
          Start Your Free Trial →
        </Link>
      </section>

      <footer className="bg-[#0D1B2A] text-gray-400 py-8 text-center text-sm">
        © 2025 ScaleShop AI · Prathap Velavaluri, CEO · prathap051539@gmail.com
      </footer>
    </div>
  );
}
