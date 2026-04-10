// middleware.ts
// Protège uniquement les routes vraiment sensibles (dashboard, admin, paiement)
// NE redirige PAS les utilisateurs connectés hors de /auth — c'est contraignant
// NE touche PAS à la page d'accueil /

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes accessibles uniquement aux utilisateurs connectés
const ROUTES_PROTEGEES = [
  '/dashboard',
  '/admin',
  '/paiement',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Lire le token depuis le cookie
  const token = request.cookies.get('access_token')?.value;

  const estProtegee = ROUTES_PROTEGEES.some((r) => pathname.startsWith(r));

  // Non connecté → redirige vers connexion (uniquement pages vraiment protégées)
  if (estProtegee && !token) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/connexion';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // ✅ On ne redirige PLUS les utilisateurs connectés hors de /auth
  // Ils peuvent rester sur /auth/connexion ou /auth/inscription si besoin
  // (ex: connexion avec un autre compte)

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/paiement/:path*',
  ],
};
