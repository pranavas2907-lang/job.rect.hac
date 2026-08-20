import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Application, Candidate, Job } from '../types';
import { jobs as initialJobs } from '../data/jobs';
import { getUsers, saveUser } from '../data/userDatabase';

interface ToastMsg { id: number; text: string; type: 'success' | 'error' | 'info' }

interface AppContextType {
  jobs: Job[];
  savedJobs: string[];
  toggleSaveJob: (jobId: string) => void;
  applications: Application[];
  applyToJob: (jobId: string, resumeName?: string) => boolean;
  candidate: Candidate | null;
  setCandidate: (c: Candidate | null) => void;
  storedUsers: Candidate[];
  persistCandidate: (c: Candidate) => Promise<void>;
  toasts: ToastMsg[];
  showToast: (text: string, type?: ToastMsg['type']) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const LS = {
  saved: 'jobnest:saved',
  apps: 'jobnest:applications',
  candidate: 'jobnest:candidate'
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [savedJobs, setSavedJobs] = useState<string[]>(() => JSON.parse(localStorage.getItem(LS.saved) || '[]'));
  const [applications, setApplications] = useState<Application[]>(() => JSON.parse(localStorage.getItem(LS.apps) || '[]'));
  const [candidate, setCandidate] = useState<Candidate | null>(() => {
    const raw = localStorage.getItem(LS.candidate);
    return raw ? JSON.parse(raw) : null;
  });
  const [storedUsers, setStoredUsers] = useState<Candidate[]>([]);
  const [toasts, setToasts] = useState<ToastMsg[]>([]);

  useEffect(() => { localStorage.setItem(LS.saved, JSON.stringify(savedJobs)); }, [savedJobs]);
  useEffect(() => { localStorage.setItem(LS.apps, JSON.stringify(applications)); }, [applications]);
  useEffect(() => {
    if (candidate) localStorage.setItem(LS.candidate, JSON.stringify(candidate));
    else localStorage.removeItem(LS.candidate);
  }, [candidate]);
  useEffect(() => {
    const loadUsers = async () => {
      const users = await getUsers();
      if (users.length === 0 && candidate) {
        await saveUser(candidate);
        setStoredUsers([candidate]);
        return;
      }
      setStoredUsers(users);
    };
    loadUsers().catch(() => setStoredUsers([]));
  }, [candidate]);

  const persistCandidate = async (nextCandidate: Candidate) => {
    await saveUser(nextCandidate);
    setStoredUsers(await getUsers());
    setCandidate(nextCandidate);
  };

  const showToast = (text: string, type: ToastMsg['type'] = 'success') => {
    const id = Date.now();
    setToasts(t => [...t, { id, text, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  };

  const toggleSaveJob = (jobId: string) => {
    setSavedJobs(prev => {
      if (prev.includes(jobId)) {
        showToast('Removed from saved jobs', 'info');
        return prev.filter(id => id !== jobId);
      }
      showToast('Job saved!', 'success');
      return [...prev, jobId];
    });
  };

  const applyToJob = (jobId: string, resumeName?: string): boolean => {
    if (applications.some(a => a.jobId === jobId)) {
      showToast('You have already applied to this job', 'error');
      return false;
    }
    setApplications(prev => [
      { jobId, appliedAt: new Date().toISOString(), status: 'Applied', resumeName },
      ...prev
    ]);
    showToast('Application submitted! 🎉', 'success');
    return true;
  };

  return (
    <AppContext.Provider value={{
      jobs: initialJobs,
      savedJobs, toggleSaveJob,
      applications, applyToJob,
      candidate, setCandidate,
      storedUsers, persistCandidate,
      toasts, showToast
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
