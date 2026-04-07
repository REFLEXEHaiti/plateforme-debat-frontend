// lib/auth.ts
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  sub: string;
  email: string;
  role: string;
  exp: number;
}

export function decoderToken(token: string): TokenPayload | null {
  try {
    return jwtDecode<TokenPayload>(token);
  } catch {
    return null;
  }
}

export function tokenEstValide(token: string): boolean {
  const payload = decoderToken(token);
  if (!payload) return false;
  return payload.exp > Date.now() / 1000;
}

export function sauvegarderSession(token: string, utilisateur: object) {
  localStorage.setItem('access_token', token);
  localStorage.setItem('utilisateur', JSON.stringify(utilisateur));

  // Sauvegarde aussi dans un cookie pour le middleware Next.js
  document.cookie = `access_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`;
}

export function supprimerSession() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('utilisateur');

  // Supprime aussi le cookie
  document.cookie = 'access_token=; path=/; max-age=0';
}

export function getUtilisateurLocal() {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem('utilisateur');
  return data ? JSON.parse(data) : null;
}