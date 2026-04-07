'use client';

import { useState } from 'react';

interface Props {
  onEnvoyer: (contenu: string) => void;
}

export default function FormulaireMessage({ onEnvoyer }: Props) {
  const [contenu, setContenu] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contenu.trim()) return;
    onEnvoyer(contenu);
    setContenu('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <textarea
        value={contenu}
        onChange={(e) => setContenu(e.target.value)}
        placeholder="Écrivez votre argument..."
        className="w-full border border-gray-300 rounded-lg px-3 py-2 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      />
      <div className="flex justify-end mt-2">
        <button
          type="submit"
          disabled={!contenu.trim()}
          className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-800 transition disabled:opacity-50"
        >
          Envoyer →
        </button>
      </div>
    </form>
  );
}