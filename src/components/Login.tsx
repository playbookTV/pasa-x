import React, { useState } from 'react';
import { TextInput } from './TextInput';
import { Button } from './Button';
import { cn } from '@/lib/utils';
import { Logo } from '../components/Logo'
import { ForgotPasswordRequest } from './ForgotPasswordRequest';
import { ResetPassword } from './ResetPassword';

interface LoginProps {
  className?: string;
  onSubmit?: (email: string, password: string) => void;
  onForgotPassword?: (email: string) => void;
  onGoogleSignIn?: () => void;
  onCreateAccount?: () => void;
  onResetPassword?: (newPassword: string) => void;
}

export const Login: React.FC<LoginProps> = ({
  className,
  onSubmit,
  onForgotPassword,
  onGoogleSignIn,
  onCreateAccount,
  onResetPassword,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [view, setView] = useState<'login' | 'forgotPassword' | 'resetPassword'>('login');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(email, password);
  };

  const handleForgotPasswordSubmit = (email: string) => {
    onForgotPassword?.(email);
    // In a real application, you might want to show a success message here
    // For now, we'll just switch back to the login view
    setView('login');
  };

  const handleResetPasswordSubmit = (newPassword: string) => {
    onResetPassword?.(newPassword);
    // In a real application, you might want to show a success message here
    // For now, we'll just switch back to the login view
    setView('login');
  };

  if (view === 'forgotPassword') {
    return (
      <ForgotPasswordRequest
        onBack={() => setView('login')}
        onSubmit={handleForgotPasswordSubmit}
      />
    );
  }

  if (view === 'resetPassword') {
    return (
      <ResetPassword
        onBack={() => setView('login')}
        onSubmit={handleResetPasswordSubmit}
      />
    );
  }

  return (
    <div className={cn("w-96 h-auto px-2.5 pt-9 pb-2.5 bg-slate-100 flex-col justify-start items-start gap-6 inline-flex", className)}>
      <Logo variant="withText" />
      <div className="self-stretch px-4 pt-4 pb-3 bg-white rounded-xl shadow-[0px_0px_2px_0px_rgba(0,0,0,0.15),0px_8px_40px_0px_rgba(0,0,0,0.04),0px_2px_5px_0px_rgba(0,0,0,0.05)]">
        <form onSubmit={handleSubmit} className="px-0.5 pb-4 rounded-lg flex flex-col gap-6">
          <h1 className="text-stone-950 text-xl font-bold font-['Inter']">Log in</h1>
          
          <TextInput
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />

          <TextInput
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />

          <div className="self-stretch bg-indigo-600/0 rounded-lg flex justify-end">
            <button
              type="button"
              onClick={() => setView('forgotPassword')}
              className="text-indigo-600 text-base/2 font-semibold font-['Inter'] hover:underline"
            >
              Forgot Password
            </button>
          </div>

          <Button type="submit" variant="primary" size="large" className="w-full">
            Sign in
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="large"
            className="w-full"
            onClick={onGoogleSignIn}
          >
            Continue with Google
          </Button>

          <div className="self-stretch h-px border border-indigo-700/10" />

          <Button
            type="button"
            variant="secondary-colored"
            size="large"
            className="w-full"
            onClick={onCreateAccount}
          >
            Create Account
          </Button>
        </form>
      </div>
    </div>
  );
};

