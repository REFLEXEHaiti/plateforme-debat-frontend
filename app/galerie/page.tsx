'use client';

import { useState } from 'react';

const photos = [
  { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', titre: 'Palais National', categorie: 'patrimoine' },
  { src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80', titre: 'Jeunesse en débat', categorie: 'debats' },
  { src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', titre: 'Débatteur haïtien', categorie: 'debats' },
  { src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80', titre: 'Formation', categorie: 'formations' },
  { src: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80', titre: 'Compétiteurs', categorie: 'tournois' },
  { src: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80', titre: 'Salle de conférence', categorie: 'evenements' },
  { src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80', titre: 'Cérémonie', categorie: 'evenements' },
  { src: 'https://images.unsplash.com/photo-1495465798138-718f86d1a4bc?w=800&q=80', titre: 'Haïti vue aérienne', categorie: 'patrimoine' },
  { src: 'https://images.unsplash.com/photo-1491895200222-0fc4a4c35e18?w=800&q=80', titre: 'Finale nationale', categorie: 'tournois' },
];

const categories = [
  { id: 'tous', label: 'Tous' },
  { id: 'debats', label: 'Débats' },
  { id: 'formations', label: 'Formations' },
  { id: 'tournois', label: 'Tournois' },
  { id: 'evenements', label: 'Événements' },
  { id: 'patrimoine', label: 'Patrimoine' },
];

export default function PageGalerie() {
  const [categorie, setCategorie] = useState('tous');
  const [photoSelectionnee, setPhotoSelectionnee] = useState<any>(null);

  const photosFiltrees = categorie === 'tous' ? photos : photos.filter(p => p.categorie === categorie);

  return (
    <div style={{ background: '#0A0F1E', minHeight: '100vh', color: 'white' }}>

      {/* En-tête */}
      <div style={{ background: 'linear-gradient(135deg, #0A2540, #001F3F)', padding: '80px 24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 800, marginBottom: '16px' }}>
          <span style={{ background: 'linear-gradient(90deg, #00D4FF, #7B61FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Galerie
          </span>{' '}
          photos
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '18px' }}>
          Les moments forts de la plateforme Débat Haïti
        </p>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px' }}>

        {/* Filtres */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '40px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategorie(cat.id)}
              style={{
                padding: '10px 24px',
                borderRadius: '100px',
                border: '1px solid',
                borderColor: categorie === cat.id ? '#00D4FF' : 'rgba(255,255,255,0.2)',
                background: categorie === cat.id ? 'rgba(0,212,255,0.15)' : 'transparent',
                color: categorie === cat.id ? '#00D4FF' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grille de photos */}
        <div style={{ columns: '3', gap: '16px' }}>
          {photosFiltrees.map((photo, i) => (
            <div
              key={i}
              onClick={() => setPhotoSelectionnee(photo)}
              style={{
                breakInside: 'avoid',
                marginBottom: '16px',
                borderRadius: '16px',
                overflow: 'hidden',
                cursor: 'pointer',
                border: '1px solid rgba(255,255,255,0.1)',
                position: 'relative',
              }}
            >
              <img
                src={photo.src}
                alt={photo.titre}
                style={{ width: '100%', display: 'block', filter: 'brightness(0.75)' }}
              />
              <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', borderRadius: '8px', padding: '6px 12px', fontSize: '13px' }}>
                {photo.titre}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visionneuse plein écran */}
      {photoSelectionnee && (
        <div
          onClick={() => setPhotoSelectionnee(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}
        >
          <div style={{ maxWidth: '900px', width: '100%', textAlign: 'center' }}>
            <img
              src={photoSelectionnee.src}
              alt={photoSelectionnee.titre}
              style={{ width: '100%', borderRadius: '20px', maxHeight: '80vh', objectFit: 'contain' }}
            />
            <p style={{ marginTop: '16px', fontSize: '18px', fontWeight: 600 }}>{photoSelectionnee.titre}</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginTop: '8px' }}>Cliquez n'importe où pour fermer</p>
          </div>
        </div>
      )}
    </div>
  );
}