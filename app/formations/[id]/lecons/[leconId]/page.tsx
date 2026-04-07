'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function PageLecon() {
  const { id, leconId } = useParams();
  const router = useRouter();
  const [lecon, setLecon] = useState<any>(null);
  const [chargement, setChargement] = useState(true);
  const [feedbackIA, setFeedbackIA] = useState('');
  const [chargementIA, setChargementIA] = useState(false);

  useEffect(() => {
    const charger = async () => {
      try {
        const { data } = await api.get('/lecons/' + leconId);
        setLecon(data);
      } finally {
        setChargement(false);
      }
    };
    charger();
  }, [leconId]);

  const marquerTerminee = async () => {
    try {
      await api.post('/lecons/' + leconId + '/terminer');
      toast.success('Lecon marquee comme terminee !');
      router.push('/formations/' + id);
    } catch {
      toast.error('Erreur');
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
        <button
          onClick={() => router.push('/formations/' + id)}
          className="text-sm text-gray-400 hover:text-blue-600 mb-4 block"
        >
          Retour au cours
        </button>
        <h1 className="text-2xl font-bold text-blue-900 mb-2">{lecon?.titre}</h1>
        <p className="text-xs text-gray-400 mb-6">{lecon?.dureeMin} min de lecture</p>
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <p className="text-gray-700 whitespace-pre-wrap">{lecon?.contenu}</p>
        </div>
        {lecon?.pdfUrl && (
          <a href={lecon.pdfUrl} download className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-3 rounded-xl mb-6 hover:bg-red-100 transition">
            Telecharger le support PDF
          </a>
        )}
        <button
          onClick={marquerTerminee}
          className="w-full bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition"
        >
          Marquer comme terminee et continuer
        </button>
      </div>
    </ProtectedRoute>
  );
}
