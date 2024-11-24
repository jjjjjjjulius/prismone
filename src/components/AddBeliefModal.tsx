import React, { useState } from 'react';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (belief: {
    text: string;
    counterEvidence: string[];
    transformedBelief: string;
    category: string;
  }) => void;
}

const CATEGORIES = ["Gesundheit", "Beziehungen", "Karriere", "Geld"];

export function AddBeliefModal({ isOpen, onClose, onSubmit }: Props) {
  const [step, setStep] = useState(1);
  const [belief, setBelief] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [counterEvidence, setCounterEvidence] = useState<string[]>([]);
  const [newEvidence, setNewEvidence] = useState('');
  const [transformedBelief, setTransformedBelief] = useState('');

  const handleSubmit = () => {
    onSubmit({
      text: belief,
      counterEvidence,
      transformedBelief,
      category
    });
    resetForm();
  };

  const resetForm = () => {
    setStep(1);
    setBelief('');
    setCategory(CATEGORIES[0]);
    setCounterEvidence([]);
    setNewEvidence('');
    setTransformedBelief('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-lg p-6 animate-slide-up blue-glow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {step === 1 && 'Glaubenssatz erfassen'}
            {step === 2 && 'Kategorie wählen'}
            {step === 3 && 'Gegenbeweise sammeln'}
            {step === 4 && 'Transformation'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Original belief display for steps 2-4 */}
        {step > 1 && (
          <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Ursprünglicher Glaubenssatz:</p>
            <p className="text-gray-900 dark:text-gray-300">{belief}</p>
          </div>
        )}

        {step === 1 && (
          <div className="animate-fade-in">
            <label className="block mb-2 text-gray-700 dark:text-gray-300">Welcher einschränkende Gedanke beschäftigt dich?</label>
            <textarea
              value={belief}
              onChange={(e) => setBelief(e.target.value)}
              className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg p-3 min-h-[100px] transition-colors focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="z.B.: Ich bin nicht gut genug"
            />
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <p className="mb-4 text-gray-700 dark:text-gray-300">Wähle eine Kategorie:</p>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`p-3 rounded-lg transition-all transform hover:scale-[1.02] ${
                    category === cat
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in">
            <p className="mb-4 text-gray-700 dark:text-gray-300">Lass uns sammeln, was gegen diesen Glaubenssatz spricht</p>
            <div className="space-y-2 mb-4">
              {counterEvidence.map((evidence, index) => (
                <div key={index} className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white p-3 rounded-lg transform transition-all hover:translate-x-1">
                  {evidence}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newEvidence}
                onChange={(e) => setNewEvidence(e.target.value)}
                className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg p-3 transition-colors focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Neuer Gegenbeweis"
              />
              <button
                onClick={() => {
                  if (newEvidence.trim()) {
                    setCounterEvidence(prev => [...prev, newEvidence.trim()]);
                    setNewEvidence('');
                  }
                }}
                className="bg-indigo-600 px-4 rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/25 text-white"
              >
                +
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-fade-in">
            <p className="mb-4 text-gray-700 dark:text-gray-300">Wie könnte ein stärkender Glaubenssatz lauten?</p>
            <textarea
              value={transformedBelief}
              onChange={(e) => setTransformedBelief(e.target.value)}
              className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg p-3 min-h-[100px] transition-colors focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="z.B.: Ich wachse an jeder Herausforderung"
            />
          </div>
        )}

        <div className="flex justify-between mt-6">
          <button
            onClick={() => setStep(prev => Math.max(1, prev - 1))}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            disabled={step === 1}
          >
            Zurück
          </button>
          <button
            onClick={() => {
              if (step < 4) {
                setStep(prev => prev + 1);
              } else {
                handleSubmit();
                onClose();
              }
            }}
            className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/25 text-white"
            disabled={
              (step === 1 && !belief) ||
              (step === 2 && !category) ||
              (step === 3 && counterEvidence.length === 0) ||
              (step === 4 && !transformedBelief)
            }
          >
            {step < 4 ? 'Weiter' : 'Abschließen'}
          </button>
        </div>
      </div>
    </div>
  );
}