'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

const VILLES = ['Port-au-Prince', 'Pétion-Ville', 'Cap-Haïtien', 'Gonaïves', 'Les Cayes', 'Jacmel', 'Saint-Marc', 'Miami', 'New York', 'Montréal', 'Paris', 'Autre'];

function RubinMark({ size = 28 }: { size?: number }) {
  const h = Math.round(size * 1.18);
  return (
    <svg width={size} height={h} viewBox="0 0 22 26" fill="none">
      <path d="M11 1.2C9 3.2,6.5 5.2,4.8 7.2C3.2 9.2,2.8 11.2,3.8 13.2C4.8 15.2,6.8 17,7.5 19.8C8.2 22.4,9.2 24.2,11 24.2C12.8 24.2,13.8 22.4,14.5 19.8C15.2 17,17.2 15.2,18.2 13.2C19.2 11.2,18.8 9.2,17.2 7.2C15.5 5.2,13 3.2,11 1.2Z" fill="currentColor"/>
    </svg>
  );
}

const inp: React.CSSProperties = {
  width: '100%', padding: '13px 16px',
  border: '1.5px solid #E2E8F0', borderRadius: 10,
  fontSize: 15, outline: 'none', boxSizing: 'border-box',
  fontFamily: "'Helvetica Neue',Arial,sans-serif",
  color: '#0D1B2A', background: 'white', transition: 'border-color 0.2s',
};

const lbl: React.CSSProperties = {
  display: 'block', fontSize: 13, fontFamily: "'Helvetica Neue',Arial,sans-serif",
  fontWeight: 600, color: '#1E293B', marginBottom: 6,
};

const PARTENAIRES = ['Boyy Tralore\nSun Auto', 'AyiboPost', 'YWCA Haïti', 'Decathlon', '🌍'];

