export interface Evidence {
  id: string;
  text: string;
  created_at: string;
  belief_id: string;
}

export interface Belief {
  id: string;
  text: string;
  category: string;
  created_at: string;
  transformed_belief: string;
  evidence?: Evidence[];
  user_id: string;
}