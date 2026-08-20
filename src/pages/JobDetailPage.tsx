import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import JobCard from '../components/JobCard';

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobs, savedJobs, toggleSaveJob, applications, applyToJob, candidate } = useApp();
  const job = jobs.find(j => j.id === id);
  const [showApplyModal, setShowApplyModal] = useState(false);

  if (!job) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900">Job not found</h2>
        <Link to="/jobs" className="mt-4 inline-block text-brand-700">← Back to jobs</Link>
      </div>
    );
  }

  const isSaved = savedJobs.includes(job.id);
  const hasApplied = applications.some(a => a.jobId === job.id);
  const relatedJobs = jobs.filter(j => j.id !== job.id && j.category === job.category).slice(0, 3);

  const handleApplyClick = () => {
    if (!candidate) {
      navigate('/register?redirect=/jobs/' + job.id);
      return;
    }
    setShowApplyModal(true);
  };

  const confirmApply = () => {
    if (candidate) {
      applyToJob(job.id, candidate.resumeName);
    } else {
      applyToJob(job.id);
    }
    setShowApplyModal(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/jobs" className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900 mb-4">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
        Back to jobs
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <main className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-2xl shrink-0 shadow-md">
                {job.companyLogo}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{job.title}</h1>
                <Link to={`/companies/${job.companyId}`} className="text-brand-700 hover:underline font-medium mt-1 inline-block">
                  {job.company}
                </Link>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {job.location}
                  </span>
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">{job.type}</span>
                  <span className="px-2.5 py-1 bg-violet-50 text-violet-700 rounded-md text-xs font-medium">{job.experience}</span>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-medium">₹{job.salaryMin}–{job.salaryMax} {job.currency}</span>
                </div>
              </div>
              <button
                onClick={() => toggleSaveJob(job.id)}
                className={`p-2 rounded-lg border ${isSaved ? 'border-brand-200 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                aria-label="save"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill={isSaved ? 'currentColor' : 'none'} strokeWidth="2" stroke="currentColor">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                </svg>
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100">
              <h3 className="font-semibold text-slate-900 mb-2">About this role</h3>
              <p className="text-slate-700 leading-relaxed">{job.description}</p>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-slate-900 mb-3">What you'll do</h3>
              <ul className="space-y-2">
                {job.responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700">
                    <span className="w-1.5 h-1.5 bg-brand-600 rounded-full mt-2 shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-slate-900 mb-3">What we're looking for</h3>
              <ul className="space-y-2">
                {job.requirements.map((r, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700">
                    <span className="w-1.5 h-1.5 bg-violet-600 rounded-full mt-2 shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-slate-900 mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map(s => (
                  <span key={s} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">{s}</span>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-slate-900 mb-3">Perks & benefits</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {job.benefits.map((b, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-700">
                    <span className="w-5 h-5 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs">✓</span>
                    {b}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {relatedJobs.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">More like this</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relatedJobs.map(j => <JobCard key={j.id} job={j} />)}
              </div>
            </div>
          )}
        </main>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="text-2xl font-bold text-slate-900">₹{job.salaryMin}–{job.salaryMax} <span className="text-base font-normal text-slate-500">{job.currency}</span></div>
            <p className="text-sm text-slate-500 mt-1">Estimated annual</p>

            <button
              onClick={handleApplyClick}
              disabled={hasApplied}
              className={`mt-4 w-full py-3 rounded-xl font-semibold transition shadow-sm ${
                hasApplied
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-brand-600 hover:bg-brand-700 text-white'
              }`}
            >
              {hasApplied ? '✓ Application submitted' : 'Apply now'}
            </button>
            <button
              onClick={() => toggleSaveJob(job.id)}
              className="mt-2 w-full py-3 rounded-xl font-semibold border border-slate-200 hover:bg-slate-50 transition"
            >
              {isSaved ? '★ Saved' : '☆ Save for later'}
            </button>

            <div className="mt-6 pt-6 border-t border-slate-100 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Posted</span>
                <span className="font-medium text-slate-900">{job.postedDays === 0 ? 'Today' : `${job.postedDays}d ago`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Applicants</span>
                <span className="font-medium text-slate-900">{job.applicants}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Category</span>
                <span className="font-medium text-slate-900">{job.category}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl animate-slide-up">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Confirm application</h3>
                <p className="text-sm text-slate-500 mt-1">Review your details before submitting.</p>
              </div>
              <button onClick={() => setShowApplyModal(false)} className="p-1 rounded hover:bg-slate-100">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 mb-4">
              <div className="text-xs text-slate-500">Applying for</div>
              <div className="font-semibold text-slate-900">{job.title}</div>
              <div className="text-sm text-slate-600">{job.company}</div>
            </div>

            <div className="space-y-2 text-sm mb-6">
              <div className="flex justify-between"><span className="text-slate-500">Name</span><span className="font-medium">{candidate?.fullName}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Email</span><span className="font-medium">{candidate?.email}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Resume</span><span className="font-medium">{candidate?.resumeName || 'Not uploaded'}</span></div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setShowApplyModal(false)} className="flex-1 py-2.5 border border-slate-200 rounded-lg font-semibold hover:bg-slate-50">Cancel</button>
              <button onClick={confirmApply} className="flex-1 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-semibold">Submit application</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
