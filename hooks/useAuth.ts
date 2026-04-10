// hooks/useAuth.ts
// Hook pour les appels API d'authentification

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export function useAuth() {
  const [chargement, setChargement] = useState(false);
  const { connecter, deconnecter } = useAuthStore();
  const router = useRouter();

  // Inscription
  const inscrire = async (donnees: {
    email: string;
    motDePasse: string;
    prenom: string;
    nom: string;
    role?: string;
    ville?: string;
    whatsapp?: string;
    niveauAcademique?: string;
  }) => {
    setChargement(true);
    try {
      const { data } = await api.post('/auth/inscription', donnees);
      connecter(data.access_token, data.utilisateur);
      toast.success('Inscription réussie ! Bienvenue 🎉');
      router.push('/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erreur lors de l\'inscription';
      const msg = Array.isArray(message) ? message[0] : message;
      toast.error(msg);
      throw new Error(msg); // Re-throw pour que la page puisse réagir
    } finally {
      setChargement(false);
    }
  };

  // Connexion — re-throw pour que la page puisse afficher son propre message d'erreur
  const seConnecter = async (email: string, motDePasse: string) => {
    setChargement(true);
    try {
      const { data } = await api.post('/auth/connexion', { email, motDePasse });
      connecter(data.access_token, data.utilisateur);
      toast.success(`Bienvenue ${data.utilisateur.prenom} !`);
      router.push('/dashboard');
    } catch (error: any) {
      // Ne pas afficher toast ici — la page gère son propre message d'erreur inline
      throw error;
    } finally {
      setChargement(false);
    }
  };

  // Déconnexion
  const seDeconnecter = () => {
    deconnecter();
    toast.success('Déconnecté avec succès');
    router.push('/auth/connexion');
  };

  return { inscrire, seConnecter, seDeconnecter, chargement };
}
