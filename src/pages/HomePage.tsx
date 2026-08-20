import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import JobCard from '../components/JobCard';
import CompanyCard from '../components/CompanyCard';
import { useApp } from '../context/AppContext';

const topCategories = [
  { name: 'Engineering', icon: '💻', count: 124 },
  { name: 'Design', icon: '🎨', count: 38 },
  { name: 'Data', icon: '📊', count: 52 },
  { name: 'Marketing', icon: '�', count: 41 },
  { name: 'Product', icon: '🚀', count: 27 },
  { name: 'Customer Success', icon: '🤝', count: 19 }
];

const stats = [
  { label: 'Active jobs', value: '12,400+' },
  { label: 'Companies', value: '850+' },
  { label: 'Candidates', value: '240K+' },
  { label: 'Hired this month', value: '1,820' }
];

export default function HomePage() {
  const { jobs } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const featuredJobs = jobs.filter(j => j.featured).slice(0, 6);
  const recentJobs = jobs.slice(0, 6);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/jobs?q=${encodeURIComponent(search)}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden hero-grid">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-16 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
          <div className="rise-in max-w-3xl">
            <div className="mono inline-flex items-center gap-2 text-xs uppercase tracking-[.2em] text-brand-700 mb-6">
              <span className="w-2 h-2 bg-brand-600 rounded-full animate-pulse" />
              2,400+ jobs added this week
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-[-.06em] text-slate-900 leading-[1.03]">
              Find work that feels like a <span className="text-brand-600">step forward.</span>
            </h1>
            <p className="mt-6 text-base leading-7 text-slate-600 max-w-xl">
              Curated roles from India's most loved companies. Less noise, better signals, and a profile that actually sounds like you.
            </p>

            <form onSubmit={handleSearch} className="mt-8 max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-2 glass-dark rounded-2xl shadow-xl shadow-blue-900/10 p-2">
                <div className="flex-1 relative">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                  </svg>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Job title, skill, or company"
                    className="w-full pl-12 pr-4 py-3 bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition shadow-sm"
                >
                  Search jobs
                </button>
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
                <span className="text-slate-500">Try:</span>
                {['React', 'Product Manager', 'Data Scientist', 'UX Designer'].map(t => (
                  <button
                    key={t}
                    onClick={() => { setSearch(t); navigate(`/jobs?q=${encodeURIComponent(t)}`); }}
                    className="px-2.5 py-1 bg-white/80 hover:bg-white text-slate-700 rounded-full border border-slate-200"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </form>
          </div>
          <div className="perspective-stage hidden lg:block rise-in">
              <div className="float-panel glass-dark relative mx-auto max-w-md rounded-[2rem] p-5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4"><span className="mono text-[10px] tracking-[.2em] text-slate-500">YOUR NEXT ROLE</span><span className="rounded-full bg-brand-50 px-2 py-1 text-[10px] text-brand-700">LIVE MATCH</span></div>
              <div className="mt-7 flex items-center gap-4"><div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-blue-100 to-blue-300 text-xl font-extrabold text-brand-700">S</div><div><div className="text-xl font-bold text-slate-900">Senior Frontend</div><div className="text-sm text-slate-500">Stripe · Bengaluru</div></div></div>
              <div className="mt-7 grid grid-cols-3 gap-2 text-center"><div className="rounded-xl bg-slate-100 p-3"><div className="text-sm font-bold text-slate-900">92%</div><div className="mt-1 text-[10px] text-slate-500">match</div></div><div className="rounded-xl bg-blue-50 p-3"><div className="text-sm font-bold text-brand-700">₹55L</div><div className="mt-1 text-[10px] text-slate-500">top range</div></div><div className="rounded-xl bg-slate-100 p-3"><div className="text-sm font-bold text-slate-900">2d</div><div className="mt-1 text-[10px] text-slate-500">posted</div></div></div>
              <div className="mt-5 flex items-center justify-between text-xs text-slate-500"><span>React · TypeScript · GraphQL</span><span className="text-brand-700">View role →</span></div>
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/10 bg-[#0d121a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white">{s.value}</div>
                <div className="text-sm text-slate-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="mono text-xs uppercase tracking-[.2em] text-slate-500">EXPLORE THE FIELD</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2">Find your corner of the future</h2>
          </div>
          <Link to="/jobs" className="hidden sm:inline-flex text-sm font-semibold text-brand-700 hover:text-brand-800">
            View all jobs →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {topCategories.map(c => (
            <Link
              key={c.name}
              to={`/jobs?category=${encodeURIComponent(c.name)}`}
              className="group depth-card bg-[#10161f] border border-white/10 rounded-2xl p-5 text-center transition-all"
            >
              <div className="text-3xl mb-2">{c.icon}</div>
              <div className="font-semibold text-white group-hover:text-[#73efc8] text-sm">{c.name}</div>
              <div className="text-xs text-slate-500 mt-0.5">{c.count} jobs</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured jobs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold uppercase rounded mb-2">
              ⭐ Featured
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Hand-picked opportunities</h2>
            <p className="text-slate-500 mt-1">Roles our team loves</p>
          </div>
          <Link to="/jobs" className="text-sm font-semibold text-brand-700 hover:text-brand-800">
            See all →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featuredJobs.map(j => <JobCard key={j.id} job={j} />)}
        </div>
      </section>

      {/* Latest jobs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Fresh opportunities</h2>
          <Link to="/jobs" className="text-sm font-semibold text-brand-700 hover:text-brand-800">
            Browse all →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentJobs.map(j => <JobCard key={j.id} job={j} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="relative overflow-hidden bg-[#10161f] border border-[#73efc8]/25 rounded-3xl p-8 sm:p-12 text-white">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="relative max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold">Ready to take the next step?</h2>
            <p className="mt-3 text-slate-400">Build a profile, upload your resume, and get matched with roles that fit your skills.</p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                to="/register"
                className="inline-flex justify-center items-center gap-2 px-6 py-3 bg-[#73efc8] text-[#09221d] font-semibold rounded-xl hover:bg-[#9af6d8] transition"
              >
                Create free profile
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <Link
                to="/jobs"
                className="inline-flex justify-center items-center px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold rounded-xl transition"
              >
                Keep browsing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
