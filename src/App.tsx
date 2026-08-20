import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ToastContainer from './components/ToastContainer';
import HomePage from './pages/HomePage';
import JobsPage from './pages/JobsPage';
import JobDetailPage from './pages/JobDetailPage';
import CompaniesPage from './pages/CompaniesPage';
import CompanyDetailPage from './pages/CompanyDetailPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  const [isLaunching, setIsLaunching] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLaunching(false), 1250);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <div className={`launch-screen ${isLaunching ? '' : 'launch-screen--exit'}`} aria-hidden={!isLaunching}>
        <div className="launch-mark">J</div>
        <div className="launch-wordmark">JobNest<span>.</span></div>
        <div className="launch-line"><span /></div>
        <p>find your fit</p>
      </div>
      <div className={`app-canvas min-h-screen flex flex-col ${isLaunching ? 'app-under-launch' : 'app-ready'}`}>
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/companies/:id" element={<CompanyDetailPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <ToastContainer />
      </div>
    </>
  );
}
