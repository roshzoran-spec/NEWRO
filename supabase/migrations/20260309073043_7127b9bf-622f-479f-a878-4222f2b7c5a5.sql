
-- Milestone master table with all 4 domains and parent-friendly questions
CREATE TABLE public.milestone_master (
  id TEXT PRIMARY KEY,
  domain TEXT NOT NULL CHECK (domain IN ('speech', 'cognition', 'motor', 'social')),
  category TEXT NOT NULL,
  age_month INTEGER NOT NULL,
  description TEXT NOT NULL,
  question TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  difficulty TEXT NOT NULL DEFAULT 'basic' CHECK (difficulty IN ('basic', 'intermediate', 'advanced')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Child milestone progress tracking
CREATE TABLE public.child_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  milestone_id TEXT NOT NULL REFERENCES public.milestone_master(id) ON DELETE CASCADE,
  response TEXT NOT NULL DEFAULT 'not_yet' CHECK (response IN ('yes', 'emerging', 'not_yet')),
  date_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(child_id, milestone_id)
);

-- Enable RLS
ALTER TABLE public.milestone_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.child_progress ENABLE ROW LEVEL SECURITY;

-- milestone_master is readable by everyone (reference data)
CREATE POLICY "Anyone can read milestones" ON public.milestone_master FOR SELECT USING (true);

-- child_progress: users can only CRUD their own
CREATE POLICY "Users can view own progress" ON public.child_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON public.child_progress FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON public.child_progress FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own progress" ON public.child_progress FOR DELETE TO authenticated USING (auth.uid() = user_id);
