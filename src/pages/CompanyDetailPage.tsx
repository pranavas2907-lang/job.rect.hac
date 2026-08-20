import { Link, useParams } from 'react-router-dom';
import { companies } from '../data/companies';
import { useApp } from '../context/AppContext';
import JobCard from '../components/JobCard';

const colorMap: Record<string, string> = {
  S: 'from-violet-500 to-violet-700',
  R: 'from-blue-500 to-blue-700',
  Z: 'from-emerald-500 to-emerald-700',
  C: 'from-slate-700 to-slate-900',
  L: 'from-pink-500 to-rose-600',
  P: 'from-indigo-500 to-indigo-700',
  N: 'from-slate-500 to-slate-700',
  F: 'from-orange-500 to-orange-700'
};

export default function CompanyDetailPage() {
  const { id } = useParams();
  const { jobs } = useApp();
  const company = companies.find(c => c.id === id);
  if (!company) return <div className="max-w-3xl mx-auto px-4 py-20 text-center"><h2 className="text-2xl font-bold">Company not found</h2></div>;

  const companyJobs = jobs.filter(j => j.companyId === company.id);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/companies" className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900 mb-4">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
        Back to companies
      </Link>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className={`h-32 bg-gradient-to-r ${colorMap[company.logo] || 'from-brand-500 to-brand-700'} relative`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent)]" />
        </div>
        <div className="p-6 sm:p-8 -mt-12">
          <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${colorMap[company.logo]} flex items-center justify-center text-white font-bold text-4xl shadow-xl border-4 border-white`}>
            {company.logo}
          </div>
          <div className="mt-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{company.name}</h1>
              <p className="text-slate-500 mt-1">{company.industry} · {company.location}</p>
              <div className="flex items-center gap-3 mt-3 text-sm">
                <span className="inline-flex items-center gap-1">
                  <svg className="w-4 h-4 fill-amber-400" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <span className="font-semibold">{company.rating}</span>
                  <span className="text-slate-500">({company.reviews} reviews)</span>
                </span>
                <span className="text-slate-500">{company.followers} followers</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-slate-200 rounded-lg font-semibold text-sm hover:bg-slate-50">+ Follow</button>
              <button className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-semibold text-sm">Visit website</button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
            <div><div className="text-xs text-slate-500">Founded</div><div className="font-semibold text-slate-900">{company.founded}</div></div>
            <div><div className="text-xs text-slate-500">Company size</div><div className="font-semibold text-slate-900">{company.size}</div></div>
            <div><div className="text-xs text-slate-500">Open jobs</div><div className="font-semibold text-slate-900">{company.openJobs}</div></div>
            <div><div className="text-xs text-slate-500">Industry</div><div className="font-semibold text-slate-900">{company.industry}</div></div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <h3 className="font-semibold text-slate-900 mb-2">About</h3>
            <p className="text-slate-700 leading-relaxed">{company.about}</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Open positions at {company.name}</h2>
        {companyJobs.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-slate-500">No openings right now — check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {companyJobs.map(j => <JobCard key={j.id} job={j} />)}
          </div>
        )}
      </div>
    </div>
  );
}
