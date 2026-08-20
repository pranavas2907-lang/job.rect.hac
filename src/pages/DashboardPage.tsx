import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Job } from '../types';

const STATUS_STYLES: Record<string, string> = {
  Applied: 'bg-blue-50 text-blue-700 border-blue-200',
  'In Review': 'bg-amber-50 text-amber-700 border-amber-200',
  Shortlisted: 'bg-violet-50 text-violet-700 border-violet-200',
  Interview: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  Rejected: 'bg-rose-50 text-rose-700 border-rose-200',
  Offer: 'bg-emerald-50 text-emerald-700 border-emerald-200'
};

const STAGES = ['Applied', 'In Review', 'Shortlisted', 'Interview', 'Offer'] as const;

export default function DashboardPage() {
  const navigate = useNavigate();
  const { candidate, setCandidate, applications, jobs, savedJobs, applyToJob } = useApp();
  const [tab, setTab] = useState<'overview' | 'apps' | 'saved' | 'profile'>('overview');

  if (!candidate) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-white border border-slate-200 rounded-2xl p-12">
          <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-600 mx-auto flex items-center justify-center mb-4">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Sign in to view your dashboard</h2>
          <p className="text-slate-500 mt-2">Track applications, save jobs, and manage your profile.</p>
          <button onClick={() => navigate('/register')} className="mt-6 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-semibold">Create your profile</button>
        </div>
      </div>
    );
  }

  const appJobs: { job: Job; status: string; appliedAt: string }[] = applications
    .map(a => ({ job: jobs.find(j => j.id === a.jobId)!, ...a }))
    .filter(a => a.job);

  const savedJobObjs = jobs.filter(j => savedJobs.includes(j.id));

  const stats = {
    total: applications.length,
    inProgress: applications.filter(a => ['In Review', 'Shortlisted', 'Interview'].includes(a.status)).length,
    interviews: applications.filter(a => a.status === 'Interview').length,
    saved: savedJobs.length
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-violet-600 text-white flex items-center justify-center text-3xl font-bold shadow-md">
            {candidate.fullName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900">{candidate.fullName}</h1>
            <p className="text-slate-600">{candidate.headline}</p>
            <div className="flex flex-wrap gap-3 mt-2 text-sm text-slate-500">
              {candidate.location && <span className="inline-flex items-center gap-1">📍 {candidate.location}</span>}
              <span className="inline-flex items-center gap-1">✉ {candidate.email}</span>
              {candidate.resumeName && <span className="inline-flex items-center gap-1 text-emerald-700">📄 {candidate.resumeName}</span>}
            </div>
          </div>
          <button
            onClick={() => { setCandidate(null); navigate('/'); }}
            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total applications', value: stats.total, color: 'from-blue-500 to-blue-700' },
          { label: 'In progress', value: stats.inProgress, color: 'from-amber-500 to-orange-600' },
          { label: 'Interviews', value: stats.interviews, color: 'from-violet-500 to-violet-700' },
          { label: 'Saved jobs', value: stats.saved, color: 'from-emerald-500 to-emerald-700' }
        ].map(s => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} mb-3`} />
            <div className="text-2xl font-bold text-slate-900">{s.value}</div>
            <div className="text-sm text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="border-b border-slate-200 px-2 flex gap-1 overflow-x-auto scrollbar-hide">
          {[
            { k: 'overview', label: 'Overview' },
            { k: 'apps', label: `Applications (${stats.total})` },
            { k: 'saved', label: `Saved (${stats.saved})` },
            { k: 'profile', label: 'Profile' }
          ].map(t => (
            <button
              key={t.k}
              onClick={() => setTab(t.k as any)}
              className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition ${
                tab === t.k ? 'border-brand-600 text-brand-700' : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {tab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-semibold text-slate-900 mb-3">Your application pipeline</h2>
                <div className="flex gap-1 overflow-x-auto pb-2">
                  {STAGES.map((stage, i) => {
                    const count = applications.filter(a => a.status === stage).length;
                    return (
                      <div key={stage} className="flex-1 min-w-[120px]">
                        <div className="text-xs text-slate-500 mb-1">{stage}</div>
                        <div className="bg-slate-100 rounded-lg p-3">
                          <div className="text-2xl font-bold text-slate-900">{count}</div>
                          <div className="text-xs text-slate-500">jobs</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h2 className="font-semibold text-slate-900 mb-3">Recent activity</h2>
                {appJobs.length === 0 ? (
                  <div className="text-center py-8 bg-slate-50 rounded-xl">
                    <p className="text-slate-500">No applications yet</p>
                    <Link to="/jobs" className="mt-3 inline-block text-brand-700 font-semibold">Browse jobs →</Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {appJobs.slice(0, 3).map(({ job, status, appliedAt }) => (
                      <Link key={job.id} to={`/jobs/${job.id}`} className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center font-bold shrink-0">{job.companyLogo}</div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-900 truncate">{job.title}</div>
                          <div className="text-sm text-slate-500">{job.company} · applied {new Date(appliedAt).toLocaleDateString()}</div>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_STYLES[status]}`}>{status}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === 'apps' && (
            <div>
              {appJobs.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-3">📭</div>
                  <h3 className="font-semibold text-slate-900">No applications yet</h3>
                  <p className="text-slate-500 mt-1">Apply to jobs and track them here.</p>
                  <Link to="/jobs" className="mt-4 inline-block px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-semibold">Find jobs</Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {appJobs.map(({ job, status, appliedAt }) => (
                    <div key={job.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center font-bold shrink-0">{job.companyLogo}</div>
                      <div className="flex-1 min-w-0">
                        <Link to={`/jobs/${job.id}`} className="font-semibold text-slate-900 hover:text-brand-700">{job.title}</Link>
                        <div className="text-sm text-slate-500">{job.company} · {job.location}</div>
                        <div className="text-xs text-slate-400 mt-1">Applied {new Date(appliedAt).toLocaleDateString()}</div>
                      </div>
                      <span className={`self-start sm:self-center px-2.5 py-1 rounded-full text-xs font-semibold border ${STATUS_STYLES[status]}`}>{status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'saved' && (
            <div>
              {savedJobObjs.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-3">🔖</div>
                  <h3 className="font-semibold text-slate-900">No saved jobs yet</h3>
                  <p className="text-slate-500 mt-1">Bookmark interesting roles to revisit.</p>
                  <Link to="/jobs" className="mt-4 inline-block px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-semibold">Find jobs</Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedJobObjs.map(job => (
                    <Link key={job.id} to={`/jobs/${job.id}`} className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center font-bold shrink-0">{job.companyLogo}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-900 truncate">{job.title}</div>
                        <div className="text-sm text-slate-500">{job.company} · {job.location} · ₹{job.salaryMin}–{job.salaryMax} {job.currency}</div>
                      </div>
                      <button
                        onClick={(e) => { e.preventDefault(); applyToJob(job.id); }}
                        className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-semibold shrink-0"
                      >
                        Apply
                      </button>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'profile' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase mb-2">About</h3>
                <p className="text-slate-700">{candidate.about || 'No bio yet.'}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.length === 0 ? <span className="text-slate-500 text-sm">No skills listed</span> :
                    candidate.skills.map(s => <span key={s} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">{s}</span>)}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase mb-2">Resume</h3>
                {candidate.resumeName ? (
                  <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <svg className="w-5 h-5 text-emerald-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    <div className="flex-1"><div className="font-medium text-emerald-900">{candidate.resumeName}</div></div>
                    {candidate.resumeData && (
                      <a href={candidate.resumeData} download={candidate.resumeName} className="text-sm text-emerald-700 font-semibold hover:underline">Download</a>
                    )}
                  </div>
                ) : <p className="text-slate-500 text-sm">No resume uploaded</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

