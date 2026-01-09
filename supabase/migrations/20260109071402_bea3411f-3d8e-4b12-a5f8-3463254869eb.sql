-- Add is_published column to CMS tables
ALTER TABLE public.cms_hero ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;
ALTER TABLE public.cms_features ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;
ALTER TABLE public.cms_cta ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;
ALTER TABLE public.cms_footer ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;
ALTER TABLE public.cms_settings ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;

-- Add draft content columns for hero (store draft version separately)
ALTER TABLE public.cms_hero 
  ADD COLUMN IF NOT EXISTS draft_title_line1 TEXT,
  ADD COLUMN IF NOT EXISTS draft_title_line2 TEXT,
  ADD COLUMN IF NOT EXISTS draft_subtitle TEXT,
  ADD COLUMN IF NOT EXISTS draft_badge_text TEXT,
  ADD COLUMN IF NOT EXISTS draft_event_date TEXT,
  ADD COLUMN IF NOT EXISTS draft_event_location TEXT,
  ADD COLUMN IF NOT EXISTS draft_attendees_text TEXT,
  ADD COLUMN IF NOT EXISTS draft_cta_primary_text TEXT,
  ADD COLUMN IF NOT EXISTS draft_cta_primary_link TEXT,
  ADD COLUMN IF NOT EXISTS draft_cta_secondary_text TEXT,
  ADD COLUMN IF NOT EXISTS draft_cta_secondary_link TEXT,
  ADD COLUMN IF NOT EXISTS draft_background_image_url TEXT,
  ADD COLUMN IF NOT EXISTS has_draft BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE;

-- Create a publish history table for audit trail
CREATE TABLE IF NOT EXISTS public.cms_publish_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_type TEXT NOT NULL,
  content_id UUID NOT NULL,
  action TEXT NOT NULL, -- 'publish', 'unpublish', 'save_draft'
  published_by UUID NOT NULL,
  changes JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on publish history
ALTER TABLE public.cms_publish_history ENABLE ROW LEVEL SECURITY;

-- Only admins can view and manage publish history
CREATE POLICY "Admins can manage publish history" ON public.cms_publish_history
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can view publish history" ON public.cms_publish_history
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );