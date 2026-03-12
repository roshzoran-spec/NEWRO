
-- Create storage bucket for screening videos
INSERT INTO storage.buckets (id, name, public) VALUES ('screening-videos', 'screening-videos', false);

-- Allow authenticated users to upload their own videos
CREATE POLICY "Users can upload screening videos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'screening-videos' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow users to view their own videos
CREATE POLICY "Users can view own screening videos"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'screening-videos' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow users to delete own videos
CREATE POLICY "Users can delete own screening videos"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'screening-videos' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Create screening_videos metadata table
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

CREATE POLICY "Users can insert own screening videos"
ON public.screening_videos FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own screening videos"
ON public.screening_videos FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own screening videos"
ON public.screening_videos FOR DELETE TO authenticated
USING (auth.uid() = user_id);
