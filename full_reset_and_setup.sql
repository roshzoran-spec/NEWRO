-- DANGER: This script will WIPE all public data and remove the specified user.
-- Run this in the Supabase SQL Editor: https://supabase.com/dashboard/project/pvbralcrolmwvsvyyjau/sql/new

BEGIN;

-- 1. Remove the specific user from Supabase Auth
-- Note: This requires high-level permissions in the SQL editor.
DELETE FROM auth.users WHERE email = 'roshzoran@gmail.com';

-- 2. Drop all existing tables in the public schema to ensure a clean slate
DROP TABLE IF EXISTS public.screening_videos CASCADE;
DROP TABLE IF EXISTS public.therapy_reminders CASCADE;
DROP TABLE IF EXISTS public.assessment_history CASCADE;
DROP TABLE IF EXISTS public.child_progress CASCADE;
DROP TABLE IF EXISTS public.children CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.milestone_master CASCADE;

-- 3. Re-apply Migration 1: Basic Schema (Profiles, Children, Assessments, Reminders)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'parent' CHECK (role IN ('parent', 'therapist', 'clinic')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'parent')
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT DEFAULT 'unknown',
  notes TEXT DEFAULT '',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parents can view own children" ON public.children FOR SELECT TO authenticated USING (auth.uid() = parent_id);
CREATE POLICY "Parents can insert own children" ON public.children FOR INSERT TO authenticated WITH CHECK (auth.uid() = parent_id);
CREATE POLICY "Parents can update own children" ON public.children FOR UPDATE TO authenticated USING (auth.uid() = parent_id);
CREATE POLICY "Parents can delete own children" ON public.children FOR DELETE TO authenticated USING (auth.uid() = parent_id);

CREATE TABLE public.assessment_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assessment_type TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT DEFAULT '',
  scores JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.assessment_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own assessments" ON public.assessment_history FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own assessments" ON public.assessment_history FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own assessments" ON public.assessment_history FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.therapy_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  reminder_date TIMESTAMPTZ NOT NULL,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  reminder_type TEXT NOT NULL DEFAULT 'milestone' CHECK (reminder_type IN ('milestone', 'therapy', 'appointment', 'custom')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.therapy_reminders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own reminders" ON public.therapy_reminders FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own reminders" ON public.therapy_reminders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reminders" ON public.therapy_reminders FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reminders" ON public.therapy_reminders FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 4. Re-apply Migration 2: Milestones
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

ALTER TABLE public.milestone_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.child_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read milestones" ON public.milestone_master FOR SELECT USING (true);
CREATE POLICY "Users can view own progress" ON public.child_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON public.child_progress FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON public.child_progress FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own progress" ON public.child_progress FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 5. Re-apply Migration 4: Storage and Screening Videos
-- (Skipping Migration 3 as it was just a manual delete for an old user)
CREATE TABLE public.screening_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  task_type TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  duration_seconds INTEGER,
  status TEXT NOT NULL DEFAULT 'uploaded',
  notes TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.screening_videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert own screening videos" ON public.screening_videos FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own screening videos" ON public.screening_videos FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own screening videos" ON public.screening_videos FOR DELETE TO authenticated USING (auth.uid() = user_id);

COMMIT;
