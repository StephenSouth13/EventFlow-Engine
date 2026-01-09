-- Sample Data for Template System
-- Run this AFTER you've created the database tables
-- This will create demo templates and configurations for testing

-- 1. Insert Sample Templates
INSERT INTO templates (name, slug, description, is_default, is_public, created_by)
VALUES
  ('Spring Festival 2026', 'spring-festival-2026', 'Startup & Innovation Spring Festival 2026', true, true, NULL),
  ('Tech Summit 2026', 'tech-summit-2026', 'Annual Technology Summit for Innovators', false, true, NULL),
  ('Investor Pitch Day', 'investor-pitch-day', 'One-day pitch competition for startups', false, false, NULL);

-- 2. Get template IDs for the next step (you'll see these UUIDs)
-- SELECT id, name FROM templates WHERE slug IN ('spring-festival-2026', 'tech-summit-2026', 'investor-pitch-day');

-- 3. Insert Template Configurations
-- Replace the UUIDs with the actual template IDs from step 2

-- For Spring Festival 2026 (REPLACE-UUID-1 with actual UUID)
INSERT INTO template_configs (
  template_id,
  event_title,
  event_date,
  event_location,
  primary_color,
  secondary_color,
  accent_color,
  font_family,
  hero_title,
  hero_subtitle,
  hero_image_url,
  sections_enabled,
  custom_css
)
VALUES (
  (SELECT id FROM templates WHERE slug = 'spring-festival-2026'),
  'Startup & Innovation Spring Festival 2026',
  '2026-04-15',
  'Ho Chi Minh City, Vietnam',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  'Inter, system-ui, sans-serif',
  'Welcome to Spring Festival 2026',
  'Join Asia''s Premier Startup and Innovation Event',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=400&fit=crop',
  '["hero", "stats", "features", "cta", "footer", "speakers", "schedule", "startups"]',
  '.hero-section { background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); }'
);

-- For Tech Summit 2026
INSERT INTO template_configs (
  template_id,
  event_title,
  event_date,
  event_location,
  primary_color,
  secondary_color,
  accent_color,
  font_family,
  hero_title,
  hero_subtitle,
  hero_image_url,
  sections_enabled,
  custom_css
)
VALUES (
  (SELECT id FROM templates WHERE slug = 'tech-summit-2026'),
  'Tech Summit 2026',
  '2026-06-20',
  'Hanoi, Vietnam',
  '#1f2937',
  '#fbbf24',
  '#f59e0b',
  'Space Grotesk, Inter, sans-serif',
  'Tech Summit 2026',
  'Discover the Future of Technology and Innovation',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=400&fit=crop',
  '["hero", "stats", "features", "cta", "footer", "speakers", "schedule"]',
  '.hero-section { background: linear-gradient(135deg, #1f2937 0%, #374151 100%); color: #fbbf24; }'
);

-- For Investor Pitch Day
INSERT INTO template_configs (
  template_id,
  event_title,
  event_date,
  event_location,
  primary_color,
  secondary_color,
  accent_color,
  font_family,
  hero_title,
  hero_subtitle,
  hero_image_url,
  sections_enabled,
  custom_css
)
VALUES (
  (SELECT id FROM templates WHERE slug = 'investor-pitch-day'),
  'Investor Pitch Day',
  '2026-05-10',
  'Ho Chi Minh City & Online',
  '#059669',
  '#0891b2',
  '#dc2626',
  'Poppins, sans-serif',
  'Pitch Your Startup to Top Investors',
  'One Day. 20 Startups. Unlimited Opportunities',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=400&fit=crop',
  '["hero", "features", "cta", "footer", "startups"]',
  '.hero-section { background: linear-gradient(135deg, #059669 0%, #0891b2 100%); }'
);

-- 4. Insert Domain Mappings
INSERT INTO template_domains (template_id, domain, subdomain, is_active, ssl_enabled)
VALUES
  ((SELECT id FROM templates WHERE slug = 'spring-festival-2026'), 'festival.learnforgrowth.com.vn', 'festival', true, true),
  ((SELECT id FROM templates WHERE slug = 'tech-summit-2026'), 'summit.learnforgrowth.com.vn', 'summit', true, true),
  ((SELECT id FROM templates WHERE slug = 'investor-pitch-day'), 'pitch.learnforgrowth.com.vn', 'pitch', true, true);

-- 5. Verify the data was inserted
SELECT 'Templates created:' as status;
SELECT COUNT(*) as template_count FROM templates;

SELECT 'Template Configs created:' as status;
SELECT COUNT(*) as config_count FROM template_configs;

SELECT 'Domain Mappings created:' as status;
SELECT COUNT(*) as domain_count FROM template_domains;

-- 6. View the complete setup
SELECT 'Complete Setup:' as status;
SELECT 
  t.name as template_name,
  tc.event_title,
  td.domain,
  td.is_active
FROM templates t
LEFT JOIN template_configs tc ON t.id = tc.template_id
LEFT JOIN template_domains td ON t.id = td.template_id
WHERE t.deleted_at IS NULL;
