import React, { useState, useEffect } from 'react';
import { Plus, LogOut, Settings } from 'lucide-react';
import { AddBeliefModal } from './components/AddBeliefModal';
import { CategoryCard } from './components/CategoryCard';
import { EvidenceModal } from './components/EvidenceModal';
import { AuthForm } from './components/AuthForm';
import { SettingsModal } from './components/SettingsModal';
import { useAuthStore } from './store/authStore';
import { supabase } from './lib/supabase';
import { Belief } from './types';

function App() {
  const { user, signOut } = useAuthStore();
  const [beliefs, setBeliefs] = useState<Belief[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedBelief, setSelectedBelief] = useState<Belief | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBeliefs();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchBeliefs = async () => {
    try {
      const { data, error } = await supabase
        .from('beliefs')
        .select(`
          *,
          evidence (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBeliefs(data || []);
    } catch (error) {
      console.error('Error fetching beliefs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBelief = async (beliefData: {
    text: string;
    counterEvidence: string[];
    transformedBelief: string;
    category: string;
  }) => {
    try {
      const { data: newBelief, error: beliefError } = await supabase
        .from('beliefs')
        .insert({
          text: beliefData.text,
          category: beliefData.category,
          transformed_belief: beliefData.transformedBelief,
          user_id: user!.id
        })
        .select()
        .single();

      if (beliefError) throw beliefError;

      if (beliefData.counterEvidence.length > 0) {
        const evidenceToInsert = beliefData.counterEvidence.map(text => ({
          belief_id: newBelief.id,
          text
        }));

        const { error: evidenceError } = await supabase
          .from('evidence')
          .insert(evidenceToInsert);

        if (evidenceError) throw evidenceError;
      }

      await fetchBeliefs();
    } catch (error) {
      console.error('Error adding belief:', error);
    }
  };

  const handleAddEvidence = async (beliefId: string, evidenceText: string) => {
    try {
      const { error } = await supabase
        .from('evidence')
        .insert({
          belief_id: beliefId,
          text: evidenceText
        });

      if (error) throw error;
      await fetchBeliefs();
    } catch (error) {
      console.error('Error adding evidence:', error);
    }
  };

  const handleDeleteEvidence = async (evidenceId: string) => {
    try {
      const { error } = await supabase
        .from('evidence')
        .delete()
        .eq('id', evidenceId);

      if (error) throw error;
      await fetchBeliefs();
    } catch (error) {
      console.error('Error deleting evidence:', error);
    }
  };

  const handleDeleteBelief = async (beliefId: string) => {
    try {
      await supabase
        .from('evidence')
        .delete()
        .eq('belief_id', beliefId);

      const { error } = await supabase
        .from('beliefs')
        .delete()
        .eq('id', beliefId);

      if (error) throw error;
      await fetchBeliefs();
    } catch (error) {
      console.error('Error deleting belief:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:text-white text-gray-900">
        <div>Laden...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  const categories = ["Gesundheit", "Beziehungen", "Karriere", "Geld"];

  const beliefsByCategory = categories.reduce((acc, category) => {
    acc[category] = beliefs.filter(belief => belief.category === category);
    return acc;
  }, {} as Record<string, Belief[]>);

  return (
    <div className="min-h-screen text-gray-900 dark:text-white">
      {/* Header */}
      <div className="flex justify-between items-center p-4 pt-14">
        <div className="flex items-center gap-3">
          <img 
            src="/logo.svg" 
            alt="prism-one" 
            className="h-8 w-8"
          />
          <h1 className="text-3xl font-bold">prism-one</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 hover:bg-gray-100/10 dark:hover:bg-gray-800/50 rounded-full transition-colors"
          >
            <Settings className="w-6 h-6" />
          </button>
          <button
            onClick={signOut}
            className="p-2 hover:bg-gray-100/10 dark:hover:bg-gray-800/50 rounded-full transition-colors"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex justify-between px-4 mb-6 text-gray-600 dark:text-gray-400">
        <div>
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {beliefs.length}
          </div>
          <div>Aktive Glaubenssätze</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">
            {beliefs.reduce((total, belief) => total + (belief.evidence?.length || 0), 0)}
          </div>
          <div>Beweise</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">3</div>
          <div>Tage aktiv</div>
        </div>
      </div>

      {/* Category Cards */}
      <div className="px-4 pb-24 space-y-4">
        {categories.map(category => (
          <CategoryCard
            key={category}
            title={category}
            beliefs={beliefsByCategory[category]}
            onBeliefClick={setSelectedBelief}
          />
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 inset-x-0 bg-white/90 dark:bg-black/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800">
        <div className="flex justify-center items-center h-16">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="p-4"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>

      {selectedBelief && (
        <EvidenceModal
          isOpen={!!selectedBelief}
          onClose={() => setSelectedBelief(null)}
          belief={selectedBelief}
          onAddEvidence={handleAddEvidence}
          onDeleteEvidence={handleDeleteEvidence}
          onDeleteBelief={handleDeleteBelief}
        />
      )}

      <AddBeliefModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddBelief}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}

export default App;