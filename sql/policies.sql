-- First drop existing policies if they exist
drop policy if exists "Users can delete their own beliefs" on beliefs;
drop policy if exists "Users can delete evidence for their beliefs" on evidence;

-- Create new policies for deletion
create policy "Users can delete their own beliefs"
  on beliefs for delete
  using (auth.uid() = user_id);

create policy "Users can delete evidence for their beliefs"
  on evidence for delete
  using (
    exists (
      select 1
      from beliefs
      where beliefs.id = evidence.belief_id
      and beliefs.user_id = auth.uid()
    )
  );

-- Ensure RLS is enabled
alter table public.beliefs enable row level security;
alter table public.evidence enable row level security;