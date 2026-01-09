-- ============================================================================
-- CMS ENHANCEMENTS DATABASE SCHEMA
-- ============================================================================
-- Run this SQL in your Supabase SQL Editor to create all necessary tables
-- for the new CMS features

-- ============================================================================
-- 1. SOCIAL MEDIA LINKS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS social_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform VARCHAR(50) NOT NULL,
  url TEXT NOT NULL,
  icon_name VARCHAR(50),
  sort_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_social_links_sort ON social_links(sort_order);

-- ============================================================================
-- 2. BRANDING SETTINGS TABLE (Logo & Footer)
-- ============================================================================
CREATE TABLE IF NOT EXISTS branding_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  header_logo_url TEXT,
  footer_logo_url TEXT,
  footer_copyright_text TEXT,
  footer_event_info TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- 3. PAGE CONFIGURATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS page_configs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_slug VARCHAR(100) UNIQUE NOT NULL,
  page_title VARCHAR(255),
  page_description TEXT,
  is_visible BOOLEAN DEFAULT TRUE,
  sections_enabled TEXT, -- JSON array of section names
  custom_content TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_page_configs_slug ON page_configs(page_slug);

-- ============================================================================
-- 4. HOMEPAGE THEMES TABLE (10 Presets)
-- ============================================================================
CREATE TABLE IF NOT EXISTS homepage_themes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  primary_color VARCHAR(7) NOT NULL,
  secondary_color VARCHAR(7) NOT NULL,
  accent_color VARCHAR(7) NOT NULL,
  gradient_start VARCHAR(7) NOT NULL,
  gradient_end VARCHAR(7) NOT NULL,
  font_family VARCHAR(255),
  background_pattern VARCHAR(50),
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_homepage_themes_slug ON homepage_themes(slug);
CREATE INDEX idx_homepage_themes_active ON homepage_themes(is_active);

-- ============================================================================
-- 5. CONTACT SUBMISSIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'new', -- new, read, replied
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX idx_contact_submissions_created ON contact_submissions(created_at);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE branding_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Social Links Policies
CREATE POLICY "Public can read visible social links" ON social_links
  FOR SELECT USING (is_visible = TRUE);

CREATE POLICY "Admins can manage social links" ON social_links
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Branding Settings Policies
CREATE POLICY "Public can read branding settings" ON branding_settings
  FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage branding settings" ON branding_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Page Configs Policies
CREATE POLICY "Public can read visible page configs" ON page_configs
  FOR SELECT USING (is_visible = TRUE);

CREATE POLICY "Admins can manage page configs" ON page_configs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Homepage Themes Policies
CREATE POLICY "Public can read themes" ON homepage_themes
  FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage themes" ON homepage_themes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Contact Submissions Policies
CREATE POLICY "Admins can manage submissions" ON contact_submissions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- SAMPLE DATA
-- ============================================================================

-- Insert sample branding settings
INSERT INTO branding_settings (
  footer_copyright_text,
  footer_event_info
)
VALUES (
  '© 2026 Startup & Innovation Spring Festival. All rights reserved.',
  'April 15-17, 2026 • Innovation Hub, Singapore'
)
ON CONFLICT DO NOTHING;

-- Insert sample social links
INSERT INTO social_links (platform, url, icon_name, sort_order, is_visible)
VALUES
  ('Twitter', 'https://twitter.com/sisf2026', 'Twitter', 1, true),
  ('LinkedIn', 'https://linkedin.com/company/sisf2026', 'Linkedin', 2, true),
  ('Instagram', 'https://instagram.com/sisf2026', 'Instagram', 3, true),
  ('YouTube', 'https://youtube.com/@sisf2026', 'Youtube', 4, true)
ON CONFLICT DO NOTHING;

