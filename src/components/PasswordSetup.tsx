import React, { useState } from 'react';
import { TextInput } from './TextInput';
import { Button } from './Button';

interface PasswordSetupProps {
  formData: {
    password: string;
  };
  updateFormData: (data: Partial<PasswordSetupProps['formData']>) => void;
  onSubmit: () => void;
}

export const PasswordSetup: React.FC<PasswordSetupProps> = ({ formData, updateFormData, onSubmit }) => {
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== confirmPassword) {
      setError("Passwords don't match");
    } else {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
      <h2 className="self-stretch text-stone-950 text-2xl font-bold font-['Inter']">Set your password</h2>
      <TextInput
        label="Enter password"
        type="password"
        value={formData.password}
        onChange={(e) => updateFormData({ password: e.target.value })}
        required
      />
      <TextInput
        label="Confirm password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button type="submit" variant="primary" size="large" className="w-full">
        Create Profile
      </Button>
    </form>
  );
};

