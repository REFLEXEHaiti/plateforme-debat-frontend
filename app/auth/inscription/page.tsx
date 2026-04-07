'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

const VILLES = ['Port-au-Prince', 'Cap-Haïtien', 'Gonaïves', 'Les Cayes', 'Jacmel', 'Saint-Marc', 'Miami', 'New York', 'Montréal', 'Paris', 'Autre'];
const NIVEAUX_ACADEMIQUES = ['Primaire', 'Secondaire', 'Université', 'Autre'];
const CYCLES = ['1ère année', '2ème année', '3ème année', '4ème année', '5ème année', '6ème année', 'Terminale', 'Licence', 'Master', 'Doctorat'];

export default function PageInscription() {
  const { inscrire, chargement } = useAuth();
  const [erreur, setErreur] = useState('');
  const [form, setForm] = useState({
    prenom: '', nom: '', email: '', motDePasse: '',
    role: 'APPRENANT', ville: '', whatsapp: '',
    niveauAcademique: 'Secondaire', cycle: '',
  });
  const [erreurs, setErreurs] = useState<Record<string, string>>({});

  const valider = () => {
    const e: Record<string, string> = {};
    if (!form.prenom.trim()) e.prenom = 'Le prénom est requis';
    if (!form.nom.trim()) e.nom = 'Le nom est requis';
    if (!form.email.includes('@')) e.email = 'Email invalide';
    if (form.motDePasse.length < 6) e.motDePasse = 'Minimum 6 caractères';
    setErreurs(e);
    return Object.keys(e).length === 0;
  };

  const soumettre = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valider()) return;
    try {
      await inscrire({
        prenom: form.prenom,
        nom: form.nom,
        email: form.email,
        motDePasse: form.motDePasse,
        role: form.role,
        ville: form.ville !== 'Choisir...' ? form.ville : undefined,
        whatsapp: form.whatsapp || undefined,
        niveauAcademique: form.niveauAcademique || undefined,
      });
     } catch {
     setErreur('Erreur lors de l\'inscription. Vérifiez que l\'email n\'est pas déjà utilisé.');
     }
  };

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const InputField = ({ label, name, type = 'text', placeholder, required = false }: any) => (
    <div>
      <label style={{ display: 'block', fontSize: '13px', color: 'rgba(0,0,0,0.6)', marginBottom: '6px', fontWeight: 600 }}>
        {label} {required && <span style={{ color: '#EF4444' }}>*</span>}
      </label>
      <input
        type={type}
        value={(form as any)[name]}
        onChange={e => set(name, e.target.value)}
        placeholder={placeholder}
        style={{ width: '100%', padding: '11px 14px', border: `1.5px solid ${erreurs[name] ? '#EF4444' : 'rgba(0,0,0,0.15)'}`, borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', color: '#111', background: 'white' }}
      />
      {erreurs[name] && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>⚠ {erreurs[name]}</p>}
    </div>
  );

  const SelectField = ({ label, name, options }: any) => (
    <div>
      <label style={{ display: 'block', fontSize: '13px', color: 'rgba(0,0,0,0.6)', marginBottom: '6px', fontWeight: 600 }}>{label}</label>
      <select
        value={(form as any)[name]}
        onChange={e => set(name, e.target.value)}
        style={{ width: '100%', padding: '11px 14px', border: '1.5px solid rgba(0,0,0,0.15)', borderRadius: '10px', fontSize: '14px', outline: 'none', background: 'white', color: '#111', boxSizing: 'border-box' }}
      >
        {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: 'linear-gradient(135deg, #0A2540 0%, #001F3F 50%, #0A0F1E 100%)' }}>

      {/* Globe en arrière-plan semi-transparent */}
      <div style={{ position: 'absolute', right: '5%', top: '50%', transform: 'translateY(-50%)', opacity: 0.08, pointerEvents: 'none', fontSize: '400px', lineHeight: 1 }}>🌍</div>

      <div style={{ background: 'white', borderRadius: '24px', padding: '40px', width: '100%', maxWidth: '520px', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', position: 'relative', zIndex: 1 }}>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🇭🇹</div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0A2540', margin: 0 }}>Créer un compte</h1>
          <p style={{ color: 'rgba(0,0,0,0.4)', fontSize: '14px', marginTop: '6px' }}>Rejoignez la communauté Débat Haïti</p>
        </div>

        <form onSubmit={soumettre} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Rôle */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: 'rgba(0,0,0,0.6)', marginBottom: '8px', fontWeight: 600 }}>Vous êtes *</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['APPRENANT', 'SPECTATEUR', 'FORMATEUR'].map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => set('role', r)}
                  style={{ flex: 1, padding: '10px 8px', borderRadius: '10px', border: `2px solid ${form.role === r ? '#00D4FF' : 'rgba(0,0,0,0.1)'}`, background: form.role === r ? 'rgba(0,212,255,0.08)' : 'white', color: form.role === r ? '#0A2540' : 'rgba(0,0,0,0.5)', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
                >
                  {r === 'APPRENANT' ? '🎓' : r === 'SPECTATEUR' ? '👁️' : '👨‍🏫'} {r.charAt(0) + r.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <InputField label="Prénom" name="prenom" placeholder="Jean" required />
            <InputField label="Nom" name="nom" placeholder="Pierre" required />
          </div>

          <InputField label="Email" name="email" type="email" placeholder="jean@email.com" required />
          <InputField label="Mot de passe" name="motDePasse" type="password" placeholder="••••••••" required />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <SelectField label="Ville / Pays" name="ville" options={['Choisir...', ...VILLES]} />
            <InputField label="WhatsApp (optionnel)" name="whatsapp" placeholder="+509 XXXX XXXX" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <SelectField label="Niveau académique" name="niveauAcademique" options={NIVEAUX_ACADEMIQUES} />
            <SelectField label="Année / Cycle" name="cycle" options={['Choisir...', ...CYCLES]} />
          </div>

          {erreur && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '12px', fontSize: '13px', color: '#DC2626' }}>
              ⚠ {erreur}
            </div>
          )}

          <button
            type="submit"
            disabled={chargement}
            style={{ background: 'linear-gradient(135deg, #00D4FF, #7B61FF)', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: 700, fontSize: '15px', cursor: 'pointer', opacity: chargement ? 0.7 : 1 }}
          >
            {chargement ? 'Création...' : 'Créer mon compte 🚀'}
          </button>

          <div style={{ textAlign: 'center', borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '16px' }}>
            <span style={{ fontSize: '14px', color: 'rgba(0,0,0,0.5)' }}>Déjà un compte ? </span>
            <Link href="/auth/connexion" style={{ color: '#00D4FF', fontWeight: 700, textDecoration: 'none', fontSize: '14px' }}>Se connecter</Link>
          </div>
        </form>
      </div>
    </div>
  );
}