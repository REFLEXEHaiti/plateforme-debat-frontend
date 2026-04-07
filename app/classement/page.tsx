'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import api from '@/lib/api';

export default function PageClassement() {
  const [classement, setClassement] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const charger = async () => {
      try {
        const { data } = await api.get('/gamification/classement?limite=20');
        setClassement(data);
      } finally {
        setChargement(false);
      }
    };
    charger();
  }, []);

  const getMedaille = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-blue-900 mb-2">
          🏆 Classement général
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Les 20 meilleurs débatteurs de la plateforme
        </p>

        {chargement ? (
          <div className="text-center py-12 text-gray-400">Chargement...</div>
        ) : classement.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            Aucun résultat pour le moment.
          </div>
        ) : (
          <div className="space-y-2">
            {classement.map((item: any, index) => (
              <div
                key={item.userId}
                className={`bg-white rounded-xl p-4 shadow-sm flex items-center gap-4 ${
                  index < 3 ? 'border-2 border-yellow-200' : 'border border-gray-100'
                }`}
              >
                <span className="text-xl font-bold w-8 text-center">
                  {getMedaille(index)}
                </span>
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-900">
                  {item.user.prenom[0]}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {item.user.prenom} {item.user.nom}
                  </p>
                  <p className="text-xs text-gray-400">
                    Niveau {item.niveau} · {item.user.role}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-900">{item.points}</p>
                  <p className="text-xs text-gray-400">points</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}