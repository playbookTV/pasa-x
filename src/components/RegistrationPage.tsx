import React, { useState } from 'react';
import { Registration } from './Registration';
import { useAuth } from '@/hooks/use-auth';
import { Toast } from './Toast';

export const RegistrationPage: React.FC = () => {
  const { register } = useAuth();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const handleRegistrationComplete = async (userData: {
    email: string;
    password: string;
    fullName: string;
    currentRole?: string;
  }) => {
    try {
      await register(userData);
      
      // Success notification
      setToastMessage('Account created successfully');
      setToastType('success');
      setShowToast(true);
      
      // In a real app, you might redirect to dashboard or another page here
    } catch (error) {
      // Error notification
      setToastMessage(error instanceof Error ? error.message : 'Registration failed');
      setToastType('error');
      setShowToast(true);
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen flex justify-center items-center p-4">
      <Registration onComplete={handleRegistrationComplete} />
      
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}; 