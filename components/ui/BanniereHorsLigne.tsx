'use client';

import { useConnexion } from '@/hooks/useConnexion';

export default function BanniereHorsLigne() {
  const { estEnLigne } = useConnexion();

  if (estEnLigne) return null;

  return (
    <div className="bg-yellow-500 text-yellow-900 text-center py-2 px-4 text-sm font-medium">
      Vous êtes hors ligne. Certaines fonctionnalités sont limitées.
    </div>
  );
}