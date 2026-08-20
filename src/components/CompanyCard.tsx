import { Link } from 'react-router-dom';
import { Company } from '../types';

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

export default function CompanyCard({ company }: { company: Company }) {
  return (
    <Link
      to={`/companies/${company.id}`}
      className="group bg-white border border-slate-200 hover:border-brand-300 rounded-2xl p-6 hover:shadow-xl hover:shadow-brand-500/5 transition-all"
    >
      <div className="flex items-start gap-4">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colorMap[company.logo] || 'from-brand-500 to-brand-700'} flex items-center justify-center text-white font-bold text-2xl shadow-md shrink-0`}>
          {company.logo}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 group-hover:text-brand-700 transition-colors truncate">
            {company.name}
          </h3>
          <p className="text-sm text-slate-500 mt-0.5">{company.industry}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1">
              <svg className="w-3.5 h-3.5 fill-amber-400" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <span className="font-medium text-slate-900">{company.rating}</span>
              <span>({company.reviews})</span>
            </span>
            <span>·</span>
            <span>{company.size} employees</span>
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-600 line-clamp-2">{company.about}</p>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
        <div className="text-xs text-slate-500">{company.location}</div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-50 text-brand-700 rounded-full text-xs font-semibold">
          <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse" />
          {company.openJobs} open jobs
        </div>
      </div>
    </Link>
  );
}
