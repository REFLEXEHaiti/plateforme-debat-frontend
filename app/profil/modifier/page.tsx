'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';

const VILLES = [
  'Port-au-Prince', 'Pétion-Ville', 'Cap-Haïtien', 'Gonaïves', 'Les Cayes',
  'Jacmel', 'Saint-Marc', 'Hinche', 'Jérémie', 'Fort-Liberté',
  'Miami', 'New York', 'Boston', 'Montréal', 'Paris', 'Autre'
];

const labelStyle = { display: 'block', fontSize: '13px', color: 'rgba(0,0,0,0.55)', marginBottom: '6px', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: '600' };
const inputBase = { width: '100%', padding: '11px 14px', border: '1.5px solid rgba(0,0,0,0.12)', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const, color: '#111', background: 'white', fontFamily: "'Helvetica Neue',Arial,sans-serif", transition: 'border-color 0.2s' };

export default function PageModifierProfil() {
  const { utilisateur } = useAuthStore();
  const router = useRouter();
  const [chargement, setChargement] = useState(false);
  const [form, setForm] = useState({ prenom: '', nom: '', bio: '', ville: '', whatsapp: '' });

  useEffect(() => {
    if (utilisateur) {
      setForm(f => ({ ...f, prenom: utilisateur.prenom || '', nom: utilisateur.nom || '' }));
    }
    api.get('/profils/moi').then(({ data }) => {
      setForm({ prenom: data.prenom || utilisateur?.prenom || '', nom: data.nom || utilisateur?.nom || '', bio: data.bio || '', ville: data.ville || '', whatsapp: data.whatsapp || '' });
    }).catch(() => {});
  }, [utilisateur]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setChargement(true);
    try {
      await api.patch('/profils/moi', form);
      toast.success('Profil mis à jour avec succès !');
      router.push(`/profil/${utilisateur?.id}?updated=1`);
    } catch {
      toast.error('Erreur lors de la mise à jour du profil');
    } finally {
      setChargement(false);
    }
  };

  const initiales = utilisateur ? (utilisateur.prenom?.[0] || '') + (utilisateur.nom?.[0] || '') : '?';

  return (
    <ProtectedRoute>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0D1B2A 0%, #1B263B 60%, #0A0F1E 100%)', padding: 'clamp(24px,5vw,60px) 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'radial-gradient(circle at 10% 30%, rgba(192,50,26,0.07) 0%, transparent 50%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 560, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{ width: 80, height: 80, background: 'linear-gradient(135deg, #C0321A, #8B1A0A)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, color: 'white', fontFamily: 'Georgia,serif', margin: '0 auto 16px', border: '3px solid rgba(255,255,255,0.15)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
              {initiales.toUpperCase()}
            </div>
            <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 'clamp(22px,4vw,30px)', color: 'white', fontWeight: 'normal', marginBottom: 8 }}>Modifier mon profil</h1>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 14 }}>Rejoignez la communauté Débat Haïti</p>
          </div>

          <div style={{ background: 'white', borderRadius: 20, padding: 'clamp(24px,5vw,40px)', boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={labelStyle}>Prénom *</label>
                  <input type="text" value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })} placeholder="Jean" required style={inputBase} onFocus={e => { e.target.style.borderColor = '#C0321A'; e.target.style.boxShadow = '0 0 0 3px rgba(192,50,26,0.1)'; }} onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.12)'; e.target.style.boxShadow = 'none'; }} />
                </div>
                <div>
                  <label style={labelStyle}>Nom *</label>
                  <input type="text" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} placeholder="Pierre" required style={inputBase} onFocus={e => { e.target.style.borderColor = '#C0321A'; e.target.style.boxShadow = '0 0 0 3px rgba(192,50,26,0.1)'; }} onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.12)'; e.target.style.boxShadow = 'none'; }} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Ville / Pays</label>
                <select value={form.ville} onChange={e => setForm({ ...form, ville: e.target.value })} style={{ ...inputBase, appearance: 'none' as any }} onFocus={e => { e.target.style.borderColor = '#C0321A'; }} onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.12)'; }}>
                  <option value="">Sélectionner...</option>
                  {VILLES.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>📱 WhatsApp (optionnel)</label>
                <input type="tel" value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })} placeholder="+509 XXXX XXXX" style={inputBase} onFocus={e => { e.target.style.borderColor = '#C0321A'; }} onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.12)'; }} />
              </div>
              <div>
                <label style={labelStyle}>Biographie</label>
                <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} placeholder="Parlez de vous en quelques mots…" rows={4} style={{ ...inputBase, resize: 'vertical', minHeight: '100px', lineHeight: '1.6' }} onFocus={e => { e.target.style.borderColor = '#C0321A'; e.target.style.boxShadow = '0 0 0 3px rgba(192,50,26,0.1)'; }} onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.12)'; e.target.style.boxShadow = 'none'; }} />
              </div>
              <button type="submit" disabled={chargement} style={{ width: '100%', padding: '15px', borderRadius: '12px', background: chargement ? 'rgba(192,50,26,0.5)' : 'linear-gradient(135deg, #C0321A, #A02818)', color: 'white', border: 'none', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 700, fontSize: 15, cursor: chargement ? 'not-allowed' : 'pointer', letterSpacing: '0.04em', boxShadow: '0 4px 16px rgba(192,50,26,0.35)' }}>
                {chargement ? '⏳ Enregistrement...' : 'Enregistrer les modifications'}
              </button>
              <div style={{ textAlign: 'center' }}>
                <Link href={`/profil/${utilisateur?.id}`} style={{ color: 'rgba(0,0,0,0.4)', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 13, textDecoration: 'none' }}>← Retour au profil</Link>
              </div>
            </form>
          </div>

          <div style={{ marginTop: 32, display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', alignItems: 'center' }}>
            {['AyiboPost', 'YWCA Haïti', 'Decathlon', 'Debat Haiti'].map(p => (
              <span key={p} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.5)', padding: '5px 14px', borderRadius: 100, fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 12 }}>{p}</span>
            ))}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:480px){form > div:first-of-type{grid-template-columns:1fr!important}}`}</style>
    </ProtectedRoute>
  );
}
