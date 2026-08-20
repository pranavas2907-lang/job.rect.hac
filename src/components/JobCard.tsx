import { Link } from 'react-router-dom';
import { Job } from '../types';
import { useApp } from '../context/AppContext';

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

export default function JobCard({ job }: { job: Job }) {
  const { savedJobs, toggleSaveJob } = useApp();
  const isSaved = savedJobs.includes(job.id);

  return (
    <Link
      to={`/jobs/${job.id}`}
      className="group depth-card block bg-white border border-slate-200 rounded-2xl p-5 transition-all duration-300 animate-fade-in"
    >
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[job.companyLogo] || 'from-brand-500 to-brand-700'} flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-md`}>
          {job.companyLogo}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900 group-hover:text-brand-700 transition-colors truncate">
                {job.title}
              </h3>
              <p className="text-sm text-slate-500 mt-0.5">{job.company}</p>
            </div>
            <button
              onClick={(e) => { e.preventDefault(); toggleSaveJob(job.id); }}
              className="p-1.5 rounded-lg hover:bg-slate-100 shrink-0"
              aria-label="save"
            >
              <svg className={`w-5 h-5 transition-colors ${isSaved ? 'fill-brand-600 stroke-brand-600' : 'stroke-slate-400'}`} viewBox="0 0 24 24" fill={isSaved ? 'currentColor' : 'none'} strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {job.location}
            </span>
            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">{job.type}</span>
            <span className="px-2 py-1 bg-violet-50 text-violet-700 rounded-md text-xs font-medium">{job.experience}</span>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-900">
                ₹{job.salaryMin}–{job.salaryMax} {job.currency}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                {job.postedDays === 0 ? 'Today' : `${job.postedDays}d ago`} · {job.applicants} applicants
              </div>
            </div>
            {job.featured && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold uppercase tracking-wide rounded">
                Featured
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
