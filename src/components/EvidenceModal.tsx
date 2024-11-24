import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Belief } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  belief: Belief;
  onAddEvidence: (beliefId: string, evidenceText: string) => void;
  onDeleteEvidence: (evidenceId: string) => void;
  onDeleteBelief: (beliefId: string) => void;
}

export function EvidenceModal({ isOpen, onClose, belief, onAddEvidence, onDeleteEvidence, onDeleteBelief }: Props) {
  const [newEvidence, setNewEvidence] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (newEvidence.trim()) {
      onAddEvidence(belief.id, newEvidence.trim());
      setNewEvidence('');
    }
  };

  const formatDateTime = (dateStr: string) => {
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateStr));
  };

  const handleDeleteBelief = () => {
    if (window.confirm('Möchtest du diesen Glaubenssatz wirklich löschen?')) {
      onDeleteBelief(belief.id);
      onClose();
    }
  };

  const handleDeleteEvidence = (evidenceId: string) => {
    if (window.confirm('Möchtest du diesen Beweis wirklich löschen?')) {
      onDeleteEvidence(evidenceId);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white/90">Stärkender Glaubenssatz</h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleDeleteBelief}
              className="p-2 hover:bg-red-500/20 rounded-full transition-colors text-red-500"
              title="Glaubenssatz löschen"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500 dark:text-white/60" />
            </button>
          </div>
        </div>

        {/* Belief Text */}
        <div className="p-4">
          <p className="text-gray-900 dark:text-white/80 text-lg mb-2">{belief.transformed_belief}</p>
          <p className="text-gray-500 dark:text-white/40 text-sm line-through">{belief.text}</p>
        </div>

        {/* Evidence List */}
        <div className="flex-1 overflow-y-auto px-4">
          {belief.evidence?.map((evidence) => (
            <div 
              key={evidence.id} 
              className="bg-gray-100 dark:bg-gray-800/30 p-4 rounded-lg mb-3 animate-fade-in group relative"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 pr-8">
                  <p className="text-gray-900 dark:text-white/80 mb-2">{evidence.text}</p>
                  <p className="text-sm text-gray-500 dark:text-white/40">
                    {formatDateTime(evidence.created_at)}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteEvidence(evidence.id)}
                  className="absolute top-4 right-4 p-2 hover:bg-red-500/20 rounded-full transition-colors text-red-500 opacity-0 group-hover:opacity-100"
                  title="Beweis löschen"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex gap-2">
            <input
              type="text"
              value={newEvidence}
              onChange={(e) => setNewEvidence(e.target.value)}
              className="flex-1 bg-gray-100 dark:bg-gray-800/30 text-gray-900 dark:text-white rounded-xl px-4 py-3 placeholder-gray-500 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Neuer Beweis für deinen stärkenden Glaubenssatz"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
            <button
              onClick={handleSubmit}
              className="bg-[#5E5CE6] w-12 h-12 rounded-xl flex items-center justify-center hover:bg-[#6E6CF6] transition-colors shadow-lg shadow-indigo-500/25"
            >
              <Plus className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}