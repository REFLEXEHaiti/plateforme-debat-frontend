// components/layout/InitAuth.tsx
// Composant invisible — initialise l'auth au chargement de l'app

'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export default function InitAuth() {
  const { initialiser } = useAuthStore();

  useEffect(() => {
    initialiser();
  }, []);

  return null;
}