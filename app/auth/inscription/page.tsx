'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

const VILLES = ['Port-au-Prince', 'Cap-Haïtien', 'Gonaïves', 'Les Cayes', 'Jacmel', 'Saint-Marc', 'Miami', 'New York', 'Montréal', 'Paris', 'Autre'];
const NIVEAUX_ACADEMIQUES = ['Primaire', 'Secondaire', 'Université', 'Autre'];
const CYCLES = ['1ère année', '2ème année', '3ème année', '4ème année', '5ème année', '6ème année', 'Terminale', 'Licence', 'Master', 'Doctorat'];

// CORRECTION : InputField et SelectField définis HORS du composant principal
// → évite la recréation à chaque render → le focus ne se perd plus
interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  value: string;
  onChange: (name: string, value: string) => void;
  erreur?: string;
  showToggle?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
}

function InputField({ label, name, type = 'text', placeholder, required = false, value, onChange, erreur, showToggle, showPassword, onTogglePassword }: InputFieldProps) {
  const inputType = showToggle ? (showPassword ? 'text' : 'password') : type;
  return (
    <div>
      <label style={{ display: 'block', fontSize: '13px', color: 'rgba(0,0,0,0.6)', marginBottom: '6px', fontWeight: 600 }}>
        {label} {required && <span style={{ color: '#EF4444' }}>*</span>}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type={inputType}
          value={value}
          onChange={e => onChange(name, e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: showToggle ? '11px 44px 11px 14px' : '11px 14px',
            border: `1.5px solid ${erreur ? '#EF4444' : 'rgba(0,0,0,0.15)'}`,
            borderRadius: '10px',
            fontSize: '14px',
            outline: 'none',
            boxSizing: 'border-box',
            color: '#111',
            background: 'white',
          }}
        />
        {/* Bouton afficher/masquer mot de passe */}
        {showToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              color: 'rgba(0,0,0,0.4)',
              padding: '0',
              display: 'flex',
              alignItems: 'center',
            }}
            title={showPassword ? 'Masquer' : 'Afficher'}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        )}
      </div>
      {erreur && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>⚠ {erreur}</p>}
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  name: string;
  options: string[];
  value: string;
  onChange: (name: string, value: string) => void;
}

function SelectField({ label, name, options, value, onChange }: SelectFieldProps) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '13px', color: 'rgba(0,0,0,0.6)', marginBottom: '6px', fontWeight: 600 }}>{label}</label>
      <select
        value={value}
        onChange={e => onChange(name, e.target.value)}
        style={{ width: '100%', padding: '11px 14px', border: '1.5px solid rgba(0,0,0,0.15)', borderRadius: '10px', fontSize: '14px', outline: 'none', background: 'white', color: '#111', boxSizing: 'border-box' }}
      >
        {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

export default function PageInscription() {
  const { inscrire, chargement } = useAuth();
  const [erreur, setErreur] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    prenom: '', nom: '', email: '', motDePasse: '',
    role: 'APPRENANT', ville: '', whatsapp: '',
    niveauAcademique: 'Secondaire', cycle: '',
  });
  const [erreurs, setErreurs] = useState<Record<string, string>>({});

  // useCallback pour stabiliser la référence et éviter les re-renders inutiles
  const handleChange = useCallback((name: string, value: string) => {
    setForm(f => ({ ...f, [name]: value }));
    setErreurs(e => ({ ...e, [name]: '' }));
  }, []);

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
    setErreur('');
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

  return (
    <div style={{ minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: 'linear-gradient(135deg, #0D1B2A 0%, #1B263B 60%, #0A0F1E 100%)' }}>

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
                  onClick={() => handleChange('role', r)}
                  style={{ flex: 1, padding: '10px 8px', borderRadius: '10px', border: `2px solid ${form.role === r ? '#C0321A' : 'rgba(0,0,0,0.1)'}`, background: form.role === r ? 'rgba(192,50,26,0.06)' : 'white', color: form.role === r ? '#0A2540' : 'rgba(0,0,0,0.5)', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
                >
                  {r === 'APPRENANT' ? '🎓' : r === 'SPECTATEUR' ? '👁️' : '👨‍🏫'} {r.charAt(0) + r.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <InputField label="Prénom" name="prenom" placeholder="Jean" required value={form.prenom} onChange={handleChange} erreur={erreurs.prenom} />
            <InputField label="Nom" name="nom" placeholder="Pierre" required value={form.nom} onChange={handleChange} erreur={erreurs.nom} />
          </div>

          <InputField label="Email" name="email" type="email" placeholder="jean@email.com" required value={form.email} onChange={handleChange} erreur={erreurs.email} />

          {/* Mot de passe avec bouton afficher/masquer */}
          <InputField
            label="Mot de passe"
            name="motDePasse"
            placeholder="••••••••"
            required
            value={form.motDePasse}
            onChange={handleChange}
            erreur={erreurs.motDePasse}
            showToggle
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(v => !v)}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <SelectField label="Ville / Pays" name="ville" options={['Choisir...', ...VILLES]} value={form.ville} onChange={handleChange} />
            <InputField label="WhatsApp (optionnel)" name="whatsapp" placeholder="+509 XXXX XXXX" value={form.whatsapp} onChange={handleChange} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <SelectField label="Niveau académique" name="niveauAcademique" options={NIVEAUX_ACADEMIQUES} value={form.niveauAcademique} onChange={handleChange} />
            <SelectField label="Année / Cycle" name="cycle" options={['Choisir...', ...CYCLES]} value={form.cycle} onChange={handleChange} />
          </div>

          {erreur && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '12px', fontSize: '13px', color: '#DC2626' }}>
              ⚠ {erreur}
            </div>
          )}

          <button
            type="submit"
            disabled={chargement}
            style={{ background: chargement ? 'rgba(192,50,26,0.5)' : 'linear-gradient(135deg, #C0321A, #A02818)', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: 700, fontSize: '15px', cursor: chargement ? 'not-allowed' : 'pointer', boxShadow: '0 4px 16px rgba(192,50,26,0.3)' }}
          >
            {chargement ? 'Création...' : 'Créer mon compte 🚀'}
          </button>

          <div style={{ textAlign: 'center', borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '16px' }}>
            <span style={{ fontSize: '14px', color: 'rgba(0,0,0,0.5)' }}>Déjà un compte ? </span>
            <Link href="/auth/connexion" style={{ color: '#C0321A', fontWeight: 700, textDecoration: 'none', fontSize: '14px' }}>Se connecter</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
