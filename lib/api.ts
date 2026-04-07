// lib/api.ts
// Instance Axios configurée pour communiquer avec le backend NestJS
// Injecte automatiquement le token JWT dans chaque requête

import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur — ajoute le token JWT avant chaque requête
api.interceptors.request.use((config) => {
  // Récupère le token depuis le localStorage
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
        window.location.href = '/auth/connexion';
      }
    }
    return Promise.reject(error);
  }
);

export default api;