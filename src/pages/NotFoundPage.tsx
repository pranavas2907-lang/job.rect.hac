import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <div className="text-7xl">🤔</div>
      <h1 className="text-3xl font-bold text-slate-900 mt-4">Page not found</h1>
      <p className="text-slate-500 mt-2">The page you're looking for doesn't exist.</p>
      <Link to="/" className="mt-6 inline-block px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-semibold">
        Back home
      </Link>
    </div>
  );
}
