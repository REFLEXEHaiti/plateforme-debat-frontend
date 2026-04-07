'use client';

import { useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface Props {
  messageId: string;
  votes: any[];
  utilisateurId: string;
}

export default function BoutonVote({ messageId, votes, utilisateurId }: Props) {
  const votesPour = votes.filter((v) => v.type === 'POUR').length;
  const votesContre = votes.filter((v) => v.type === 'CONTRE').length;
  const monVote = votes.find((v) => v.votantId === utilisateurId);

  const [comptes, setComptes] = useState({ pour: votesPour, contre: votesContre });
  const [voteCourant, setVoteCourant] = useState(monVote?.type || null);

  const voter = async (type: 'POUR' | 'CONTRE') => {
    try {
      await api.post('/votes', { type, messageId });

      // Mise à jour optimiste de l'UI (sans rechargement)
      if (voteCourant === type) {
        // Annulation du vote
        setComptes((prev) => ({
          ...prev,
          [type === 'POUR' ? 'pour' : 'contre']:
            prev[type === 'POUR' ? 'pour' : 'contre'] - 1,
        }));
        setVoteCourant(null);
      } else {
        // Nouveau vote ou changement
        if (voteCourant) {
          setComptes((prev) => ({
            pour: voteCourant === 'POUR' ? prev.pour - 1 : prev.pour + (type === 'POUR' ? 1 : 0),
            contre: voteCourant === 'CONTRE' ? prev.contre - 1 : prev.contre + (type === 'CONTRE' ? 1 : 0),
          }));
        } else {
          setComptes((prev) => ({
            ...prev,
            [type === 'POUR' ? 'pour' : 'contre']:
              prev[type === 'POUR' ? 'pour' : 'contre'] + 1,
          }));
        }
        setVoteCourant(type);
      }
    } catch {
      toast.error('Impossible de voter');
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => voter('POUR')}
        className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition ${
          voteCourant === 'POUR'
            ? 'bg-green-500 text-white'
            : 'bg-green-50 text-green-700 hover:bg-green-100'
        }`}
      >
        👍 {comptes.pour}
      </button>
      <button
        onClick={() => voter('CONTRE')}
        className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition ${
          voteCourant === 'CONTRE'
            ? 'bg-red-500 text-white'
            : 'bg-red-50 text-red-700 hover:bg-red-100'
        }`}
      >
        👎 {comptes.contre}
      </button>
    </div>
  );
}