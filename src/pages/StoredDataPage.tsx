import { useEffect, useState } from 'react';
import { getUsers } from '../data/userDatabase';
import { Candidate } from '../types';

export default function StoredDataPage() {
  const [users, setUsers] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      setUsers(await getUsers());
    } catch {
      setError('The browser database could not be opened.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 rise-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mono text-xs uppercase tracking-[.2em] text-brand-700">DATABASE VIEWER</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Stored user data</h1>
          <p className="mt-2 text-slate-500">Profile records saved in this browser's JobNest database.</p>
        </div>
        <button onClick={loadUsers} className="button-lift rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-brand-300 hover:text-brand-700">
          Refresh records
        </button>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading && <div className="p-10 text-center text-slate-500">Loading database records...</div>}
        {!loading && error && <div className="p-10 text-center text-rose-600">{error}</div>}
        {!loading && !error && users.length === 0 && (
          <div className="p-12 text-center"><div className="text-4xl">◌</div><h2 className="mt-3 font-semibold text-slate-900">No stored users yet</h2><p className="mt-1 text-sm text-slate-500">Create a profile to add the first database record.</p></div>
        )}
        {!loading && !error && users.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr><th className="px-5 py-4">Name</th><th className="px-5 py-4">Email</th><th className="px-5 py-4">Headline</th><th className="px-5 py-4">Location</th><th className="px-5 py-4">Resume</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user.email} className="transition hover:bg-blue-50/40">
                    <td className="px-5 py-4 font-semibold text-slate-900">{user.fullName}</td>
                    <td className="px-5 py-4 text-slate-600">{user.email}</td>
                    <td className="px-5 py-4 text-slate-600">{user.headline || 'Not provided'}</td>
                    <td className="px-5 py-4 text-slate-600">{user.location || 'Not provided'}</td>
                    <td className="px-5 py-4">{user.resumeName ? <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">Uploaded</span> : <span className="text-slate-400">None</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
