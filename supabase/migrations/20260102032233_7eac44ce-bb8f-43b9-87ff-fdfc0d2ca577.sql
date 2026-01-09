-- CMS Content Tables for Landing Page

-- Hero Section Content
CREATE TABLE public.cms_hero (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  badge_text TEXT DEFAULT 'Registrations Now Open',
  title_line1 TEXT DEFAULT 'Startup & Innovation',
  title_line2 TEXT DEFAULT 'Spring Festival 2026',
  subtitle TEXT DEFAULT 'Where visionary founders meet game-changing investors. Three days of innovation, connection, and transformation.',
  event_date TEXT DEFAULT 'April 15-17, 2026',
  event_location TEXT DEFAULT 'Innovation Hub, Singapore',
  attendees_text TEXT DEFAULT '5,000+ Attendees',
  cta_primary_text TEXT DEFAULT 'Register Now',
  cta_primary_link TEXT DEFAULT '/auth?mode=signup',
  cta_secondary_text TEXT DEFAULT 'Apply as Startup',
  cta_secondary_link TEXT DEFAULT '/apply/startup',
  background_image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stats Section
CREATE TABLE public.cms_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Features Section
CREATE TABLE public.cms_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_title TEXT DEFAULT 'What to Expect',
  section_subtitle TEXT DEFAULT 'Three days packed with opportunities to learn, connect, and grow your startup',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.cms_feature_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon_name TEXT NOT NULL DEFAULT 'Rocket',
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CTA Section
CREATE TABLE public.cms_cta (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_title TEXT DEFAULT 'Join the Movement',
  section_subtitle TEXT DEFAULT 'Be part of Asia''s most impactful startup event',
  final_cta_title TEXT DEFAULT 'Ready to transform your startup journey?',
  final_cta_subtitle TEXT DEFAULT 'Register now to secure your spot at the most anticipated startup event of 2026',
  final_cta_button_text TEXT DEFAULT 'Register for SISF 2026',
  final_cta_button_link TEXT DEFAULT '/auth?mode=signup',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.cms_cta_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon_name TEXT NOT NULL DEFAULT 'Rocket',
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  button_text TEXT NOT NULL,
  button_link TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Footer Content
CREATE TABLE public.cms_footer (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_description TEXT DEFAULT 'The premier startup and innovation festival bringing together entrepreneurs, investors, and visionaries to shape the future.',
  copyright_text TEXT DEFAULT '© 2026 Startup & Innovation Spring Festival. All rights reserved.',
  event_info TEXT DEFAULT 'April 15-17, 2026 • Innovation Hub, Singapore',
  twitter_url TEXT,
  linkedin_url TEXT,
  instagram_url TEXT,
  youtube_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site Settings (logo, favicon, meta)
CREATE TABLE public.cms_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name TEXT DEFAULT 'SISF 2026',
  logo_url TEXT,
  favicon_url TEXT,
  meta_title TEXT DEFAULT 'Startup & Innovation Spring Festival 2026',
  meta_description TEXT DEFAULT 'Join Asia''s premier startup event. Connect with investors, pitch your startup, and be part of the innovation ecosystem.',
  og_image_url TEXT,
  event_start_date TIMESTAMP WITH TIME ZONE DEFAULT '2026-04-15 09:00:00+00',
  event_end_date TIMESTAMP WITH TIME ZONE DEFAULT '2026-04-17 18:00:00+00',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.cms_hero ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_feature_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_cta ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_cta_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_footer ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_settings ENABLE ROW LEVEL SECURITY;

-- Public read access for all CMS tables
CREATE POLICY "Anyone can view cms_hero" ON public.cms_hero FOR SELECT USING (true);
CREATE POLICY "Anyone can view cms_stats" ON public.cms_stats FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view cms_features" ON public.cms_features FOR SELECT USING (true);
CREATE POLICY "Anyone can view cms_feature_items" ON public.cms_feature_items FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view cms_cta" ON public.cms_cta FOR SELECT USING (true);
CREATE POLICY "Anyone can view cms_cta_cards" ON public.cms_cta_cards FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view cms_footer" ON public.cms_footer FOR SELECT USING (true);
CREATE POLICY "Anyone can view cms_settings" ON public.cms_settings FOR SELECT USING (true);

-- Admin full access
CREATE POLICY "Admins can manage cms_hero" ON public.cms_hero FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage cms_stats" ON public.cms_stats FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage cms_features" ON public.cms_features FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage cms_feature_items" ON public.cms_feature_items FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage cms_cta" ON public.cms_cta FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage cms_cta_cards" ON public.cms_cta_cards FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage cms_footer" ON public.cms_footer FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage cms_settings" ON public.cms_settings FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Insert default data
INSERT INTO public.cms_hero (id) VALUES (gen_random_uuid());
INSERT INTO public.cms_features (id) VALUES (gen_random_uuid());
INSERT INTO public.cms_cta (id) VALUES (gen_random_uuid());
INSERT INTO public.cms_footer (id) VALUES (gen_random_uuid());
INSERT INTO public.cms_settings (id) VALUES (gen_random_uuid());

-- Default stats
INSERT INTO public.cms_stats (value, label, sort_order) VALUES 
  ('5,000+', 'Attendees', 1),
  ('200+', 'Startups', 2),
  ('150+', 'Investors', 3),
  ('50+', 'Speakers', 4),
  ('$10M+', 'Deals Closed', 5),
  ('30+', 'Countries', 6);

-- Default feature items
INSERT INTO public.cms_feature_items (icon_name, title, description, sort_order) VALUES 
  ('Rocket', 'Startup Pitching', 'Showcase your startup to top-tier investors and win funding opportunities.', 1),
  ('Handshake', '1:1 Matchmaking', 'Connect with relevant investors, partners, and mentors through AI-powered matching.', 2),
  ('Mic2', 'Expert Talks', 'Learn from industry leaders and successful entrepreneurs sharing their insights.', 3),
  ('Users', 'Networking Events', 'Build meaningful connections at curated networking sessions and social events.', 4),
  ('Lightbulb', 'Innovation Labs', 'Hands-on workshops exploring cutting-edge technologies and methodologies.', 5),
  ('Trophy', 'Startup Awards', 'Compete for recognition and prizes across multiple startup categories.', 6);

-- Default CTA cards
INSERT INTO public.cms_cta_cards (icon_name, title, description, button_text, button_link, sort_order) VALUES 
  ('Rocket', 'Startups', 'Get funding, mentorship, and exposure', 'Apply Now', '/apply/startup', 1),
  ('TrendingUp', 'Investors', 'Discover the next unicorn startup', 'Join as Investor', '/apply/investor', 2),
  ('Building', 'Sponsors', 'Partner with the innovation ecosystem', 'Become a Sponsor', '/apply/sponsor', 3);

-- Updated at triggers
CREATE TRIGGER update_cms_hero_updated_at BEFORE UPDATE ON public.cms_hero FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_cms_stats_updated_at BEFORE UPDATE ON public.cms_stats FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_cms_features_updated_at BEFORE UPDATE ON public.cms_features FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_cms_feature_items_updated_at BEFORE UPDATE ON public.cms_feature_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_cms_cta_updated_at BEFORE UPDATE ON public.cms_cta FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_cms_cta_cards_updated_at BEFORE UPDATE ON public.cms_cta_cards FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_cms_footer_updated_at BEFORE UPDATE ON public.cms_footer FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_cms_settings_updated_at BEFORE UPDATE ON public.cms_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for CMS images
INSERT INTO storage.buckets (id, name, public) VALUES ('cms-images', 'cms-images', true);

-- Storage policies for CMS images
CREATE POLICY "Anyone can view cms images" ON storage.objects FOR SELECT USING (bucket_id = 'cms-images');
CREATE POLICY "Admins can upload cms images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'cms-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update cms images" ON storage.objects FOR UPDATE USING (bucket_id = 'cms-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete cms images" ON storage.objects FOR DELETE USING (bucket_id = 'cms-images' AND public.has_role(auth.uid(), 'admin'));