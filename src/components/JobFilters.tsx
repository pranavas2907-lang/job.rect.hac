import { useState } from 'react';

interface Filters {
  query: string;
  category: string;
  type: string;
  experience: string;
  remote: boolean;
  minSalary: number;
}

interface Props {
  filters: Filters;
  setFilters: (f: Filters) => void;
  categories: string[];
  totalJobs: number;
}

export default function JobFilters({ filters, setFilters, categories, totalJobs }: Props) {
  const [open, setOpen] = useState(false);

  const update = <K extends keyof Filters>(k: K, v: Filters[K]) => setFilters({ ...filters, [k]: v });
  const reset = () => setFilters({
    query: '', category: '', type: '', experience: '', remote: false, minSalary: 0
  });

  const activeCount = [
    filters.category, filters.type, filters.experience, filters.remote, filters.minSalary > 0
  ].filter(Boolean).length;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-semibold text-slate-900">Filter jobs</h2>
          <p className="text-xs text-slate-500">{totalJobs} jobs match</p>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg hover:bg-slate-100"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M6 12h12M10 18h4"/>
          </svg>
        </button>
      </div>

      <div className={`space-y-4 ${open ? 'block' : 'hidden md:block'}`}>
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <input
            value={filters.query}
            onChange={(e) => update('query', e.target.value)}
            placeholder="Search jobs, companies..."
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600 mb-1.5 block">Category</label>
          <select
            value={filters.category}
            onChange={(e) => update('category', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-brand-500"
          >
            <option value="">All categories</option>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600 mb-1.5 block">Job type</label>
          <select
            value={filters.type}
            onChange={(e) => update('type', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-brand-500"
          >
            <option value="">All types</option>
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Contract</option>
            <option>Internship</option>
            <option>Remote</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600 mb-1.5 block">Experience</label>
          <select
            value={filters.experience}
            onChange={(e) => update('experience', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-brand-500"
          >
            <option value="">Any experience</option>
            <option>Fresher</option>
            <option>1-3 years</option>
            <option>3-5 years</option>
            <option>5-8 years</option>
            <option>8+ years</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600 mb-1.5 flex justify-between">
            <span>Min salary</span>
            <span className="text-brand-600 font-semibold">₹{filters.minSalary}{filters.minSalary >= 50 ? '+ LPA' : ' LPA'}</span>
          </label>
          <input
            type="range"
            min="0"
            max="50"
            step="5"
            value={filters.minSalary}
            onChange={(e) => update('minSalary', Number(e.target.value))}
            className="w-full accent-brand-600"
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.remote}
            onChange={(e) => update('remote', e.target.checked)}
            className="w-4 h-4 accent-brand-600"
          />
          <span className="text-sm text-slate-700">Remote only</span>
        </label>

        {activeCount > 0 && (
          <button
            onClick={reset}
            className="w-full py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
          >
            Clear filters ({activeCount})
          </button>
        )}
      </div>
    </div>
  );
}

export type { Filters };
