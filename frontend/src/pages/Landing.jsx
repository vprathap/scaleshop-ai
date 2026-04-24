import { Link } from 'react-router-dom';
import { useState } from 'react';

const STATS = [
  { value: '365+', label: 'Shops Onboarded' },
  { value: '₹91L', label: 'Projected MRR' },
  { value: '₹45Cr', label: 'Series A Target' },
  { value: '33x',   label: 'Investor Return' },
];

const FEATURES = [
  { icon: '📊', title: 'Live KPI Dashboard',     desc: "Revenue, inventory, customers — updated in real time. See what's driving growth and what's dragging it down.", color: 'from-teal-500 to-emerald-600' },
  { icon: '🤖', title: 'AI Recommendations',     desc: 'Personalised weekly actions. Reduce overstock, capture peak-hour revenue, cut wasted spend automatically.',   color: 'from-violet-500 to-purple-600' },
  { icon: '🚀', title: 'IPO Readiness Tracker',  desc: 'Step-by-step compliance checklist across financial, legal, and governance requirements. Know your IPO score today.', color: 'from-amber-500 to-orange-600' },
  { icon: '🔒', title: 'Secure & Compliant',     desc: 'GST filing integration, audit-ready reports, and bank-grade data encryption for every shop on the platform.',  color: 'from-blue-500 to-indigo-600' },
  { icon: '📦', title: 'Inventory Intelligence', desc: 'Predict demand, prevent stockouts, and automate reorder alerts before you run out of your best-sellers.',        color: 'from-pink-500 to-rose-600' },
  { icon: '📈', title: 'Growth Analytics',        desc: 'Track MoM growth, cohort retention, and customer lifetime value — the metrics that matter most to investors.',   color: 'from-cyan-500 to-teal-600' },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Connect your shop',       desc: 'Sign up in minutes. Add your shop details and start the guided onboarding.' },
  { step: '02', title: 'AI analyses your data',   desc: 'Our engine scans your revenue, inventory, and compliance gaps — instantly.' },
  { step: '03', title: 'Grow toward IPO',         desc: 'Follow weekly AI actions, track your IPO score, and watch your business scale.' },
];

const TESTIMONIALS = [
  { quote: "ScaleShop AI helped us identify ₹4L in monthly savings we were completely missing. Our IPO score went from 42 to 79 in six months.", name: 'Ravi Kumar',   role: 'Owner, Ravi Kirana Store, Hyderabad', avatar: 'RK' },
  { quote: "The dashboard is like having a CFO at my side. I now walk into investor meetings with confidence — real numbers, real story.",          name: 'Priya Menon',  role: 'Founder, MediFirst Pharmacy, Chennai',  avatar: 'PM' },
  { quote: "We grew 3 outlets to 11 in 18 months using ScaleShop's expansion analytics. The ROI is genuinely unbelievable.",                       name: 'Arjun Sharma', role: 'CEO, QuickMart Chain, Delhi',           avatar: 'AS' },
];

