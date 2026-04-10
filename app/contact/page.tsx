'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function PageContact() {
  const [sponsors, setSponsors] = useState<any[]>([]);
  const [form, setForm] = useState({ nom: '', email: '', sujet: '', message: '' });
  const [envoi, setEnvoi] = useState(false);
  const [succes, setSucces] = useState(false);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    api.get('/sponsoring/sponsors').then(({ data }) => { if (Array.isArray(data)) setSponsors(data); }).catch(() => {});
  }, []);

  const soumettre = async (e: React.FormEvent) => {
    e.preventDefault(); setEnvoi(true); setErreur('');
    try {
      await new Promise(r => setTimeout(r, 1000)); // Simule un envoi
      setSucces(true);
    } catch { setErreur('Erreur lors de l\'envoi. Réessayez.'); }
    setEnvoi(false);
  };

  const inp: React.CSSProperties = { width: '100%', padding: '13px 16px', border: '1.5px solid var(--line2)', borderRadius: 10, fontSize: 14, outline: 'none', fontFamily: "'Helvetica Neue',Arial,sans-serif", color: 'var(--ink)', background: 'white', boxSizing: 'border-box', transition: 'border-color 0.2s' };

  return (
    <div style={{ background: 'var(--page)', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0D1B2A, #1B263B)', padding: 'clamp(32px,5vw,56px) clamp(20px,5vw,80px)', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 'clamp(26px,4vw,44px)', fontWeight: 'normal', color: 'white', marginBottom: 12 }}>Contactez-nous</h1>
        <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 16, color: 'rgba(255,255,255,0.6)', maxWidth: 480, margin: '0 auto' }}>
          Une question, un partenariat, une suggestion ? Nous sommes à votre écoute.
        </p>
      </div>

      {/* Corps */}
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: 'clamp(32px,5vw,64px) clamp(20px,5vw,80px)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
        {/* Formulaire */}
        <div>
          <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 24, fontWeight: 'normal', color: 'var(--ink)', marginBottom: 24 }}>Envoyer un message</h2>
          {!succes ? (
            <form onSubmit={soumettre} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 700, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nom *</label>
                  <input type="text" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} placeholder="Jean Pierre" required style={inp} onFocus={e => e.target.style.borderColor = 'var(--ink)'} onBlur={e => e.target.style.borderColor = 'var(--line2)'}/>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 700, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>E-mail *</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="jean@email.com" required style={inp} onFocus={e => e.target.style.borderColor = 'var(--ink)'} onBlur={e => e.target.style.borderColor = 'var(--line2)'}/>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 700, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sujet *</label>
                <select value={form.sujet} onChange={e => setForm({ ...form, sujet: e.target.value })} required style={{ ...inp, appearance: 'none' as any }} onFocus={e => e.target.style.borderColor = 'var(--ink)'} onBlur={e => e.target.style.borderColor = 'var(--line2)'}>
                  <option value="">Choisir un sujet…</option>
                  <option value="partenariat">Devenir partenaire / sponsor</option>
                  <option value="formation">Question sur une formation</option>
                  <option value="tournoi">Question sur un tournoi</option>
                  <option value="technique">Problème technique</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 700, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Message *</label>
                <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Votre message…" rows={5} required style={{ ...inp, resize: 'vertical', lineHeight: 1.6 }} onFocus={e => e.target.style.borderColor = 'var(--ink)'} onBlur={e => e.target.style.borderColor = 'var(--line2)'}/>
              </div>
              {erreur && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#DC2626', fontFamily: "'Helvetica Neue',Arial,sans-serif" }}>⚠ {erreur}</div>}
              <button type="submit" disabled={envoi} style={{ width: '100%', padding: '14px', background: envoi ? 'rgba(192,50,26,0.5)' : 'linear-gradient(135deg, #C0321A, #A02818)', color: 'white', border: 'none', borderRadius: 10, fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 700, fontSize: 15, cursor: envoi ? 'not-allowed' : 'pointer', boxShadow: '0 4px 16px rgba(192,50,26,0.3)' }}>
                {envoi ? '⏳ Envoi…' : 'Envoyer le message'}
              </button>
            </form>
          ) : (
            <div style={{ background: 'white', border: '1px solid var(--line2)', borderRadius: 16, padding: '40px', textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 14 }}>✅</div>
              <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 22, fontWeight: 'normal', color: 'var(--ink)', marginBottom: 10 }}>Message envoyé !</h3>
              <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 14, color: 'var(--muted)', lineHeight: 1.6 }}>Merci {form.nom}. Nous vous répondrons dans les 48h à <strong>{form.email}</strong>.</p>
            </div>
          )}
        </div>

        {/* Informations + sponsors */}
        <div>
          <div style={{ background: 'white', border: '1px solid var(--line2)', borderRadius: 16, padding: '28px', marginBottom: 24 }}>
            <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 20, fontWeight: 'normal', color: 'var(--ink)', marginBottom: 20 }}>Coordonnées</h2>
            {[
              { icon: '📧', label: 'Email', value: 'contact@debathaiti.org' },
              { icon: '💬', label: 'WhatsApp', value: '+509 XXXX XXXX' },
              { icon: '📍', label: 'Localisation', value: 'Port-au-Prince, Haïti' },
              { icon: '⏰', label: 'Disponible', value: 'Lun–Ven, 8h–18h' },
            ].map(c => (
              <div key={c.label} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '10px 0', borderBottom: '1px solid var(--line2)' }}>
                <span style={{ fontSize: 20 }}>{c.icon}</span>
                <div>
                  <div style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{c.label}</div>
                  <div style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 14, color: 'var(--ink)' }}>{c.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Sponsors */}
          <div style={{ background: 'white', border: '1px solid var(--line2)', borderRadius: 16, padding: '24px' }}>
            <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 18, fontWeight: 'normal', color: 'var(--ink)', marginBottom: 16 }}>Nos partenaires</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {(sponsors.length > 0 ? sponsors.map(s => s.nom) : ['AyiboPost', 'YWCA Haïti', 'Decathlon', 'eiffortic Haïti', 'Sun Auto']).map(nom => (
                <div key={nom} style={{ background: 'var(--page2)', border: '1px solid var(--line2)', padding: '8px 16px', borderRadius: 8, fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{nom}</div>
              ))}
            </div>
            <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 13, color: 'var(--muted)', marginTop: 16, lineHeight: 1.6 }}>
              Intéressé par un partenariat ? Écrivez-nous via le formulaire en choisissant "Devenir partenaire".
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"]:not([style*="gap: 14"]) { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
