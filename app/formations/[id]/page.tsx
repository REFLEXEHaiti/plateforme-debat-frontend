'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function PageDetailFormation() {
  const { id } = useParams();
  const [cours, setCours] = useState<any>(null);
  const [progression, setProgression] = useState<any>(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const charger = async () => {
      try {
        const [c, p] = await Promise.all([
          api.get(`/cours/${id}`),
          api.get(`/cours/${id}/progression`),
        ]);
        setCours(c.data);
        setProgression(p.data);
      } finally {
        setChargement(false);
      }
    };
    charger();
  }, [id]);

  const sInscrire = async () => {
    try {
      await api.post(`/cours/${id}/inscrire`);
      toast.success('Inscription réussie !');
    } catch {
      toast.error('Erreur lors de l\'inscription');
    }
  };

  if (chargement) return (
    <ProtectedRoute>
      <div className="text-center py-12 text-gray-400">Chargement...</div>
    </ProtectedRoute>
  );

  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* En-tête */}
        <div className="bg-blue-900 text-white rounded-xl p-6 mb-6">
          <span className="text-xs bg-blue-700 px-2 py-1 rounded">
            {cours?.niveau}
          </span>
          <h1 className="text-2xl font-bold mt-3">{cours?.titre}</h1>
          <p className="text-blue-200 mt-2">{cours?.description}</p>
          <p className="text-xs text-blue-300 mt-3">
            Par {cours?.createur?.prenom} {cours?.createur?.nom}
          </p>
        </div>

        {/* Barre de progression */}
        {progression && (
          <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Progression</span>
              <span className="font-semibold text-blue-900">
                {progression.pourcentage}%
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${progression.pourcentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {progression.terminees}/{progression.totalLecons} leçons terminées
            </p>
          </div>
        )}

        {/* Bouton inscription */}
        <button
          onClick={sInscrire}
          className="w-full bg-blue-900 text-white py-3 rounded-xl font-medium hover:bg-blue-800 transition mb-6"
        >
          S'inscrire à cette formation
        </button>

        {/* Liste des leçons */}
        <h2 className="text-lg font-semibold text-blue-900 mb-4">
          📖 Leçons ({cours?.lecons?.length})
        </h2>
        <div className="space-y-3">
          {cours?.lecons?.map((lecon: any, index: number) => (
            <Link
              key={lecon.id}
              href={`/formations/${id}/lecons/${lecon.id}`}
            >
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-900">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{lecon.titre}</p>
                  <p className="text-xs text-gray-400">{lecon.dureeMin} min</p>
                </div>
                {lecon.pdfUrl && (
                  <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded">
                    PDF
                  </span>
                )}
                {lecon.quiz && (
                  <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded">
                    Quiz
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}