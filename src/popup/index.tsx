import React from 'react';
import ReactDOM from 'react-dom/client';
import { DashboardUI } from '../components/DashboardUI';
import { LoginPage } from '../components/LoginPage';
import { Registration } from '../components/Registration';
import { AuthProvider, useAuthContext } from '../lib/auth-context';
import '../styles/globals.css';

// Main App component that handles routing between pages
const App: React.FC = () => {
  const { isAuthenticated, loading } = useAuthContext();
  const [page, setPage] = React.useState<'login' | 'register' | 'dashboard'>('login');

  // If we're authenticated, show the dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      setPage('dashboard');
    }
  }, [isAuthenticated]);

  // Loading state
  if (loading) {
    return (
      <div className="min-w-[430px] h-96 flex items-center justify-center bg-slate-100">
        <div className="text-indigo-600 text-lg">Loading...</div>
      </div>
    );
  }

  // Render the appropriate page based on state
  const renderPage = () => {
    if (!isAuthenticated) {
      return page === 'login' ? (
        <LoginPage onRegister={() => setPage('register')} />
      ) : (
        <Registration 
          onComplete={() => setPage('dashboard')}
        />
      );
    }
    
    return <DashboardUI />;
  };

  return (
    <div className="pasa-extension min-w-[430px]">
      {renderPage()}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
); 