'use client';

import { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://plateforme-debat-backend.onrender.com/api';

const getToken = () => {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('access_token') || '';
};

interface Props {
  montant: number;
  description: string;
  plan?: string;
  onFermer: () => void;
  onSucces?: () => void;
}

type Methode = 'visa' | 'moncash' | 'paypal' | 'zelle';

export default function ModalPaiement({ montant, description, plan = 'PREMIUM', onFermer }: Props) {
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState('');
  const [methodeChoisie, setMethodeChoisie] = useState<Methode | null>(null);
  const [etape, setEtape] = useState<'choix' | 'moncash_detail' | 'zelle_detail' | 'paypal_detail'>('choix');

  const payerStripe = async () => {
    const token = getToken();
    if (!token) { setErreur('Vous devez être connecté pour effectuer un paiement.'); return; }
    setChargement(true);
    setErreur('');
    try {
      const res = await fetch(API_URL + '/paiements/stripe/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ plan }),
      });
      if (res.status === 401) { setErreur('Session expirée. Veuillez vous reconnecter.'); return; }
      const data = await res.json();
      if (data.url) { window.location.href = data.url; }
      else { setErreur('Erreur lors de la création du paiement.'); }
    } catch { setErreur('Impossible de contacter le serveur.'); }
    finally { setChargement(false); }
  };

  const initierMonCash = async () => {
    const token = getToken();
    if (!token) { setErreur('Vous devez être connecté.'); return; }
    setChargement(true);
    try {
      const res = await fetch(API_URL + '/paiements/moncash/initier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ montantHTG: Math.round(montant * 130), plan }),
      });
      const data = await res.json();
      if (data.redirectUrl) { window.location.href = data.redirectUrl; }
      else { setEtape('moncash_detail'); }
    } catch { setEtape('moncash_detail'); }
    finally { setChargement(false); }
  };

  const ouvrirWhatsApp = (msg: string) => {
    window.open('https://wa.me/50999999999?text=' + encodeURIComponent(msg), '_blank');
  };

  const montantHTG = Math.round(montant * 130);

  const methodes: { id: Methode; label: string; sous: string; couleur: string; icone: string }[] = [
    { id: 'visa',    label: 'Visa / Mastercard', sous: 'Paiement sécurisé par Stripe',    couleur: '#635BFF', icone: '💳' },
    { id: 'moncash', label: 'MonCash',            sous: 'Mobile money Digicel Haïti',      couleur: '#FF6600', icone: '📱' },
    { id: 'paypal',  label: 'PayPal',             sous: 'Paiement international',           couleur: '#003087', icone: '🅿️' },
    { id: 'zelle',   label: 'Zelle',              sous: 'Virement USA instantané',          couleur: '#6D1ED4', icone: '💜' },
  ];

  const cardStyle: React.CSSProperties = {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000,
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
  };

  return (
    <div style={cardStyle} onClick={onFermer}>
      <div style={{ background: 'white', borderRadius: '24px', padding: '32px', maxWidth: '480px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }} onClick={e => e.stopPropagation()}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#111827' }}>💳 Paiement sécurisé</h2>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6B7280' }}>{description}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '26px', fontWeight: 900, color: '#00D4FF' }}>{montant} USD</div>
            <div style={{ fontSize: '12px', color: '#9CA3AF' }}>≈ {montantHTG} HTG</div>
          </div>
        </div>

        {etape === 'choix' && (
          <>
            <p style={{ fontSize: '13px', color: '#374151', fontWeight: 600, marginBottom: '12px' }}>Choisissez votre méthode :</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {methodes.map(m => (
                <button key={m.id} onClick={() => { setMethodeChoisie(m.id); setErreur(''); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', borderRadius: '14px',
                    border: methodeChoisie === m.id ? `2px solid ${m.couleur}` : '2px solid #E5E7EB',
                    background: methodeChoisie === m.id ? m.couleur + '12' : 'white', cursor: 'pointer', textAlign: 'left' }}>
                  <span style={{ fontSize: '24px' }}>{m.icone}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: '#111827', fontSize: '14px' }}>{m.label}</div>
                    <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{m.sous}</div>
                  </div>
                  {methodeChoisie === m.id && (
                    <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: m.couleur, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '11px', flexShrink: 0 }}>✓</span>
                  )}
                </button>
              ))}
            </div>

            {erreur && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '12px', marginBottom: '16px', fontSize: '13px', color: '#DC2626' }}>
                ⚠ {erreur}
              </div>
            )}

            <button
              disabled={chargement || !methodeChoisie}
              onClick={() => {
                if (!methodeChoisie) { setErreur('Choisissez une méthode de paiement.'); return; }
                if (methodeChoisie === 'visa') payerStripe();
                else if (methodeChoisie === 'moncash') initierMonCash();
                else if (methodeChoisie === 'paypal') setEtape('paypal_detail');
                else if (methodeChoisie === 'zelle') setEtape('zelle_detail');
              }}
              style={{ width: '100%', padding: '15px', borderRadius: '14px', border: 'none',
                background: methodeChoisie ? 'linear-gradient(135deg, #00D4FF, #7B61FF)' : '#E5E7EB',
                color: methodeChoisie ? 'white' : '#9CA3AF', fontWeight: 700, fontSize: '15px',
                cursor: methodeChoisie && !chargement ? 'pointer' : 'not-allowed', marginBottom: '12px' }}>
              {chargement ? '⏳ Traitement...' : methodeChoisie ? `Continuer avec ${methodes.find(m=>m.id===methodeChoisie)?.label} →` : 'Sélectionnez une méthode'}
            </button>
            {methodeChoisie === 'visa' && (
              <p style={{ textAlign: 'center', fontSize: '11px', color: '#9CA3AF', marginBottom: '10px' }}>🔒 Stripe · SSL · PCI-DSS · Test : 4242 4242 4242 4242 / 12/34 / 123</p>
            )}
            <button onClick={onFermer} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E5E7EB', background: 'white', color: '#6B7280', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
              Annuler
            </button>
          </>
        )}

        {etape === 'moncash_detail' && (
          <InstructionsManuel
            titre="📱 Instructions MonCash"
            couleur="#FF6600"
            bg="#FFF7ED"
            border="#FED7AA"
            etapes={[
              'Ouvrez l\'app MonCash sur votre téléphone',
              'Allez dans "Payer un marchand"',
              'Entrez le numéro : +509 XXXX XXXX',
              `Montant : ${montantHTG} HTG (${montant} USD)`,
              `Note : ${description}`,
              'Envoyez une capture d\'écran sur WhatsApp pour confirmation',
            ]}
            msgWA={`Bonjour, j'ai payé ${montantHTG} HTG via MonCash pour : ${description}. Voici ma confirmation.`}
            onWA={ouvrirWhatsApp}
            onRetour={() => setEtape('choix')}
          />
        )}

        {etape === 'paypal_detail' && (
          <InstructionsManuel
            titre="🅿️ Instructions PayPal"
            couleur="#003087"
            bg="#EFF6FF"
            border="#BFDBFE"
            etapes={[
              'Ouvrez PayPal (app ou paypal.com)',
              'Cliquez sur "Envoyer"',
              `Destinataire : paiement@debathaiti.com`,
              `Montant : ${montant} USD`,
              `Note : ${description}`,
              'Envoyez une capture d\'écran sur WhatsApp pour confirmation',
            ]}
            msgWA={`Bonjour, j'ai envoyé ${montant} USD via PayPal pour : ${description}. Voici ma confirmation.`}
            onWA={ouvrirWhatsApp}
            onRetour={() => setEtape('choix')}
          />
        )}

        {etape === 'zelle_detail' && (
          <InstructionsManuel
            titre="💜 Instructions Zelle"
            couleur="#6D1ED4"
            bg="#F5F3FF"
            border="#DDD6FE"
            etapes={[
              'Ouvrez votre app bancaire (Chase, BofA, Wells Fargo…)',
              'Allez dans "Envoyer avec Zelle"',
              'Destinataire : +1 (XXX) XXX-XXXX',
              `Montant : ${montant} USD`,
              `Note : ${description}`,
              'Envoyez une capture d\'écran sur WhatsApp pour confirmation',
            ]}
            msgWA={`Bonjour, j'ai envoyé ${montant} USD via Zelle pour : ${description}. Voici ma confirmation.`}
            onWA={ouvrirWhatsApp}
            onRetour={() => setEtape('choix')}
          />
        )}
      </div>
    </div>
  );
}

function InstructionsManuel({ titre, couleur, bg, border, etapes, msgWA, onWA, onRetour }: {
  titre: string; couleur: string; bg: string; border: string;
  etapes: string[]; msgWA: string;
  onWA: (msg: string) => void; onRetour: () => void;
}) {
  return (
    <>
      <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: '14px', padding: '20px', marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 14px', color: couleur, fontSize: '16px', fontWeight: 700 }}>{titre}</h3>
        <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', lineHeight: 2 }}>
          {etapes.map((e, i) => <li key={i}>{e}</li>)}
        </ol>
      </div>
      <button
        onClick={() => onWA(msgWA)}
        style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: '#25D366', color: 'white', fontWeight: 700, fontSize: '14px', cursor: 'pointer', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        💬 Confirmer via WhatsApp
      </button>
      <button onClick={onRetour} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E5E7EB', background: 'white', color: '#6B7280', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
        ← Retour
      </button>
    </>
  );
}
