// hooks/useNotifications.ts
'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [nonLues, setNonLues] = useState(0);

  const chargerNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data);
    } catch {}
  };

  const chargerNonLues = async () => {
    try {
      const { data } = await api.get('/notifications/non-lues');
      setNonLues(data.nonLues);
    } catch {}
  };

  const marquerToutesLues = async () => {
    try {
      await api.patch('/notifications/lire-tout');
      setNonLues(0);
      chargerNotifications();
    } catch {}
  };

  useEffect(() => {
    chargerNotifications();
    chargerNonLues();

    // Rafraîchit les notifications toutes les 30 secondes
    const interval = setInterval(chargerNonLues, 30000);
    return () => clearInterval(interval);
  }, []);

  return { notifications, nonLues, marquerToutesLues, chargerNotifications };
}