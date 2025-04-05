import React, { useState } from 'react';
import { TextInput } from './TextInput';
import { Button } from './Button';
import { ArrowLeft } from 'lucide-react';

interface ForgotPasswordRequestProps {
  onBack: () => void;
  onSubmit: (email: string) => void;
}

export const ForgotPasswordRequest: React.FC<ForgotPasswordRequestProps> = ({ onBack, onSubmit }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email);
  };

  return (
    <div className="w-96 h-96 px-2.5 pt-9 pb-2.5 bg-slate-100 flex-col justify-start items-start gap-6 inline-flex overflow-hidden">
      <div className="self-stretch h-80 px-4 pt-4 pb-3 bg-white rounded-xl shadow-[0px_0px_2px_0px_rgba(0,0,0,0.15)] shadow-[0px_8px_40px_0px_rgba(0,0,0,0.04)] shadow-[0px_2px_5px_0px_rgba(0,0,0,0.05)] flex-col justify-start items-start gap-4 flex overflow-hidden">
        <form onSubmit={handleSubmit} className="self-stretch h-80 pb-4 rounded-lg flex-col justify-start items-center gap-6 flex">
          <div className="self-stretch justify-start items-start gap-6 inline-flex">
            <button type="button" onClick={onBack} className="justify-center items-center gap-1 flex text-slate-900 text-sm font-semibold font-['Inter'] leading-tight">
              <ArrowLeft className="w-4 h-6" />
              Back
            </button>
          </div>
          <div className="self-stretch h-20 flex-col justify-start items-start gap-2 flex">
            <h2 className="self-stretch text-stone-950 text-2xl font-bold font-['Inter']">Reset your password</h2>
            <p className="self-stretch text-black text-base font-normal font-['Inter'] leading-normal">Enter your email and we'll help you reset your password</p>
          </div>
          <TextInput
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="One more time..."
            required
          />
          <Button type="submit" variant="primary" className="w-full">
            Send Email
          </Button>
        </form>
      </div>
    </div>
  );
};

