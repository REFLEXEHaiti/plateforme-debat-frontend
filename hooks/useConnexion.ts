'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export function useConnexion() {
  const [estEnLigne, setEstEnLigne] = useState(true);

  useEffect(() => {
    const mettreAJour = () => {
      const enligne = navigator.onLine;
      setEstEnLigne(enligne);
      if (!enligne) {
        toast.error('Vous etes hors ligne - mode cache active', {
          duration: 5000,
          icon: 'offline',
        });
      } else {
        toast.success('Connexion retablie !', { duration: 3000 });
      }
    };

    window.addEventListener('online', mettreAJour);
    window.addEventListener('offline', mettreAJour);
    setEstEnLigne(navigator.onLine);

    return () => {
      window.removeEventListener('online', mettreAJour);
      window.removeEventListener('offline', mettreAJour);
    };
  }, []);

  return { estEnLigne };
}
