import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import JobCard from '../components/JobCard';
import JobFilters, { Filters } from '../components/JobFilters';
import { SkeletonCard } from '../components/Loader';
import { useApp } from '../context/AppContext';

export default function JobsPage() {
  const { jobs } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<'recent' | 'salary' | 'applicants'>('recent');
  const [filters, setFilters] = useState<Filters>({
    query: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    type: '',
    experience: '',
    remote: false,
    minSalary: 0
  });

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const next: Record<string, string> = {};
    if (filters.query) next.q = filters.query;
    if (filters.category) next.category = filters.category;
    setSearchParams(next, { replace: true });
  }, [filters.query, filters.category]);

  const categories = useMemo(() => Array.from(new Set(jobs.map(j => j.category))), [jobs]);

  const filtered = useMemo(() => {
    let list = jobs.filter(j => {
      if (filters.query) {
        const q = filters.query.toLowerCase();
        if (!j.title.toLowerCase().includes(q) &&
            !j.company.toLowerCase().includes(q) &&
            !j.skills.some(s => s.toLowerCase().includes(q))) return false;
      }
      if (filters.category && j.category !== filters.category) return false;
      if (filters.type && j.type !== filters.type) return false;
      if (filters.experience && j.experience !== filters.experience) return false;
      if (filters.remote && !j.remote) return false;
      if (j.salaryMin < filters.minSalary) return false;
      return true;
    });
    if (sort === 'salary') list = [...list].sort((a, b) => b.salaryMax - a.salaryMax);
    else if (sort === 'applicants') list = [...list].sort((a, b) => a.applicants - b.applicants);
    else list = [...list].sort((a, b) => a.postedDays - b.postedDays);
    return list;
  }, [jobs, filters, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Find your next role</h1>
        <p className="text-slate-500 mt-1">{filtered.length} jobs match your preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
        <aside>
          <JobFilters filters={filters} setFilters={setFilters} categories={categories} totalJobs={filtered.length} />
        </aside>

        <main>
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-slate-600">
              Showing <span className="font-semibold text-slate-900">{filtered.length}</span> jobs
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-brand-500 bg-white"
            >
              <option value="recent">Most recent</option>
              <option value="salary">Highest salary</option>
              <option value="applicants">Fewest applicants</option>
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
              <div className="text-5xl mb-3">🔍</div>
              <h3 className="font-semibold text-slate-900">No jobs found</h3>
              <p className="text-sm text-slate-500 mt-1">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filtered.map(j => <JobCard key={j.id} job={j} />)}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
