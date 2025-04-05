import React, { useState } from 'react';
import { TextInput } from './TextInput';
import { Button } from './Button';
import { ArrowLeft } from 'lucide-react';

interface ResetPasswordProps {
  onBack: () => void;
  onSubmit: (newPassword: string) => void;
}

export const ResetPassword: React.FC<ResetPasswordProps> = ({ onBack, onSubmit }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
    } else {
      setError('');
      onSubmit(newPassword);
    }
  };

  return (
    <div className="w-96 h-96 px-2.5 pt-9 pb-2.5 bg-slate-100 flex-col justify-start items-start gap-6 inline-flex overflow-hidden">
      <div className="self-stretch h-96 px-4 pt-4 pb-3 bg-white rounded-xl shadow-[0px_0px_2px_0px_rgba(0,0,0,0.15)] shadow-[0px_8px_40px_0px_rgba(0,0,0,0.04)] shadow-[0px_2px_5px_0px_rgba(0,0,0,0.05)] flex-col justify-start items-start gap-4 flex overflow-hidden">
        <form onSubmit={handleSubmit} className="self-stretch h-80 pb-4 rounded-lg flex-col justify-start items-center gap-6 flex">
          <div className="self-stretch justify-start items-start gap-6 inline-flex">
            <button type="button" onClick={onBack} className="justify-center items-center gap-1 flex text-slate-900 text-sm font-semibold font-['Inter'] leading-tight">
              <ArrowLeft className="w-4 h-6" />
              Back
            </button>
          </div>
          <h2 className="self-stretch text-stone-950 text-2xl font-bold font-['Inter']">Set your new password</h2>
          <TextInput
            label="Enter new password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
          <TextInput
            label="Confirm new password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="One more time..."
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" variant="primary" className="w-full">
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  );
};

