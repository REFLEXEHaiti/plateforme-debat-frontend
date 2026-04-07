'use client';

import { useState } from 'react';

interface Props {
  onCreer: (donnees: { titre: string; description: string; statut: string }) => void;
}

export default function FormulaireDebat({ onCreer }: Props) {
  const [ouvert, setOuvert] = useState(false);
  const [form, setForm] = useState({
    titre: '',
    description: '',
    statut: 'OUVERT',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCreer(form);
    setForm({ titre: '', description: '', statut: 'OUVERT' });
    setOuvert(false);
  };

  return (
    <div>
      <button
        onClick={() => setOuvert(!ouvert)}
        className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
      >
        + Nouveau débat
      </button>

      {ouvert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold text-blue-900 mb-4">
              Créer un débat
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Titre du débat"
                value={form.titre}
                onChange={(e) => setForm({ ...form, titre: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <textarea
                placeholder="Description du débat"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <select
                value={form.statut}
                onChange={(e) => setForm({ ...form, statut: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="OUVERT">Ouvert immédiatement</option>
                <option value="BROUILLON">Brouillon</option>
              </select>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setOuvert(false)}
                  className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800"
                >
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}