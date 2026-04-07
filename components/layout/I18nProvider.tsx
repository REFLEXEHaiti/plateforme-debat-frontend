'use client';

import { TraductionProvider } from '@/lib/traductionContext';
import i18n from '@/lib/i18n';
import { useEffect } from 'react';

function LangueSync() {
  useEffect(() => {
    const saved = localStorage.getItem('debat-ht-lang') || 'fr';
    i18n.changeLanguage(saved);
  }, []);
  return null;
}

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  return (
    <TraductionProvider>
      <LangueSync />
      {children}
    </TraductionProvider>
  );
}