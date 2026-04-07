// components/layout/InitAuth.tsx
// CORRECTION : ce composant n'est plus nécessaire.
// Zustand persist + onRehydrateStorage gère seul la rehydratation.
// Le fichier est conservé pour ne pas casser les imports existants,
// mais il ne fait plus rien. Vous pouvez aussi le supprimer et
// retirer son import dans app/layout.tsx.

export default function InitAuth() {
  return null;
}
