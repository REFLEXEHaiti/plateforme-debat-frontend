'use client';

import BoutonVote from '@/components/votes/BoutonVote';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  contenu: string;
  auteur: { id: string; prenom: string; nom: string; role: string };
  createdAt: string;
  votes: any[];
}

interface Props {
  messages: Message[];
  utilisateurId: string;
  userRole: string;
}

export default function ListeMessages({ messages, utilisateurId, userRole }: Props) {
  const masquerMessage = async (messageId: string) => {
    try {
      await api.patch(`/messages/${messageId}/masquer`);
      toast.success('Message masqué');
    } catch {
      toast.error('Impossible de masquer ce message');
    }
  };

  if (messages.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        Aucun message pour le moment. Soyez le premier à participer !
      </div>
    );
  }

  return (
    <div className="space-y-4 mb-6">
      {messages.map((message) => (
        <div key={message.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">

          {/* En-tête du message */}
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="font-medium text-gray-900">
                {message.auteur.prenom} {message.auteur.nom}
              </span>
              <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                {message.auteur.role}
              </span>
            </div>
            <span className="text-xs text-gray-400">
              {new Date(message.createdAt).toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          {/* Contenu */}
          <p className="text-gray-700 mb-3">{message.contenu}</p>

          {/* Actions */}
          <div className="flex justify-between items-center">
            <BoutonVote messageId={message.id} votes={message.votes} utilisateurId={utilisateurId} />

            {/* Bouton modération — ADMIN et FORMATEUR seulement */}
            {['ADMIN', 'FORMATEUR'].includes(userRole) && (
              <button
                onClick={() => masquerMessage(message.id)}
                className="text-xs text-red-400 hover:text-red-600 transition"
              >
                Masquer
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}