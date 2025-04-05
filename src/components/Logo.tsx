import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  variant?: 'withText' | 'noText';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ variant = 'withText', className }) => {
  const logoUrl = variant === 'withText' 
    ? 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-wtxt-r9ccTMXZDtBZhz8zClCJEm06g2NDl1.svg'
    : 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-notxt-a7sPAtJSXZAOCllXP3MmOCvTxgKy8C.svg';

  return (
    <img 
      src={logoUrl} 
      alt="Pasa Logo" 
      className={cn(
        "h-auto",
        variant === 'withText' ? "w-[120px]" : "w-[53px]",
        className
      )}
    />
  );
};

