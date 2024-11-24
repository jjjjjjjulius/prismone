import React from 'react';
import { Belief } from '../types';

interface Props {
  belief: Belief;
  onClick: () => void;
}

export function BeliefCard({ belief, onClick }: Props) {
  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateStr));
  };

  return (
    <div 
      onClick={onClick}
      className="bg-gray-100/50 dark:bg-gray-800/50 rounded-xl p-4 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{belief.category}</p>
          <p className="text-lg font-medium text-gray-900 dark:text-white">{belief.transformed_belief}</p>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap ml-4">
          {belief.evidence?.length || 0} Beweise
        </span>
      </div>
      <p className="text-sm text-gray-400 dark:text-gray-500 line-through">{belief.text}</p>
    </div>
  );
}