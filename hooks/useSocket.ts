// hooks/useSocket.ts
// Hook pour la connexion WebSocket — notifications en temps réel

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/authStore';

export function useSocket(debatId?: string) {
  const socketRef = useRef<Socket | null>(null);
  const { token } = useAuthStore();

  useEffect(() => {
    if (!token) return;

    // Connexion au serveur WebSocket avec le token JWT
    socketRef.current = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '', {
      auth: { token },
      transports: ['websocket'],
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('WebSocket connecté');

      // Rejoindre la salle du débat si un ID est fourni
      if (debatId) {
        socket.emit('rejoindre-debat', { debatId });
      }
    });

    socket.on('disconnect', () => {
      console.log('WebSocket déconnecté');
    });

    // Nettoyage à la fermeture du composant
    return () => {
      if (debatId) {
        socket.emit('quitter-debat', { debatId });
      }
      socket.disconnect();
    };
  }, [token, debatId]);

  return socketRef.current;
}