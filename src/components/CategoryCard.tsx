import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Belief } from '../types';
import { BeliefCard } from './BeliefCard';

interface Props {
  title: string;
  beliefs: Belief[];
  onBeliefClick: (belief: Belief) => void;
}

export function CategoryCard({ title, beliefs, onBeliefClick }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (beliefs.length === 0) return null;

  return (
    <div className="rounded-[28px] overflow-hidden bg-gradient-to-br from-gray-100/80 to-gray-200/90 dark:from-gray-800/80 dark:to-gray-900/90 backdrop-blur-sm">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-5 flex items-center justify-between text-left cursor-pointer"
      >
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{title}</h2>
          <p className="text-base text-gray-500 dark:text-gray-400">{beliefs.length} Glaubenssätze</p>
        </div>
        <ChevronRight 
          className={`w-6 h-6 text-gray-500 dark:text-gray-400 transition-transform duration-300 ${
            isExpanded ? 'rotate-90' : ''
          }`}
        />
      </div>
      
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3 animate-slide-up">
          {beliefs.map(belief => (
            <BeliefCard
              key={belief.id}
              belief={belief}
              onClick={() => onBeliefClick(belief)}
            />
          ))}
        </div>
      )}
    </div>
  );
}