const TIERS = [
  { name: 'Basic',    price: '₹10,000', desc: 'Perfect for single-outlet kirana & retail shops',  features: ['Live KPI Dashboard', 'AI Recommendations', 'GST Reports', 'Mobile App', 'Email Support'],                                         cta: 'Start Free Trial', highlight: false },
  { name: 'Growth',   price: '₹25,000', desc: 'For multi-outlet and fast-scaling shops',           features: ['Everything in Basic', 'IPO Tracker (Lite)', 'Inventory Automation', 'Customer Analytics', 'Priority Support'],                    cta: 'Start Free Trial', highlight: true,  badge: 'Most Popular' },
  { name: 'IPO Ready',price: '₹50,000', desc: 'Full compliance suite for shops preparing to list', features: ['Everything in Growth', 'Full IPO Tracker', 'SEBI Compliance Docs', 'Underwriter Introductions', 'Dedicated CSM'], cta: 'Talk to Sales',   highlight: false },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* ── Navbar ──────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0D1B2A]/95 backdrop-blur-sm border-b border-gray-800">
        <div className="page-container">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl font-extrabold text-white">
                <span className="text-[#C9963A]">Scale</span>Shop
              </span>
              <span className="text-[10px] bg-[#1A6B5E] text-white px-2 py-0.5 rounded-full font-semibold tracking-wide">AI</span>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              {['Features', 'Pricing'].map(l => (
                <a key={l} href={`#${l.toLowerCase()}`}
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors">{l}</a>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors hidden md:block">Sign In</Link>
              <Link to="/login" className="btn-gold text-sm py-2 px-4 rounded-lg">Start Free Trial</Link>
            </div>
          </div>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────── */}
      <section className="bg-[#0D1B2A] pt-16 relative overflow-hidden">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-32 right-1/4 w-80 h-80 bg-amber-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="page-container py-28 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#1A6B5E]/20 border border-[#1A6B5E]/30 text-emerald-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            India's #1 AI-Powered SME Growth Platform
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white max-w-4xl mx-auto leading-[1.1] tracking-tight">
            From Corner Shop<br />
            <span className="bg-gradient-to-r from-[#C9963A] to-amber-400 bg-clip-text text-transparent">
              to Listed Company
            </span>
          </h1>
          <p className="mt-8 text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            ScaleShop AI gives every Indian kirana &amp; SME owner the same intelligence
            that Fortune 500s use — to grow faster, cut waste, and get IPO-ready.
          </p>
          <div className="mt-10 flex justify-center gap-4 flex-wrap">
            <Link to="/login"
              className="bg-[#1A6B5E] hover:bg-teal-600 text-white font-bold px-8 py-4 rounded-xl text-base transition-all shadow-lg hover:-translate-y-0.5">
              Start Free Trial →
            </Link>
            <a href="#features"
              className="border border-gray-600 hover:border-gray-400 text-gray-200 font-semibold px-8 py-4 rounded-xl text-base transition-all hover:bg-white/5">
              See How It Works
            </a>
          </div>

          {/* Stats bar */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {STATS.map(({ value, label }) => (
              <div key={label} className="bg-white/5 border border-white/10 rounded-2xl py-5 px-4">
                <p className="text-3xl font-extrabold text-[#C9963A]">{value}</p>
                <p className="text-xs text-gray-400 mt-1.5 font-medium">{label}</p>
              </div>
            ))}
          </div>

          {/* Dashboard mockup */}
          <div className="mt-16 max-w-5xl mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-3 shadow-2xl">
              <div className="bg-[#111d2b] rounded-2xl p-6 text-left">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-3 h-3 bg-red-500 rounded-full" /><div className="w-3 h-3 bg-yellow-500 rounded-full" /><div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="ml-3 text-xs text-gray-500">scaleshop.ai/dashboard</span>
                </div>
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Monthly Revenue', val: '₹8.4L',    delta: '+12%' },
                    { label: 'AI Savings',       val: '₹42K',     delta: '+8%'  },
                    { label: 'Customers',        val: '1,247',    delta: '+5%'  },
                    { label: 'IPO Score',        val: '79/100',   delta: '+7pts'},
                  ].map(k => (
                    <div key={k.label} className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <p className="text-xs text-gray-500 mb-1">{k.label}</p>
                      <p className="text-lg font-bold text-white">{k.val}</p>
                      <p className="text-xs text-emerald-400 mt-1">{k.delta} this month</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-4 h-28 flex items-end gap-1">
                    {[40,55,45,70,60,80,75,90,85,95,88,100].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t-sm"
                        style={{ height: `${h}%`, background: i===11 ? '#C9963A' : '#1A6B5E', opacity: 0.7+i*0.025 }} />
                    ))}
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
                    {['Reduce overstock','Run Sunday promo','File GST return'].map((r,i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-amber-400 rounded-full flex-shrink-0" />
                        <span className="text-xs text-gray-400">{r}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────── */}
      <section id="features" className="py-28 bg-white">
        <div className="page-container">
          <div className="text-center mb-16">
            <p className="text-[#1A6B5E] font-semibold text-sm tracking-widest uppercase mb-3">Features</p>
            <h2 className="section-title">Everything a shop needs to scale</h2>
            <p className="text-gray-500 text-lg mt-4 max-w-2xl mx-auto">One platform. Real AI. Built for the 63 million Indian SMEs that deserve better tools.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(f => (
              <div key={f.title}
                className="rounded-2xl border border-gray-100 p-7 hover:border-teal-100 hover:shadow-lg transition-all duration-300 bg-white">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center text-xl mb-5 shadow-sm`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────── */}
      <section className="py-28 bg-gray-50">
        <div className="page-container">
          <div className="text-center mb-16">
            <p className="text-[#1A6B5E] font-semibold text-sm tracking-widest uppercase mb-3">How It Works</p>
            <h2 className="section-title">Up and running in 10 minutes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {HOW_IT_WORKS.map((s, idx) => (
              <div key={s.step} className="text-center">
                <div className="w-16 h-16 bg-[#0D1B2A] text-[#C9963A] text-xl font-extrabold rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                  {s.step}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────── */}
      <section className="py-28 bg-white">
        <div className="page-container">
          <div className="text-center mb-16">
            <p className="text-[#1A6B5E] font-semibold text-sm tracking-widest uppercase mb-3">Testimonials</p>
            <h2 className="section-title">Shop owners love ScaleShop AI</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="bg-gray-50 border border-gray-100 rounded-2xl p-7 hover:shadow-md transition-shadow">
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, i) => <span key={i} className="text-[#C9963A] text-sm">★</span>)}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-6 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#0D1B2A] text-[#C9963A] rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ─────────────────────────────────── */}
      <section id="pricing" className="py-28 bg-[#0D1B2A]">
        <div className="page-container">
          <div className="text-center mb-16">
            <p className="text-[#C9963A] font-semibold text-sm tracking-widest uppercase mb-3">Pricing</p>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Simple, transparent pricing</h2>
            <p className="text-gray-400 mt-3">Monthly SaaS. No hidden fees. Cancel anytime.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {TIERS.map(t => (
              <div key={t.name}
                className={`relative rounded-2xl p-8 transition-all ${
                  t.highlight
                    ? 'bg-[#1A6B5E] ring-2 ring-[#C9963A] shadow-2xl scale-[1.03]'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                }`}>
                {t.badge && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#C9963A] text-white text-xs font-bold px-4 py-1 rounded-full shadow">
                    {t.badge}
                  </span>
                )}
                <h3 className="text-xl font-bold text-white mb-1">{t.name}</h3>
                <p className="text-sm text-gray-300 mb-5">{t.desc}</p>
                <p className="text-4xl font-extrabold text-[#C9963A] mb-1">
                  {t.price}<span className="text-sm font-normal text-gray-400">/mo</span>
                </p>
                <ul className="space-y-3 my-8">
                  {t.features.map(f => (
                    <li key={f} className="text-sm text-gray-200 flex items-center gap-2.5">
                      <span className="text-emerald-400 text-base">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link to="/login"
                  className={`block text-center py-3 rounded-xl font-semibold text-sm transition-all ${
                    t.highlight
                      ? 'bg-[#C9963A] hover:bg-amber-500 text-white shadow-md'
                      : 'border border-white/20 hover:bg-white/10 text-white'
                  }`}>
                  {t.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────── */}
      <section className="py-28 bg-gradient-to-br from-[#1A6B5E] to-teal-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="page-container text-center relative z-10">
          <h2 className="text-4xl font-extrabold text-white mb-5">Ready to scale your shop?</h2>
          <p className="text-teal-100 text-lg mb-10 max-w-lg mx-auto">
            Join hundreds of shop owners already using ScaleShop AI to grow revenue and prepare for the future.
          </p>
          <Link to="/login"
            className="inline-block bg-[#C9963A] hover:bg-amber-500 text-white font-bold px-12 py-5 rounded-xl text-lg transition-all shadow-xl hover:-translate-y-0.5">
            Start Your Free Trial →
          </Link>
          <p className="text-teal-200 text-sm mt-5">No credit card required · Setup in 10 minutes</p>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────── */}
      <footer className="bg-[#0D1B2A] border-t border-gray-800 py-12">
        <div className="page-container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold text-white"><span className="text-[#C9963A]">Scale</span>Shop</span>
              <span className="text-[10px] bg-[#1A6B5E] text-white px-2 py-0.5 rounded-full font-semibold">AI</span>
            </div>
            <p className="text-sm text-gray-500">© 2025 ScaleShop AI · Prathap Velavaluri, CEO · prathap051539@gmail.com</p>
            <div className="flex gap-6 text-sm text-gray-500">
              <a href="#features" className="hover:text-gray-300 transition-colors">Features</a>
              <a href="#pricing"  className="hover:text-gray-300 transition-colors">Pricing</a>
              <Link to="/login"   className="hover:text-gray-300 transition-colors">Login</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
