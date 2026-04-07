'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

const MOCK_SPONSORS = [
  { id: 'S1', nom: 'Digicel Haïti', description: 'Leader des télécommunications en Haïti', siteWeb: 'https://digicelhaiti.com', typeContrat: 'PLATINE', logoUrl: '', couleur: '#FF6600' },
  { id: 'S2', nom: 'BNC Haïti', description: 'Banque Nationale de Crédit — partenaire financier', siteWeb: 'https://bnc.ht', typeContrat: 'OR', logoUrl: '', couleur: '#c00000' },
  { id: 'S3', nom: 'Unibank', description: 'Votre partenaire bancaire de confiance', siteWeb: '', typeContrat: 'ARGENT', logoUrl: '', couleur: '#003087' },
];

const FORM_VIDE = {
  nom: '',
  description: '',
  siteWeb: '',
  typeContrat: 'OR',
  couleur: '#003087',
  logoUrl: '',
};

export default function PageSponsors() {
  const [sponsors, setSponsors] = useState<any[]>(MOCK_SPONSORS);
  const [chargement, setChargement] = useState(true);
  const [modalAjout, setModalAjout] = useState(false);
  const [form, setForm] = useState<any>(FORM_VIDE);
  const [logoPreview, setLogoPreview] = useState('');
  const [envoi, setEnvoi] = useState(false);
  const [succes, setSucces] = useState('');
  const logoInputRef = useRef<HTMLInputElement>(null);
  const { utilisateur } = useAuthStore();
  const estAdmin = utilisateur?.role === 'ADMIN';

  useEffect(() => {
    api.get('/sponsoring/sponsors')
      .then(({ data }) => { if (Array.isArray(data) && data.length) setSponsors(data); })
      .catch(() => {})
      .finally(() => setChargement(false));
  }, []);

  const getCouleurBadge = (type: string) => {
    if (type === 'PLATINE') return { bg: '#F8FAFC', border: '#94A3B8', text: '#475569', emoji: '💎' };
    if (type === 'OR') return { bg: '#FFFBEB', border: '#F59E0B', text: '#92400E', emoji: '🥇' };
    if (type === 'ARGENT') return { bg: '#F8FAFC', border: '#94A3B8', text: '#475569', emoji: '🥈' };
    return { bg: '#FFF7ED', border: '#F97316', text: '#9A3412', emoji: '🥉' };
  };

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fichier = e.target.files?.[0];
    if (!fichier) return;
    if (fichier.size > 5 * 1024 * 1024) { alert('Logo max 5 MB'); return; }
    const url = URL.createObjectURL(fichier);
    setLogoPreview(url);
    setForm({ ...form, logoUrl: url });
  };

  const ajouterSponsor = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnvoi(true);
    const nouveauSponsor = { id: 'S' + Date.now(), ...form, logoUrl: logoPreview || form.logoUrl };
    setSponsors(prev => [nouveauSponsor, ...prev]);
    setSucces('Partenaire "' + form.nom + '" ajouté !');
    setModalAjout(false);
    setForm(FORM_VIDE);
    setLogoPreview('');
    setEnvoi(false);
    try {
      await api.post('/sponsoring/sponsors', nouveauSponsor);
    } catch {}
  };

  const supprimerSponsor = async (id: string) => {
    if (!confirm('Supprimer ce partenaire ?')) return;
    setSponsors(prev => prev.filter(s => s.id !== id));
    try { await api.delete('/sponsoring/sponsors/' + id); } catch {}
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>

      {succes && (
        <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '12px', padding: '12px 16px', marginBottom: '24px', fontSize: '14px', color: '#065F46', display: 'flex', justifyContent: 'space-between' }}>
          ✅ {succes}
          <button onClick={() => setSucces('')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#065F46' }}>✕</button>
        </div>
      )}

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#0A2540', marginBottom: '8px' }}>🤝 Nos partenaires</h1>
        <p style={{ color: '#6B7280', fontSize: '16px' }}>Ces organisations soutiennent la culture du débat en Haïti</p>
        {estAdmin && (
          <button
            onClick={() => setModalAjout(true)}
            style={{ marginTop: '16px', background: 'linear-gradient(135deg, #00D4FF, #7B61FF)', color: 'white', border: 'none', borderRadius: '12px', padding: '10px 24px', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}
          >
            + Ajouter un partenaire
          </button>
        )}
      </div>

      {/* Grille sponsors */}
      {chargement ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#9CA3AF' }}>Chargement...</div>
      ) : sponsors.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#9CA3AF' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤝</div>
          <p>Aucun partenaire pour le moment.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '48px' }}>
          {sponsors.map(sponsor => {
            const badge = getCouleurBadge(sponsor.typeContrat);
            return (
              <div key={sponsor.id} style={{ background: 'white', borderRadius: '20px', border: '2px solid ' + badge.border, padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', position: 'relative' }}>

                {/* Badge contrat */}
                <div style={{ position: 'absolute', top: '16px', right: '16px', background: badge.bg, border: '1px solid ' + badge.border, borderRadius: '20px', padding: '3px 10px', fontSize: '11px', fontWeight: 700, color: badge.text }}>
                  {badge.emoji} {sponsor.typeContrat}
                </div>

                {/* Logo ou couleur */}
                <div style={{ width: '72px', height: '72px', borderRadius: '16px', background: sponsor.logoUrl ? 'white' : sponsor.couleur + '20', border: '2px solid ' + (sponsor.couleur || '#E5E7EB'), display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', overflow: 'hidden' }}>
                  {sponsor.logoUrl ? (
                    <img src={sponsor.logoUrl} alt={sponsor.nom} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    <span style={{ fontSize: '28px', fontWeight: 900, color: sponsor.couleur || '#374151' }}>
                      {sponsor.nom.charAt(0)}
                    </span>
                  )}
                </div>

                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#111827', marginBottom: '6px' }}>{sponsor.nom}</h2>
                {sponsor.description && <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.6, marginBottom: '12px' }}>{sponsor.description}</p>}
                {sponsor.siteWeb && (
                  <a href={sponsor.siteWeb} target="_blank" rel="noreferrer" style={{ fontSize: '13px', color: '#00D4FF', textDecoration: 'none', fontWeight: 600 }}>
                    Visiter le site →
                  </a>
                )}

                {estAdmin && (
                  <button
                    onClick={() => supprimerSponsor(sponsor.id)}
                    style={{ position: 'absolute', bottom: '16px', right: '16px', background: '#FEF2F2', border: 'none', borderRadius: '8px', padding: '4px 10px', fontSize: '12px', color: '#DC2626', cursor: 'pointer' }}
                  >
                    🗑
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* CTA Devenir partenaire */}
      <div style={{ background: 'linear-gradient(135deg, #0A2540, #001F3F)', borderRadius: '24px', padding: '48px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'white', marginBottom: '8px' }}>Devenez partenaire</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '24px', fontSize: '15px' }}>Soutenez la formation au débat en Haïti et gagnez en visibilité</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="mailto:partenariat@debat-haiti.ht" style={{ background: 'linear-gradient(135deg, #00D4FF, #7B61FF)', color: 'white', padding: '12px 28px', borderRadius: '12px', textDecoration: 'none', fontWeight: 700, fontSize: '15px' }}>
            📧 Nous contacter
          </a>
          <a href="https://wa.me/50999999999?text=Je%20veux%20devenir%20partenaire" target="_blank" rel="noreferrer" style={{ background: '#25D366', color: 'white', padding: '12px 28px', borderRadius: '12px', textDecoration: 'none', fontWeight: 700, fontSize: '15px' }}>
            💬 WhatsApp
          </a>
        </div>
      </div>

      {/* MODAL AJOUT SPONSOR */}
      {modalAjout && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }} onClick={() => setModalAjout(false)}>
          <div style={{ background: 'white', borderRadius: '24px', padding: '32px', maxWidth: '500px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#0A2540' }}>🤝 Nouveau partenaire</h2>
              <button onClick={() => setModalAjout(false)} style={{ border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={ajouterSponsor} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Upload logo */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Logo du partenaire</label>
                <div
                  onClick={() => logoInputRef.current?.click()}
                  style={{ border: '2px dashed #E5E7EB', borderRadius: '12px', padding: '20px', textAlign: 'center', cursor: 'pointer', background: '#F9FAFB' }}
                >
                  {logoPreview ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
                      <img src={logoPreview} alt="Logo" style={{ width: '60px', height: '60px', objectFit: 'contain', borderRadius: '8px' }} />
                      <span style={{ fontSize: '13px', color: '#6B7280' }}>Logo sélectionné ✓</span>
                    </div>
                  ) : (
                    <>
                      <div style={{ fontSize: '32px', marginBottom: '8px' }}>🖼️</div>
                      <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>Cliquez pour uploader le logo depuis votre PC</p>
                      <p style={{ fontSize: '11px', color: '#9CA3AF', margin: '4px 0 0' }}>PNG, JPG, SVG — max 5 MB</p>
                    </>
                  )}
                </div>
                <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoSelect} style={{ display: 'none' }} />
                {logoPreview && (
                  <button type="button" onClick={() => { setLogoPreview(''); setForm({ ...form, logoUrl: '' }); }} style={{ marginTop: '6px', fontSize: '12px', color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer' }}>
                    Supprimer le logo
                  </button>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Nom du partenaire *</label>
                <input type="text" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} placeholder="Ex : Digicel Haïti" required style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E5E7EB', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Décrivez brièvement ce partenaire..." style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E5E7EB', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', height: '80px', resize: 'none' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Site web</label>
                <input type="url" value={form.siteWeb} onChange={e => setForm({ ...form, siteWeb: e.target.value })} placeholder="https://..." style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E5E7EB', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Niveau</label>
                  <select value={form.typeContrat} onChange={e => setForm({ ...form, typeContrat: e.target.value })} style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E5E7EB', borderRadius: '10px', fontSize: '14px', outline: 'none', background: 'white' }}>
                    <option value="PLATINE">💎 Platine</option>
                    <option value="OR">🥇 Or</option>
                    <option value="ARGENT">🥈 Argent</option>
                    <option value="BRONZE">🥉 Bronze</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Couleur</label>
                  <input type="color" value={form.couleur} onChange={e => setForm({ ...form, couleur: e.target.value })} style={{ width: '100%', height: '42px', border: '1.5px solid #E5E7EB', borderRadius: '10px', cursor: 'pointer', padding: '2px' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
                <button type="button" onClick={() => setModalAjout(false)} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #E5E7EB', background: 'white', color: '#6B7280', fontWeight: 600, cursor: 'pointer' }}>Annuler</button>
                <button type="submit" disabled={envoi || !form.nom} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #00D4FF, #7B61FF)', color: 'white', fontWeight: 700, cursor: 'pointer', opacity: envoi || !form.nom ? 0.6 : 1 }}>
                  {envoi ? 'Ajout...' : '✅ Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}