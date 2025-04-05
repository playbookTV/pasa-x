import React, { useState } from 'react';
import { Login } from './Login';
import { useAuthContext } from '../lib/auth-context';
import { Toast } from './Toast';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface LoginPageProps {
  onRegister?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onRegister }) => {
  const { login, googleSignIn, forgotPassword, resetPassword } = useAuthContext();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      
      // Success notification
      setToastMessage('Login successful');
      setToastType('success');
      setShowToast(true);
      
      // In a real app, you might redirect to dashboard or another page here
    } catch (error) {
      // Error notification
      setToastMessage(error instanceof Error ? error.message : 'Login failed');
      setToastType('error');
      setShowToast(true);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
      
      // Success notification
      setToastMessage('Login successful');
      setToastType('success');
      setShowToast(true);
      
      // In a real app, you might redirect to dashboard or another page here
    } catch (error) {
      // Error notification
      setToastMessage(error instanceof Error ? error.message : 'Google sign-in failed');
      setToastType('error');
      setShowToast(true);
    }
  };

  const handleForgotPassword = async (email: string) => {
    try {
      await forgotPassword(email);
      
      // Success notification
      setToastMessage('Password reset email sent');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      // Error notification
      setToastMessage(error instanceof Error ? error.message : 'Failed to request password reset');
      setToastType('error');
      setShowToast(true);
    }
  };

  const handleResetPassword = async (newPassword: string) => {
    try {
      // In a real implementation, we would get the token from the URL
      const token = 'mock-token'; // This would come from URL in production
      await resetPassword(token, newPassword);
      
      // Success notification
      setToastMessage('Password reset successful');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      // Error notification
      setToastMessage(error instanceof Error ? error.message : 'Failed to reset password');
      setToastType('error');
      setShowToast(true);
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen flex justify-center items-center p-4">
      <Login
        onSubmit={handleLogin}
        onGoogleSignIn={handleGoogleSignIn}
        onForgotPassword={handleForgotPassword}
        onResetPassword={handleResetPassword}
        onCreateAccount={onRegister}
      />
      
      {showToast && (
        <Toast
          message={toastMessage}
          icon={toastType === 'success' ? <CheckCircle className="text-green-500" /> : <AlertCircle className="text-red-500" />}
          title={toastType === 'success' ? 'Success' : 'Error'}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}; 