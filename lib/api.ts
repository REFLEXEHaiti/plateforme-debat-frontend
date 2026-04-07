// lib/api.ts
// Instance Axios configurée pour communiquer avec le backend NestJS
// Injecte automatiquement le token JWT dans chaque requête

import axios from 'axios';

// CORRECTION : le backend utilise app.setGlobalPrefix('api')
// donc toutes les routes sont /api/... — on l'ajoute ici une seule fois
const baseURL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '') + '/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur — ajoute le token JWT avant chaque requête
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Intercepteur — gère les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si le token est expiré ou invalide → déconnexion automatique
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('utilisateur');
        // Éviter la boucle de redirect si déjà sur la page de connexion
        if (!window.location.pathname.startsWith('/auth/')) {
          window.location.href = '/auth/connexion';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
