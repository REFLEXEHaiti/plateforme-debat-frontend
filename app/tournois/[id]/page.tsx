'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function PageDetailTournoi() {
  const { id } = useParams();
  const { utilisateur } = useAuthStore();
  const [tournoi, setTournoi] = useState<any>(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const charger = async () => {
      try {
        const { data } = await api.get('/tournois/' + id);
        setTournoi(data);
      } finally {
        setChargement(false);
      }
    };
    charger();
  }, [id]);

  const genererCalendrier = async () => {
    try {
      await api.post('/tournois/' + id + '/generer-calendrier');
      toast.success('Calendrier genere par IA !');
      const { data } = await api.get('/tournois/' + id);
      setTournoi(data);
    } catch {
      toast.error('Erreur lors de la generation');
    }
  };

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'PROGRAMME': return 'bg-blue-100 text-blue-700';
      case 'EN_DIRECT': return 'bg-red-100 text-red-700';
      case 'TERMINE': return 'bg-gray-100 text-gray-500';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  if (chargement) return (
    <ProtectedRoute>
      <div className="text-center py-12 text-gray-400">Chargement...</div>
    </ProtectedRoute>
  );

  const estAdmin = ['ADMIN', 'FORMATEUR'].includes(utilisateur?.role || '');

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 py-8">

        <div className="bg-blue-900 text-white rounded-xl p-6 mb-6">
          <span className="text-xs bg-blue-700 px-2 py-1 rounded">
            {tournoi?.statut}
          </span>
          <h1 className="text-2xl font-bold mt-2">{tournoi?.nom}</h1>
          <p className="text-blue-200 mt-1">{tournoi?.description}</p>
          <div className="flex gap-4 mt-3 text-xs text-blue-300">
            <span>👥 {tournoi?.equipes?.length}/{tournoi?.maxEquipes} equipes</span>
            <span>📅 {new Date(tournoi?.dateDebut).toLocaleDateString('fr-FR')}</span>
          </div>
        </div>

        {estAdmin && tournoi?.statut === 'INSCRIPTION' && tournoi?.equipes?.length >= 4 && (
          <button
            onClick={genererCalendrier}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition mb-6"
          >
            🤖 Generer le calendrier avec IA
          </button>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <h2 className="text-lg font-semibold text-blue-900 mb-3">
              Equipes ({tournoi?.equipes?.length})
            </h2>
            <div className="space-y-2">
              {tournoi?.equipes?.map((equipe: any) => (
                <div key={equipe.id} className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="font-medium text-gray-900">{equipe.nom}</p>
                  <p className="text-xs text-gray-400">
                    Capitaine : {equipe.capitaine.prenom} {equipe.capitaine.nom}
                  </p>
                  <p className="text-xs text-gray-400">
                    {equipe.membres?.length} membre(s)
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-blue-900 mb-3">
              Matchs ({tournoi?.matchs?.length})
            </h2>
            <div className="space-y-2">
              {tournoi?.matchs?.map((match: any) => (
                <div key={match.id} className="bg-white rounded-xl p-4 shadow-sm">
                  <span className={'text-xs px-2 py-1 rounded ' + getStatutBadge(match.statut)}>
                    {match.statut}
                  </span>
                  <p className="text-sm font-medium text-gray-900 mt-2">
                    {match.equipe1?.nom} vs {match.equipe2?.nom}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 italic">
                    Sujet : {match.sujet}
                  </p>
                  <p className="text-xs text-gray-400">
                    Round {match.round} · {new Date(match.dateMatch).toLocaleDateString('fr-FR')}
                  </p>
                  {match.statut === 'TERMINE' && (
                    <p className="text-sm font-bold text-blue-900 mt-1">
                      {match.scoreEquipe1} - {match.scoreEquipe2}
                    </p>
                  )}
                </div>
              ))}
              {tournoi?.matchs?.length === 0 && (
                <p className="text-gray-400 text-sm text-center py-4">
                  Le calendrier sera genere apres les inscriptions
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </ProtectedRoute>
  );
}
