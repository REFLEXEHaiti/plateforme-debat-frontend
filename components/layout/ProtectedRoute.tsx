'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

interface Props {
  children: React.ReactNode;
  rolesAutorises?: string[];
}

export default function ProtectedRoute({ children, rolesAutorises }: Props) {
  const router = useRouter();
  const estConnecte = useAuthStore(s => s.estConnecte);
  const utilisateur = useAuthStore(s => s.utilisateur);
  const hasHydrated = useAuthStore(s => s._hasHydrated);

  if (!hasHydrated) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!estConnecte) {
    router.push('/auth/connexion');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (rolesAutorises && utilisateur?.role && !rolesAutorises.includes(utilisateur.role)) {
    router.push('/dashboard');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}