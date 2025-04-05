"use client"

import React from 'react';
import { useTheme } from '../theme-provider';

export function Toaster() {
  const { theme } = useTheme();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {/* This is a simplified toast container implementation */}
      <div id="toast-container" className={`toast-container ${theme}`} />
    </div>
  );
}
