"use client"

import React, { ButtonHTMLAttributes } from 'react';
import { cn } from '../lib/utils';
import { cva } from 'class-variance-authority';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'secondary-colored' | 'tertiary';
  size?: 'small' | 'medium' | 'large' | 'extra-large';
}

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-semibold transition-colors focus-visible:outline-none disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-gradient-to-b from-indigo-600 to-indigo-700 text-white shadow-[0px_1px_0px_0px_#757FF8_inset,0px_0px_0px_1px_#3516BF,0px_1px_3px_0px_rgba(143,39,9,0.20),0px_-2px_0px_0px_#3516BF_inset] hover:from-indigo-500 hover:to-indigo-600 disabled:opacity-50",
        secondary: "bg-white text-slate-800 shadow-[0px_1px_3px_0px_rgba(84,51,235,0.13),0px_0px_0px_1px_rgba(218,218,218,1.00),inset_0px_-2px_0px_0px_rgba(233,235,255,1.00)] hover:bg-gray-50 disabled:opacity-50",
        'secondary-colored': "bg-white text-indigo-600 shadow-[0px_1px_3px_0px_rgba(84,51,235,0.13),0px_0px_0px_1px_rgba(224,220,240,1.00),inset_0px_-2px_0px_0px_rgba(233,235,255,1.00)] hover:bg-indigo-50 disabled:opacity-50",
        tertiary: "bg-transparent text-gray-600 hover:bg-gray-100 disabled:opacity-50",
      },
      size: {
        small: "h-7 px-2 py-1 text-xs",
        medium: "h-9 px-4 py-2 text-sm",
        large: "h-11 w-full px-6 py-3 text-base",
        'extra-large': "h-12 px-8 py-4 text-lg",
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'medium',
    }
  }
);

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'medium', ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };

