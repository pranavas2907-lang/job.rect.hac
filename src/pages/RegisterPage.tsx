import { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Candidate } from '../types';

const SKILL_OPTIONS = ['React', 'TypeScript', 'Node.js', 'Python', 'Java', 'Go', 'SQL', 'AWS', 'Figma', 'Product Management', 'Data Analysis', 'Marketing'];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';
  const { setCandidate, showToast } = useApp();
  const fileRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(1);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [data, setData] = useState<Candidate>({
    fullName: '', email: '', phone: '',
    headline: '', location: '', about: '',
    skills: [], experience: [], education: [],
    resumeName: ''
  });

  const update = (k: keyof Candidate, v: any) => setData(d => ({ ...d, [k]: v }));

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!data.fullName.trim()) e.fullName = 'Name is required';
    if (!data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required';
    if (data.phone && !data.phone.match(/^[\d\s+-]{7,}$/)) e.phone = 'Invalid phone';
    if (!data.headline.trim()) e.headline = 'Add a headline (e.g. Frontend Engineer)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleResume = (file: File) => {
    if (file.type !== 'application/pdf') {
      showToast('Please upload a PDF file', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Resume must be under 5MB', 'error');
      return;
    }
    update('resumeName', file.name);
    const reader = new FileReader();
    reader.onload = () => update('resumeData', reader.result as string);
    reader.readAsDataURL(file);
    showToast('Resume uploaded ✓', 'success');
  };

  const toggleSkill = (s: string) => {
    const next = data.skills.includes(s)
      ? data.skills.filter(x => x !== s)
      : [...data.skills, s];
    update('skills', next);
  };

  const finish = () => {
    if (!consentAccepted) {
      showToast('Please accept the application terms to continue', 'error');
      return;
    }
    setCandidate(data);
    showToast('Profile created! Welcome to JobNest 🎉', 'success');
    navigate(redirect);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 rise-in">
      <div className="depth-card bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-gradient-to-r from-brand-600 to-violet-700 px-6 py-8 text-white">
          <h1 className="text-3xl font-bold">Create your profile</h1>
          <p className="text-brand-100 mt-2">Stand out to recruiters — takes 2 minutes</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {[['Basic info', 1], ['Professional profile', 2], ['Legal documents', 3]].map(([label, n]) => (
              <button key={label as string} type="button" onClick={() => Number(n) < step && setStep(Number(n))} className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${step === n ? 'bg-white text-brand-700' : step > Number(n) ? 'bg-white/30 text-white hover:bg-white/40' : 'bg-white/10 text-white/60'}`}>
                {step > Number(n) ? '✓ ' : ''}{label as string}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 sm:p-8 form-section-enter">
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-slate-900">Basic info</h2>
              <Field label="Full name" error={errors.fullName}>
                <input value={data.fullName} onChange={(e) => update('fullName', e.target.value)} placeholder="Priya Sharma" className="input" />
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Email" error={errors.email}>
                  <input value={data.email} onChange={(e) => update('email', e.target.value)} placeholder="priya@example.com" type="email" className="input" />
                </Field>
                <Field label="Phone" error={errors.phone}>
                  <input value={data.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+91 98765 43210" className="input" />
                </Field>
              </div>
              <Field label="Headline" error={errors.headline} hint="A short summary — e.g. Frontend Engineer at heart">
                <input value={data.headline} onChange={(e) => update('headline', e.target.value)} placeholder="Frontend Engineer | React, TypeScript" className="input" />
              </Field>
              <Field label="Location">
                <input value={data.location} onChange={(e) => update('location', e.target.value)} placeholder="Bengaluru, India" className="input" />
              </Field>

              <div className="flex justify-end">
                <button onClick={() => validateStep1() && setStep(2)} className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-semibold">Continue →</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-slate-900">About you</h2>
              <Field label="About" hint="A few lines about your background">
                <textarea value={data.about} onChange={(e) => update('about', e.target.value)} rows={4} placeholder="I'm a frontend engineer with 4 years building…" className="input resize-none" />
              </Field>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Skills (pick all that apply)</label>
                <div className="flex flex-wrap gap-2">
                  {SKILL_OPTIONS.map(s => (
                    <button
                      key={s}
                      onClick={() => toggleSkill(s)}
                      type="button"
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition ${
                        data.skills.includes(s)
                          ? 'bg-brand-600 text-white border-brand-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-brand-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <button onClick={() => setStep(1)} className="px-6 py-2.5 border border-slate-200 rounded-lg font-semibold hover:bg-slate-50">← Back</button>
                <button onClick={() => setStep(3)} className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-semibold">Continue →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-slate-900">Legal documents</h2>
              <p className="text-sm text-slate-500 -mt-3">Add your resume and confirm how your information can be used.</p>

              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleResume(f); }}
                className="border-2 border-dashed border-slate-300 hover:border-brand-400 rounded-2xl p-8 text-center cursor-pointer transition bg-slate-50 hover:bg-brand-50/50"
              >
                {data.resumeName ? (
                  <div>
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full mx-auto flex items-center justify-center mb-3">✓</div>
                    <p className="font-semibold text-slate-900">{data.resumeName}</p>
                    <p className="text-xs text-slate-500 mt-1">Click to replace</p>
                  </div>
                ) : (
                  <div>
                    <svg className="w-12 h-12 mx-auto text-slate-400 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                    </svg>
                    <p className="font-semibold text-slate-900">Drop your resume here</p>
                    <p className="text-sm text-slate-500 mt-1">or click to browse — PDF, max 5MB</p>
                  </div>
                )}
                <input ref={fileRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleResume(f); }} />
              </div>

              <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 flex gap-3">
                <svg className="w-5 h-5 text-brand-700 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
                </svg>
                <div className="text-sm text-brand-900">
                  <p className="font-semibold">Why upload a resume?</p>
                  <p className="text-brand-800/80 mt-1">Recruiters can view it directly when you apply, speeding up callbacks.</p>
                </div>
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-brand-300 hover:bg-brand-50/40">
                <input type="checkbox" checked={consentAccepted} onChange={(e) => setConsentAccepted(e.target.checked)} className="mt-1 h-4 w-4 accent-brand-600" />
                <span className="text-sm text-slate-600">I confirm that the information shared is accurate and I agree to JobNest sharing my profile with the employer for this application.</span>
              </label>

              <div className="flex justify-between">
                <button onClick={() => setStep(2)} className="px-6 py-2.5 border border-slate-200 rounded-lg font-semibold hover:bg-slate-50">← Back</button>
                <button onClick={finish} disabled={!consentAccepted} className="button-lift px-6 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50 text-white rounded-lg font-semibold">Submit profile →</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`.input { width: 100%; padding: 0.625rem 0.875rem; font-size: 0.875rem; border: 1px solid rgb(226 232 240); border-radius: 0.5rem; background: white; outline: none; transition: border-color .2s, box-shadow .2s, transform .2s; }
        .input:hover { border-color: rgb(165 180 252); }
        .input:focus { border-color: rgb(59 103 255); box-shadow: 0 0 0 3px rgb(237 242 255); transform: translateY(-1px); }
        .button-lift { transition: transform .2s, box-shadow .2s, background-color .2s; }
        .button-lift:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 20px rgb(37 71 245 / 20%); }`}</style>
    </div>
  );
}

function Field({ label, children, error, hint }: { label: string; children: React.ReactNode; error?: string; hint?: string }) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-700 mb-1.5 block">{label}</label>
      {children}
      {hint && !error && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
      {error && <p className="text-xs text-rose-600 mt-1">{error}</p>}
    </div>
  );
}
