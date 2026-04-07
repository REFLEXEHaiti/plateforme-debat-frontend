'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function PageLive() {
  const { id } = useParams();
  const { utilisateur } = useAuthStore();
  const [live, setLive] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [nouveauMessage, setNouveauMessage] = useState('');
  const [chargement, setChargement] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const peutChat = ['ADMIN', 'FORMATEUR', 'APPRENANT'].includes(
    utilisateur?.role || ''
  );

  useEffect(() => {
    const charger = async () => {
      try {
        const { data } = await api.get(`/lives/${id}`);
        setLive(data);
        setMessages(data.messagesLive || []);
      } finally {
        setChargement(false);
      }
    };
    charger();

    // Rafraîchir le chat toutes les 5 secondes si EN_DIRECT
    const interval = setInterval(async () => {
      try {
        const { data } = await api.get(`/lives/${id}`);
        setMessages(data.messagesLive || []);
      } catch {}
    }, 5000);

    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const envoyerMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nouveauMessage.trim()) return;
    try {
      const { data } = await api.post(`/lives/${id}/chat`, {
        contenu: nouveauMessage,
      });
      setMessages((prev) => [...prev, data]);
      setNouveauMessage('');
    } catch {
      toast.error('Impossible d\'envoyer le message');
    }
  };

  // Extraire l'ID YouTube pour l'embed
  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : null;
  };

  if (chargement) return (
    <ProtectedRoute>
      <div className="text-center py-12 text-gray-400">Chargement...</div>
    </ProtectedRoute>
  );

  const embedUrl = live?.youtubeUrl
    ? getYoutubeEmbedUrl(live.youtubeUrl)
    : live?.replayUrl
    ? getYoutubeEmbedUrl(live.replayUrl)
    : null;

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto px-4 py-6">

        <div className="flex gap-1 items-center mb-4">
          {live?.statut === 'EN_DIRECT' && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded animate-pulse">
              🔴 EN DIRECT
            </span>
          )}
          <h1 className="text-xl font-bold text-blue-900 ml-2">{live?.titre}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Lecteur vidéo */}
          <div className="lg:col-span-2">
            {embedUrl ? (
              <div className="aspect-video rounded-xl overflow-hidden bg-black">
                <iframe
                  src={embedUrl}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                />
              </div>
            ) : (
              <div className="aspect-video rounded-xl bg-gray-900 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-4xl mb-3">📡</div>
                  <p className="text-lg font-medium">
                    {live?.statut === 'PROGRAMME'
                      ? 'Le direct n\'a pas encore commencé'
                      : 'Flux vidéo non disponible'}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Début prévu : {new Date(live?.dateDebut).toLocaleString('fr-FR')}
                  </p>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl p-4 mt-4 shadow-sm">
              <p className="text-gray-600 text-sm">{live?.description}</p>
              <div className="flex gap-4 mt-2 text-xs text-gray-400">
                <span>👁️ {live?.vues} vues</span>
                <span>Par {live?.createur?.prenom} {live?.createur?.nom}</span>
              </div>
            </div>
          </div>

          {/* Chat live */}
          <div className="bg-white rounded-xl shadow-sm flex flex-col" style={{ height: '500px' }}>
            <div className="p-3 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 text-sm">
                💬 Chat en direct ({messages.length})
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {messages.map((msg: any) => (
                <div key={msg.id} className="text-sm">
                  <span className="font-medium text-blue-900">
                    {msg.auteur.prenom}
                  </span>
                  <span className="text-gray-400 text-xs ml-1">
                    {msg.auteur.role}
                  </span>
                  <p className="text-gray-700 mt-0.5">{msg.contenu}</p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {peutChat ? (
              <form onSubmit={envoyerMessage} className="p-3 border-t border-gray-100">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={nouveauMessage}
                    onChange={(e) => setNouveauMessage(e.target.value)}
                    placeholder="Votre message..."
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="bg-blue-900 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-800"
                  >
                    →
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-3 border-t border-gray-100 text-center text-xs text-gray-400">
                Mode spectateur — lecture seule
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}