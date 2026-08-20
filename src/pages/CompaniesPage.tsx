import { useMemo, useState } from 'react';
import CompanyCard from '../components/CompanyCard';
import { companies } from '../data/companies';

export default function CompaniesPage() {
  const [query, setQuery] = useState('');
  const [industry, setIndustry] = useState('');

  const industries = useMemo(() => Array.from(new Set(companies.map(c => c.industry))), []);

  const filtered = companies.filter(c => {
    if (query && !c.name.toLowerCase().includes(query.toLowerCase())) return false;
    if (industry && c.industry !== industry) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Companies hiring now</h1>
        <p className="text-slate-500 mt-1">Explore India's most loved employers</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search companies..."
            className="w-full pl-10 pr-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-brand-500"
          />
        </div>
        <select
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-brand-500 bg-white"
        >
          <option value="">All industries</option>
          {industries.map(i => <option key={i}>{i}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(c => <CompanyCard key={c.id} company={c} />)}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <div className="text-5xl mb-3">🏢</div>
          <h3 className="font-semibold text-slate-900">No companies found</h3>
        </div>
      )}
    </div>
  );
}
