// Popup entry point for Pasa Chrome Extension
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { DashboardUI } from './components/DashboardUI';
import { LoginPage } from './components/LoginPage';
import { Registration } from './components/Registration';
import { AuthProvider, useAuthContext } from './lib/auth-context';
import './styles/globals.css';

console.log('Pasa popup initialized');

// Main App component that handles routing between pages
const App: React.FC = () => {
  const { isAuthenticated, loading } = useAuthContext();
  const [page, setPage] = useState<'login' | 'register' | 'dashboard'>('login');

  // If we're authenticated, show the dashboard
  useEffect(() => {
    if (isAuthenticated) {
      setPage('dashboard');
    }
  }, [isAuthenticated]);

  // Loading state
  if (loading) {
    return (
      <div className="w-96 h-96 flex items-center justify-center bg-slate-100">
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
    <div className="pasa-extension">
      {renderPage()}
    </div>
  );
};

// Create root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found. Make sure the popup.html has a div with id "root"');
}

// Render the app wrapped in AuthProvider
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
); 