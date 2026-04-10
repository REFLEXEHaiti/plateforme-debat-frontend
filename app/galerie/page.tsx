'use client';

import { useState } from 'react';
import Link from 'next/link';

const PHOTOS = [
  { id: 1, url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80', titre: 'Débat constitutionnel 2025', cat: 'Débat', date: '12 Jan 2026' },
  { id: 2, url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80', titre: 'Formation rhétorique', cat: 'Formation', date: '28 Fév 2026' },
  { id: 3, url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80', titre: 'Tournoi National 2025', cat: 'Tournoi', date: '05 Mar 2026' },
  { id: 4, url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&q=80', titre: 'Atelier argumentation', cat: 'Formation', date: '18 Mar 2026' },
  { id: 5, url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&q=80', titre: 'Conférence Jeunesse', cat: 'Événement', date: '02 Avr 2026' },
  { id: 6, url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=80', titre: 'Remise de certificats', cat: 'Événement', date: '10 Avr 2026' },
  { id: 7, url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80', titre: 'Débat en direct — Lives', cat: 'Live', date: '15 Avr 2026' },
  { id: 8, url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80', titre: 'Portrait — Jean Pierre', cat: 'Portrait', date: '20 Avr 2026' },
  { id: 9, url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80', titre: 'Cérémonie ouverture tournoi', cat: 'Tournoi', date: '25 Avr 2026' },
];

const CATS = ['Tous', 'Débat', 'Formation', 'Tournoi', 'Live', 'Événement', 'Portrait'];

export default function PageGalerie() {
  const [filtre, setFiltre] = useState('Tous');
  const [selected, setSelected] = useState<any>(null);

  const filtrees = PHOTOS.filter(p => filtre === 'Tous' || p.cat === filtre);

  return (
    <div style={{ background: 'var(--page)', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0D1B2A, #1B263B)', padding: 'clamp(32px,5vw,56px) clamp(20px,5vw,80px)', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 'clamp(26px,4vw,48px)', fontWeight: 'normal', color: 'white', marginBottom: 12 }}>Galerie</h1>
        <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 16, color: 'rgba(255,255,255,0.6)', maxWidth: 480, margin: '0 auto' }}>
          Moments forts de la communauté Débat Haïti
        </p>
      </div>

      {/* Filtres */}
      <div style={{ padding: 'clamp(20px,4vw,40px) clamp(20px,5vw,80px) 0', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
          {CATS.map(cat => (
            <button key={cat} onClick={() => setFiltre(cat)} style={{ padding: '8px 18px', borderRadius: 100, fontSize: 13, fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 500, border: filtre === cat ? 'none' : '1.5px solid var(--line2)', background: filtre === cat ? 'var(--ink)' : 'white', color: filtre === cat ? 'var(--page)' : 'var(--muted)', cursor: 'pointer', transition: 'all 0.15s' }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Grille masonry */}
        <div style={{ columns: 'auto 280px', columnGap: 16, marginBottom: 48 }}>
          {filtrees.map(photo => (
            <div key={photo.id} onClick={() => setSelected(photo)} style={{ breakInside: 'avoid', marginBottom: 16, cursor: 'pointer', borderRadius: 12, overflow: 'hidden', position: 'relative', transition: 'transform 0.2s, box-shadow 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 48px rgba(0,0,0,0.2)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}>
              <img src={photo.url} alt={photo.titre} style={{ width: '100%', display: 'block', borderRadius: 12 }} loading="lazy"/>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)', borderRadius: 12, opacity: 0, transition: 'opacity 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                onMouseLeave={e => e.currentTarget.style.opacity = '0'}>
                <div style={{ position: 'absolute', bottom: 12, left: 14, right: 14 }}>
                  <p style={{ fontFamily: 'Georgia,serif', fontSize: 14, color: 'white', fontWeight: 700, marginBottom: 4 }}>{photo.titre}</p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: 10, padding: '2px 8px', borderRadius: 100, fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 600 }}>{photo.cat}</span>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', fontFamily: "'Helvetica Neue',Arial,sans-serif", alignSelf: 'center' }}>{photo.date}</span>
                  </div>
                </div>
              </div>
              {/* Badge catégorie toujours visible */}
              <div style={{ position: 'absolute', top: 10, left: 10 }}>
                <span style={{ background: 'rgba(0,0,0,0.5)', color: 'white', fontSize: 10, padding: '2px 8px', borderRadius: 100, fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 600, backdropFilter: 'blur(4px)' }}>{photo.cat}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setSelected(null)}>
          <div style={{ maxWidth: 900, width: '100%' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>
                <p style={{ fontFamily: 'Georgia,serif', fontSize: 18, color: 'white', marginBottom: 4 }}>{selected.titre}</p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: 11, padding: '2px 10px', borderRadius: 100, fontFamily: "'Helvetica Neue',Arial,sans-serif" }}>{selected.cat}</span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontFamily: "'Helvetica Neue',Arial,sans-serif" }}>{selected.date}</span>
                </div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            <img src={selected.url} alt={selected.titre} style={{ width: '100%', borderRadius: 12, maxHeight: '70vh', objectFit: 'contain' }}/>
          </div>
        </div>
      )}
    </div>
  );
}