-- Insert page configurations for all 8 pages
INSERT INTO page_configs (page_slug, page_title, is_visible, sections_enabled)
VALUES
  ('home', 'Trang chủ', true, '["hero", "stats", "features", "cta"]'),
  ('about', 'Giới thiệu', true, '["about-content", "team", "mission"]'),
  ('schedule', 'Lịch trình', true, '["schedule-header", "schedule-items"]'),
  ('speakers', 'Diễn giả', true, '["speakers-header", "speakers-list"]'),
  ('startups', 'Startups', true, '["startups-header", "startups-list"]'),
  ('venue', 'Địa điểm', true, '["venue-info", "venue-map", "hotels"]'),
  ('faq', 'FAQ', true, '["faq-header", "faq-items"]'),
  ('contact', 'Liên hệ', true, '["contact-form", "contact-info"]')
ON CONFLICT DO NOTHING;

-- Insert 10 theme presets
INSERT INTO homepage_themes (name, slug, description, primary_color, secondary_color, accent_color, gradient_start, gradient_end, font_family, background_pattern, is_active)
VALUES
  ('Ocean Blue', 'ocean-blue', 'Professional ocean-inspired theme with cool blue tones', '#0ea5e9', '#06b6d4', '#0891b2', '#0ea5e9', '#06b6d4', 'Inter, system-ui, sans-serif', 'dots', false),
  ('Sunset Gold', 'sunset-gold', 'Warm and energetic theme with golden sunset colors', '#f59e0b', '#f97316', '#ea580c', '#fbbf24', '#f97316', 'Space Grotesk, Inter, sans-serif', 'gradient', false),
  ('Purple Haze', 'purple-haze', 'Modern and creative purple-pink theme', '#a855f7', '#ec4899', '#db2777', '#c084fc', '#f472b6', 'Poppins, sans-serif', 'mesh', false),
  ('Tech Dark', 'tech-dark', 'Dark and minimalist tech-focused theme', '#1f2937', '#374151', '#60a5fa', '#1f2937', '#374151', 'Roboto Mono, monospace', 'grid', false),
  ('Green Energy', 'green-energy', 'Eco-friendly theme with vibrant green tones', '#10b981', '#059669', '#047857', '#34d399', '#10b981', 'Inter, system-ui, sans-serif', 'dots', false),
  ('Pink Blossom', 'pink-blossom', 'Elegant and soft pink theme', '#ec4899', '#f472b6', '#db2777', '#fbcfe8', '#f472b6', 'Playfair Display, serif', 'gradient', false),
  ('Neon Cyberpunk', 'neon-cyberpunk', 'Bold cyberpunk-inspired theme with neon colors', '#ff006e', '#00f5ff', '#ffbe0b', '#ff006e', '#00f5ff', 'Space Grotesk, Inter, sans-serif', 'mesh', false),
  ('Forest Deep', 'forest-deep', 'Deep forest green with earthy tones', '#15803d', '#1e7e34', '#f59e0b', '#22c55e', '#15803d', 'Montserrat, sans-serif', 'dots', false),
  ('Coral Reef', 'coral-reef', 'Tropical and vibrant coral theme', '#f97316', '#fb923c', '#fed7aa', '#fb923c', '#fbbf24', 'Poppins, sans-serif', 'gradient', false),
  ('Midnight Indigo', 'midnight-indigo', 'Deep indigo night theme', '#4f46e5', '#6366f1', '#818cf8', '#4f46e5', '#6366f1', 'Inter, system-ui, sans-serif', 'grid', true)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Run these to verify all tables were created successfully

SELECT 'Tables Created:' as status;
SELECT COUNT(*) as social_links_count FROM social_links;
SELECT COUNT(*) as branding_settings_count FROM branding_settings;
SELECT COUNT(*) as page_configs_count FROM page_configs;
SELECT COUNT(*) as themes_count FROM homepage_themes;
SELECT COUNT(*) as contact_submissions_count FROM contact_submissions;

SELECT 'All Tables Ready!' as status;
