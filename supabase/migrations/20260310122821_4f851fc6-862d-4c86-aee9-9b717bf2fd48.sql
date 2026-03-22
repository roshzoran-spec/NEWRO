DELETE FROM public.child_progress WHERE user_id = '912e2059-73d2-4304-a74c-d84b0d425a19';
DELETE FROM public.therapy_reminders WHERE user_id = '912e2059-73d2-4304-a74c-d84b0d425a19';
DELETE FROM public.assessment_history WHERE user_id = '912e2059-73d2-4304-a74c-d84b0d425a19';
DELETE FROM public.children WHERE parent_id = '912e2059-73d2-4304-a74c-d84b0d425a19';
DELETE FROM public.profiles WHERE id = '912e2059-73d2-4304-a74c-d84b0d425a19';
DELETE FROM auth.users WHERE id = '912e2059-73d2-4304-a74c-d84b0d425a19';