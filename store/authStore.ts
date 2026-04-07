// store/authStore.ts
// CORRECTION : on supprime la méthode initialiser() redondante.
// Zustand `persist` + `onRehydrateStorage` recharge déjà l'état depuis
// localStorage automatiquement — inutile de le faire une deuxième fois
// dans InitAuth. Cela évitait une condition de course au démarrage.

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { sauvegarderSession, supprimerSession } from '@/lib/auth';

interface Utilisateur {
  id: string;
  email: string;
  prenom: string;
  nom: string;
  role: 'ADMIN' | 'FORMATEUR' | 'APPRENANT' | 'SPECTATEUR';
}

interface AuthStore {
  utilisateur: Utilisateur | null;
  token: string | null;
  estConnecte: boolean;
  _hasHydrated: boolean;
  setHasHydrated: (val: boolean) => void;
  connecter: (token: string, utilisateur: Utilisateur) => void;
  deconnecter: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      utilisateur: null,
      token: null,
      estConnecte: false,
      _hasHydrated: false,

      setHasHydrated: (val) => set({ _hasHydrated: val }),

      connecter: (token, utilisateur) => {
        sauvegarderSession(token, utilisateur);
        set({ token, utilisateur, estConnecte: true });
      },

      deconnecter: () => {
        supprimerSession();
        set({ token: null, utilisateur: null, estConnecte: false });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        utilisateur: state.utilisateur,
        token: state.token,
        estConnecte: state.estConnecte,
      }),
      onRehydrateStorage: () => (state) => {
        // Seul point de rehydratation — plus besoin d'InitAuth
        state?.setHasHydrated(true);
      },
    }
  )
);
