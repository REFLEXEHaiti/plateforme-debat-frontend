'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface TraductionContextType {
  langue: string;
  changerLangue: (code: string) => void;
  t: (texte: string) => string;
}

const TraductionContext = createContext<TraductionContextType>({
  langue: 'fr',
  changerLangue: () => {},
  t: (texte) => texte,
});

export function TraductionProvider({ children }: { children: ReactNode }) {
  const [langue, setLangue] = useState('fr');

  useEffect(() => {
    const saved = localStorage.getItem('debat-ht-lang') || 'fr';
    setLangue(saved);
  }, []);

  const changerLangue = (code: string) => {
    setLangue(code);
    localStorage.setItem('debat-ht-lang', code);
  };

  // t() retourne simplement le texte — Google Translate s'occupe de la traduction
  const t = (texte: string) => texte;

  return (
    <TraductionContext.Provider value={{ langue, changerLangue, t }}>
      {children}
    </TraductionContext.Provider>
  );
}

export const useTraduction = () => useContext(TraductionContext);