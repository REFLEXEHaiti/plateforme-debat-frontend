// components/debats/ListeDebats.tsx
// Composant qui affiche la liste complète des débats
// Utilisé dans app/debats/page.tsx

'use client';

import CarteDebat from './CarteDebat';

interface Debat {
  id: string;
  titre: string;
  description: string;
  statut: string;
  createur: { prenom: string; nom: string };
  _count: { messages: number };
}

interface Props {
  debats: Debat[];
  chargement: boolean;
}

export default function ListeDebats({ debats, chargement }: Props) {
  if (chargement) {
    return (
      <div className="text-center py-12 text-gray-500">
        Chargement des débats...
      </div>
    );
  }

  if (debats.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        Aucun débat disponible pour le moment.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {debats.map((debat) => (
        <CarteDebat key={debat.id} debat={debat} />
      ))}
    </div>
  );
}