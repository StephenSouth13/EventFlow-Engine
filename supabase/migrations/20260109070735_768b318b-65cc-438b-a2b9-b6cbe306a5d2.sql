--D:\Website\EventFlow-Engine\supabase\migrations\20260109070735_768b318b-65cc-438b-a2b9-b6cbe306a5d2.sql--
-- Create navigation menu table
CREATE TABLE public.cms_navigation (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create sections visibility table
CREATE TABLE public.cms_sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT NOT NULL UNIQUE,
  section_name TEXT NOT NULL,
  is_visible BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cms_navigation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_sections ENABLE ROW LEVEL SECURITY;

-- RLS policies for navigation - public read, admin write
CREATE POLICY "Anyone can view navigation" ON public.cms_navigation FOR SELECT USING (true);
CREATE POLICY "Admins can manage navigation" ON public.cms_navigation FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- RLS policies for sections - public read, admin write
CREATE POLICY "Anyone can view sections" ON public.cms_sections FOR SELECT USING (true);
CREATE POLICY "Admins can manage sections" ON public.cms_sections FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Insert default navigation items
INSERT INTO public.cms_navigation (label, href, sort_order, is_visible) VALUES
  ('Trang chủ', '/', 1, true),
  ('Giới thiệu', '/about', 2, true),
  ('Lịch trình', '/schedule', 3, true),
  ('Diễn giả', '/speakers', 4, true),
  ('Startups', '/startups', 5, true),
  ('Địa điểm', '/venue', 6, true),
  ('FAQ', '/faq', 7, true),
  ('Liên hệ', '/contact', 8, true);

-- Insert default sections visibility
INSERT INTO public.cms_sections (section_key, section_name, sort_order, is_visible) VALUES
  ('hero', 'Hero Banner', 1, true),
  ('countdown', 'Countdown Timer', 2, true),
  ('stats', 'Thống kê', 3, true),
  ('features', 'Tính năng', 4, true),
  ('cta', 'Call to Action', 5, true),
  ('speakers', 'Diễn giả nổi bật', 6, true),
  ('startups', 'Startups nổi bật', 7, true),
  ('schedule', 'Lịch trình', 8, true);

-- Add trigger for updated_at
CREATE TRIGGER update_cms_navigation_updated_at
  BEFORE UPDATE ON public.cms_navigation
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cms_sections_updated_at
  BEFORE UPDATE ON public.cms_sections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();