export default function PageInscription() {
  const { inscrire, chargement } = useAuth();
  const [form, setForm] = useState({ prenom: '', nom: '', email: '', motDePasse: '', ville: '', whatsapp: '', role: 'APPRENANT' });
  const [voirMDP, setVoirMDP] = useState(false);
  const [erreurs, setErreurs] = useState<Record<string, string>>({});
  const [erreurGlobal, setErreurGlobal] = useState('');

  const set = useCallback((k: string, v: string) => setForm(f => ({ ...f, [k]: v })), []);

  const valider = () => {
    const e: Record<string, string> = {};
    if (!form.prenom.trim()) e.prenom = 'Requis';
    if (!form.nom.trim()) e.nom = 'Requis';
    if (!form.email.includes('@')) e.email = 'Email invalide';
    if (form.motDePasse.length < 6) e.motDePasse = 'Minimum 6 caractères';
    setErreurs(e);
    return Object.keys(e).length === 0;
  };

  const soumettre = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valider()) return;
    setErreurGlobal('');
    try {
      await inscrire({ email: form.email, motDePasse: form.motDePasse, prenom: form.prenom, nom: form.nom, role: form.role, ville: form.ville, whatsapp: form.whatsapp });
    } catch (err: any) {
      setErreurGlobal(err?.message || 'Erreur lors de l\'inscription');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #0A1628 0%, #0D1B2A 40%, #1B2D4A 70%, #0A1628 100%)', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Décor fond */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(27,63,139,0.2) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(192,50,26,0.08) 0%, transparent 40%)', pointerEvents: 'none' }}/>
      {/* Illustration fond droit */}
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '40%', opacity: 0.15, background: 'url(https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=60) center/cover', pointerEvents: 'none' }}/>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(24px,4vw,48px) clamp(16px,4vw,32px)', position: 'relative', zIndex: 1 }}>
        <div style={{ background: 'white', borderRadius: 24, padding: 'clamp(28px,4vw,44px)', width: '100%', maxWidth: 560, boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: '50%', background: '#F1F5F9', marginBottom: 6, color: '#0D1B2A' }}>
              <RubinMark size={20}/>
            </div>
            <div style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: '#64748B', textTransform: 'uppercase', marginBottom: 4 }}>HT</div>
            <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 'clamp(22px,3vw,28px)', fontWeight: 700, color: '#0D1B2A', margin: 0, marginBottom: 6 }}>Créer un compte</h1>
            <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 14, color: '#64748B' }}>Rejoignez la communauté Débat Haïti</p>
          </div>

          <form onSubmit={soumettre} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Rôle */}
            <div>
              <label style={lbl}>Vous êtes <span style={{ color: '#ef4444' }}>*</span></label>
              <div style={{ display: 'flex', gap: 8 }}>
                {[{ id: 'APPRENANT', label: '🎓 Apprenant' }, { id: 'SPECTATEUR', label: '👁 Spectateur' }, { id: 'FORMATEUR', label: '🏫 Formateur' }].map(r => (
                  <button key={r.id} type="button" onClick={() => set('role', r.id)} style={{ flex: 1, padding: '10px 6px', borderRadius: 10, border: `1.5px solid ${form.role === r.id ? '#0D1B2A' : '#E2E8F0'}`, background: form.role === r.id ? '#F0F4FF' : 'white', color: form.role === r.id ? '#0D1B2A' : '#94A3B8', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Prénom + Nom */}
            <div className="dh-two-col-form" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={lbl}>Prénom <span style={{ color: '#ef4444' }}>*</span></label>
                <input type="text" value={form.prenom} onChange={e => set('prenom', e.target.value)} placeholder="Jean" style={{ ...inp, borderColor: erreurs.prenom ? '#ef4444' : '#E2E8F0' }}
                  onFocus={e => { e.target.style.borderColor = '#0D1B2A'; e.target.style.background = '#F8FAFF'; }}
                  onBlur={e => { e.target.style.borderColor = erreurs.prenom ? '#ef4444' : '#E2E8F0'; e.target.style.background = 'white'; }}/>
                {erreurs.prenom && <p style={{ color: '#ef4444', fontSize: 11, marginTop: 4, fontFamily: "'Helvetica Neue',Arial,sans-serif" }}>⚠ {erreurs.prenom}</p>}
              </div>
              <div>
                <label style={lbl}>Nom <span style={{ color: '#ef4444' }}>*</span></label>
                <input type="text" value={form.nom} onChange={e => set('nom', e.target.value)} placeholder="Pierre" style={{ ...inp, borderColor: erreurs.nom ? '#ef4444' : '#E2E8F0' }}
                  onFocus={e => { e.target.style.borderColor = '#0D1B2A'; e.target.style.background = '#F8FAFF'; }}
                  onBlur={e => { e.target.style.borderColor = erreurs.nom ? '#ef4444' : '#E2E8F0'; e.target.style.background = 'white'; }}/>
                {erreurs.nom && <p style={{ color: '#ef4444', fontSize: 11, marginTop: 4, fontFamily: "'Helvetica Neue',Arial,sans-serif" }}>⚠ {erreurs.nom}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={lbl}>E-mail <span style={{ color: '#ef4444' }}>*</span></label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="jean@email.com" style={{ ...inp, borderColor: erreurs.email ? '#ef4444' : '#E2E8F0', background: form.email ? '#F0F6FF' : 'white' }}
                onFocus={e => { e.target.style.borderColor = '#0D1B2A'; e.target.style.background = '#F0F6FF'; }}
                onBlur={e => { e.target.style.borderColor = erreurs.email ? '#ef4444' : '#E2E8F0'; }}/>
              {erreurs.email && <p style={{ color: '#ef4444', fontSize: 11, marginTop: 4, fontFamily: "'Helvetica Neue',Arial,sans-serif" }}>⚠ {erreurs.email}</p>}
            </div>

            {/* Mot de passe */}
            <div>
              <label style={lbl}>Mot de passe</label>
              <div style={{ position: 'relative' }}>
                <input type={voirMDP ? 'text' : 'password'} value={form.motDePasse} onChange={e => set('motDePasse', e.target.value)} placeholder="••••••••••" style={{ ...inp, paddingRight: 44, borderColor: erreurs.motDePasse ? '#ef4444' : '#E2E8F0' }}
                  onFocus={e => { e.target.style.borderColor = '#0D1B2A'; e.target.style.background = '#F8FAFF'; }}
                  onBlur={e => { e.target.style.borderColor = erreurs.motDePasse ? '#ef4444' : '#E2E8F0'; e.target.style.background = 'white'; }}/>
                <button type="button" onClick={() => setVoirMDP(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', fontSize: 16 }}>
                  {voirMDP ? '🙈' : '👁'}
                </button>
              </div>
              {erreurs.motDePasse && <p style={{ color: '#ef4444', fontSize: 11, marginTop: 4, fontFamily: "'Helvetica Neue',Arial,sans-serif" }}>⚠ {erreurs.motDePasse}</p>}
            </div>

            {/* Ville + WhatsApp */}
            <div className="dh-two-col-form" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={lbl}>Ville / Pays</label>
                <select value={form.ville} onChange={e => set('ville', e.target.value)} style={{ ...inp, appearance: 'none' as any, backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2394A3B8\' stroke-width=\'2\'%3E%3Cpolyline points=\'6,9 12,15 18,9\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', backgroundSize: '16px' }}
                  onFocus={e => e.target.style.borderColor = '#0D1B2A'}
                  onBlur={e => e.target.style.borderColor = '#E2E8F0'}>
                  <option value="">Choisir...</option>
                  {VILLES.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>WhatsApp (optionnel)</label>
                <input type="tel" value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} placeholder="+509 XXXX XXXX" style={inp}
                  onFocus={e => { e.target.style.borderColor = '#0D1B2A'; e.target.style.background = '#F8FAFF'; }}
                  onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.background = 'white'; }}/>
              </div>
            </div>

            {erreurGlobal && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#DC2626', fontFamily: "'Helvetica Neue',Arial,sans-serif" }}>
                ⚠ {erreurGlobal}
              </div>
            )}

            {/* Texte bas */}
            <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 12, color: '#94A3B8', textAlign: 'center', margin: 0 }}>
              <strong style={{ color: '#0D1B2A' }}>Inscription rapide</strong> · Rejoignez des centaines de membres actifs.
            </p>

            {/* Partenaires */}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', paddingBottom: 4 }}>
              {['Sun Auto', 'AyiboPost', 'YWCA Haïti', 'Decathlon'].map(p => (
                <div key={p} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '6px 12px', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 11, color: '#64748B', fontWeight: 600 }}>{p}</div>
              ))}
            </div>

            {/* Bouton */}
            <button type="submit" disabled={chargement} style={{ width: '100%', padding: '15px', borderRadius: 12, background: chargement ? 'rgba(192,50,26,0.5)' : 'linear-gradient(135deg, #C0321A, #A02818)', color: 'white', border: 'none', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 700, fontSize: 16, cursor: chargement ? 'not-allowed' : 'pointer', letterSpacing: '0.04em', boxShadow: '0 4px 16px rgba(192,50,26,0.35)' }}>
              {chargement ? '⏳ Création...' : 'CONTINUER'}
            </button>

            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: 13, color: '#94A3B8', fontFamily: "'Helvetica Neue',Arial,sans-serif" }}>Déjà un compte ? </span>
              <Link href="/auth/connexion" style={{ color: '#C0321A', fontWeight: 700, textDecoration: 'none', fontSize: 13, fontFamily: "'Helvetica Neue',Arial,sans-serif" }}>Se connecter</Link>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        @media (max-width: 480px) {
          .dh-two-col-form { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
