'use client';

import { useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function PageMotDePasseOublie() {
  const [email, setEmail] = useState('');
  const [envoye, setEnvoye] = useState(false);
  const [chargement, setChargement] = useState(false);

  const soumettre = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) { toast.error('Email invalide'); return; }
    setChargement(true);
    try {
      await api.post('/auth/mot-de-passe-oublie', { email });
      setEnvoye(true);
    } catch {
      // Afficher succès même si erreur pour sécurité
      setEnvoye(true);
    } finally {
      setChargement(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: 'linear-gradient(135deg, #0A2540 0%, #001F3F 50%, #0A0F1E 100%)', position: 'relative' }}>
      <div style={{ position: 'absolute', right: '5%', top: '50%', transform: 'translateY(-50%)', opacity: 0.06, pointerEvents: 'none', fontSize: '400px', lineHeight: 1 }}>🌍</div>

      <div style={{ background: 'white', borderRadius: '24px', padding: '40px', width: '100%', maxWidth: '420px', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', position: 'relative', zIndex: 1 }}>
        {!envoye ? (
          <>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔐</div>
              <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0A2540', margin: 0 }}>Mot de passe oublié</h1>
              <p style={{ color: 'rgba(0,0,0,0.4)', fontSize: '14px', marginTop: '8px' }}>Entrez votre email pour recevoir un lien de réinitialisation</p>
            </div>
            <form onSubmit={soumettre} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'rgba(0,0,0,0.6)', marginBottom: '6px', fontWeight: 600 }}>Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="jean@email.com"
                  style={{ width: '100%', padding: '11px 14px', border: '1.5px solid rgba(0,0,0,0.15)', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <button type="submit" disabled={chargement} style={{ background: 'linear-gradient(135deg, #00D4FF, #7B61FF)', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: 700, fontSize: '15px', cursor: 'pointer', opacity: chargement ? 0.7 : 1 }}>
                {chargement ? 'Envoi...' : 'Envoyer le lien de réinitialisation'}
              </button>

              {/* Option WhatsApp */}
              <div style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(0,0,0,0.4)' }}>— ou —</div>
              <a href="https://wa.me/50999999999?text=J%27ai%20oublié%20mon%20mot%20de%20passe" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#25D366', color: 'white', padding: '12px', borderRadius: '12px', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
                💬 Récupérer via WhatsApp
              </a>

              <div style={{ textAlign: 'center' }}>
                <Link href="/auth/connexion" style={{ fontSize: '14px', color: '#00D4FF', fontWeight: 600, textDecoration: 'none' }}>← Retour à la connexion</Link>
              </div>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0A2540', marginBottom: '12px' }}>Email envoyé !</h2>
            <p style={{ fontSize: '14px', color: 'rgba(0,0,0,0.5)', marginBottom: '24px', lineHeight: 1.6 }}>
              Si un compte existe avec <strong>{email}</strong>, vous recevrez un lien de réinitialisation dans quelques minutes.
            </p>
            <p style={{ fontSize: '13px', color: 'rgba(0,0,0,0.4)', marginBottom: '24px' }}>Vérifiez aussi vos spams.</p>
            <Link href="/auth/connexion" style={{ display: 'block', background: 'linear-gradient(135deg, #00D4FF, #7B61FF)', color: 'white', padding: '14px', borderRadius: '12px', textDecoration: 'none', fontWeight: 700, fontSize: '15px', textAlign: 'center' }}>
              Retour à la connexion
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
