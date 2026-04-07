// hooks/useDebats.ts
// Hook pour tous les appels API liés aux débats

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export function useDebats() {
  const [debats, setDebats] = useState([]);
  const [chargement, setChargement] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  // Charger la liste des débats
  const chargerDebats = async (page = 1) => {
    setChargement(true);
    try {
      const { data } = await api.get(`/debats?page=${page}&limite=10`);
      setDebats(data.debats);
      setTotalPages(data.totalPages);
    } catch {
      toast.error('Impossible de charger les débats');
    } finally {
      setChargement(false);
    }
  };

  // Créer un débat
  const creerDebat = async (donnees: {
    titre: string;
    description: string;
    statut?: string;
  }) => {
    try {
      const { data } = await api.post('/debats', donnees);
      toast.success('Débat créé avec succès !');
      chargerDebats(); // rafraîchit la liste
      return data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la création');
    }
  };

  // Charger un débat par ID avec ses messages
  const chargerDebat = async (id: string) => {
    setChargement(true);
    try {
      const { data } = await api.get(`/debats/${id}`);
      return data;
    } catch {
      toast.error('Débat introuvable');
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    chargerDebats();
  }, []);

  return { debats, chargement, totalPages, chargerDebats, creerDebat, chargerDebat };
}