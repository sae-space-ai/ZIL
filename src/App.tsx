import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { User, getCurrentUser, isAuthenticated, initializeUsers } from './lib/auth';
import { initializeSampleData } from './lib/store';
import Layout from './components/Layout';
import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Calls from './pages/Calls';
import Consortium from './pages/Consortium';
import PartA from './pages/PartA';
import PartB from './pages/PartB';
import Budget from './pages/Budget';
import WorkPackages from './pages/WorkPackages';
import Annexes from './pages/Annexes';
import Compliance from './pages/Compliance';
import Submission from './pages/Submission';
import Settings from './pages/Settings';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize app data
    initializeUsers();
    
    // Check existing auth
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      initializeSampleData(currentUser.id);
    }
    setLoading(false);
  }, []);

  const handleLogin = (loggedUser: User) => {
    setUser(loggedUser);
    initializeSampleData(loggedUser.id);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('eu_grant_auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 bg-eu-gold rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-eu-blue font-bold text-lg">EU</span>
          </div>
          <p className="text-sm text-slate-500">Loading EU Grant Submission Engine...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={handleLogin} />}
        />
        {user ? (
          <>
            <Route element={<Layout user={user} onLogout={handleLogout} />}>
              <Route path="/dashboard" element={<Dashboard user={user} />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/calls" element={<Calls />} />
              <Route path="/consortium" element={<Consortium />} />
              <Route path="/part-a" element={<PartA />} />
              <Route path="/part-b" element={<PartB />} />
              <Route path="/budget" element={<Budget />} />
              <Route path="/work-packages" element={<WorkPackages />} />
              <Route path="/annexes" element={<Annexes />} />
              <Route path="/compliance" element={<Compliance />} />
              <Route path="/submission" element={<Submission />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}
