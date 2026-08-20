import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Header() {
  const { candidate } = useApp();
  const navigate = useNavigate();

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
      isActive ? 'text-brand-700 bg-brand-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  return (
    <header className="sticky top-0 z-40 glass-dark border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                <path d="M9 17V8h6a3 3 0 1 1 0 6H9" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
                <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
            </div>
            <div>
              <div className="font-bold text-lg text-slate-900 leading-none">JobNest<span className="text-brand-600">.</span></div>
              <div className="text-[10px] text-slate-500 tracking-wide">find your fit</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" end className={navClass}>Home</NavLink>
            <NavLink to="/jobs" className={navClass}>Jobs</NavLink>
            <NavLink to="/companies" className={navClass}>Companies</NavLink>
            <NavLink to="/dashboard" className={navClass}>Dashboard</NavLink>
          </nav>

          <div className="flex items-center gap-2">
            {candidate ? (
              <Link to="/dashboard" className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-slate-100 transition">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-white flex items-center justify-center text-sm font-semibold">
                  {candidate.fullName.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block text-sm font-medium text-slate-700 max-w-[120px] truncate">{candidate.fullName}</span>
              </Link>
            ) : (
              <>
                <button
                  onClick={() => navigate('/register')}
                  className="hidden sm:inline-flex px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50 rounded-lg transition"
                >
                  Sign in
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm transition"
                >
                  Get started
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
