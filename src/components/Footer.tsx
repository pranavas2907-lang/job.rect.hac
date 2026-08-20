import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="5" width="18" height="14" rx="2"/>
                  <path d="M9 17V8h6a3 3 0 1 1 0 6H9" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="text-white font-bold text-lg">JobNest</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm">
              The modern way to discover jobs, build your profile, and land your next role. Built for Indian talent.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">For Candidates</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/jobs" className="hover:text-white">Browse Jobs</Link></li>
              <li><Link to="/companies" className="hover:text-white">Companies</Link></li>
              <li><Link to="/register" className="hover:text-white">Create Profile</Link></li>
              <li><Link to="/dashboard" className="hover:text-white">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a className="hover:text-white cursor-pointer">About</a></li>
              <li><a className="hover:text-white cursor-pointer">Careers</a></li>
              <li><a className="hover:text-white cursor-pointer">Contact</a></li>
              <li><a className="hover:text-white cursor-pointer">Blog</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between text-sm text-slate-500 gap-2">
          <div>© 2026 JobNest. All rights reserved.</div>
          <div className="flex gap-6">
            <a className="hover:text-white cursor-pointer">Privacy</a>
            <a className="hover:text-white cursor-pointer">Terms</a>
            <a className="hover:text-white cursor-pointer">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
