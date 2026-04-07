'use client';

import { useState, useEffect } from 'react';

const LANGUES = [
  { code: 'fr', label: 'FR', nom: 'Français', drapeau: '🇫🇷', google: 'fr' },
  { code: 'ht', label: 'KR', nom: 'Kreyòl Ayisyen', drapeau: '🇭🇹', google: 'ht' },
  { code: 'en', label: 'EN', nom: 'English', drapeau: '🇺🇸', google: 'en' },
];

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

export default function SelecteurLangue() {
  const [ouvert, setOuvert] = useState(false);
  const [langueActuelle, setLangueActuelle] = useState('fr');

  useEffect(() => {
    const saved = localStorage.getItem('debat-ht-lang') || 'fr';
    setLangueActuelle(saved);

    // Cacher le bandeau Google Translate
    const style = document.createElement('style');
    style.textContent = `
      .goog-te-banner-frame { display: none !important; }
      .goog-te-gadget { display: none !important; }
      body { top: 0 !important; }
      .skiptranslate { display: none !important; }
    `;
    document.head.appendChild(style);
  }, []);

  const changerLangue = (code: string, google: string) => {
    setLangueActuelle(code);
    localStorage.setItem('debat-ht-lang', code);
    setOuvert(false);

    if (code === 'fr') {
      // Revenir au français original
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (select) {
        select.value = 'fr';
        select.dispatchEvent(new Event('change'));
      } else {
        window.location.reload();
      }
      return;
    }

    // Utiliser Google Translate
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (select) {
      select.value = google;
      select.dispatchEvent(new Event('change'));
    } else {
      // Si Google Translate pas encore chargé, attendre
      const interval = setInterval(() => {
        const sel = document.querySelector('.goog-te-combo') as HTMLSelectElement;
        if (sel) {
          sel.value = google;
          sel.dispatchEvent(new Event('change'));
          clearInterval(interval);
        }
      }, 200);
      setTimeout(() => clearInterval(interval), 5000);
    }
  };

  const langue = LANGUES.find(l => l.code === langueActuelle) || LANGUES[0];

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOuvert(!ouvert)}
        style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', padding: '5px 10px', color: 'white', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
      >
        <span>{langue.drapeau}</span>
        <span>{langue.label}</span>
        <span style={{ fontSize: '10px', opacity: 0.7 }}>{ouvert ? '▲' : '▼'}</span>
      </button>

      {ouvert && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setOuvert(false)} />
          <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', background: 'white', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', border: '1px solid rgba(0,0,0,0.08)', zIndex: 50, overflow: 'hidden', minWidth: '180px' }}>
            {LANGUES.map(l => (
              <button
                key={l.code}
                onClick={() => changerLangue(l.code, l.google)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', background: l.code === langueActuelle ? '#EEF2FF' : 'white', border: 'none', borderBottom: '1px solid rgba(0,0,0,0.05)', cursor: 'pointer', textAlign: 'left' }}
              >
                <span style={{ fontSize: '20px' }}>{l.drapeau}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>{l.nom}</div>
                  <div style={{ fontSize: '11px', color: '#6B7280' }}>{l.label}</div>
                </div>
                {l.code === langueActuelle && <span style={{ color: '#4F46E5', fontWeight: 700 }}>✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}