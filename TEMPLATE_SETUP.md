# Multi-Tenant Template & Domain System Setup Guide

## Overview

This system allows you to create and manage multiple event templates and assign them to different domains/subdomains. For example:
- Main domain: `learnforgrowth.com.vn`
- Subdomains: `festival.learnforgrowth.com.vn`, `summit.learnforgrowth.com.vn`, etc.

## Database Schema Setup

### Step 1: Create Tables in Supabase

Go to your Supabase dashboard and run the following SQL commands:

```sql
-- Create templates table
CREATE TABLE templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- Create template configurations table
CREATE TABLE template_configs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID REFERENCES templates(id) ON DELETE CASCADE,
  event_title VARCHAR(255),
  event_date DATE,
  event_location VARCHAR(255),
  primary_color VARCHAR(7),
  secondary_color VARCHAR(7),
  accent_color VARCHAR(7),
  font_family VARCHAR(100),
  hero_title TEXT,
  hero_subtitle TEXT,
  hero_image_url TEXT,
  sections_enabled TEXT DEFAULT '{}',
  social_links JSONB,
  custom_css TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create domain mappings table
CREATE TABLE template_domains (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID REFERENCES templates(id) ON DELETE CASCADE,
  domain VARCHAR(255) UNIQUE NOT NULL,
  subdomain VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  ssl_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create domain settings table
CREATE TABLE domain_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  domain_id UUID REFERENCES template_domains(id) ON DELETE CASCADE,
  organization_name VARCHAR(255),
  contact_email VARCHAR(255),
  support_url TEXT,
  analytics_enabled BOOLEAN DEFAULT TRUE,
  analytics_code TEXT,
  custom_metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_templates_slug ON templates(slug);
CREATE INDEX idx_template_domains_domain ON template_domains(domain);
CREATE INDEX idx_template_configs_template_id ON template_configs(template_id);
```

### Step 2: Enable Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE domain_settings ENABLE ROW LEVEL SECURITY;

-- Admin policy for templates
CREATE POLICY "Admins can manage templates" ON templates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Public read policy for active templates
CREATE POLICY "Public can read active templates" ON templates
  FOR SELECT USING (is_public = TRUE OR deleted_at IS NULL);

-- Admin policy for template configs
CREATE POLICY "Admins can manage template configs" ON template_configs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Admin policy for domains
CREATE POLICY "Admins can manage domains" ON template_domains
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Public read policy for active domains
CREATE POLICY "Public can read active domains" ON template_domains
  FOR SELECT USING (is_active = TRUE);

-- Admin policy for domain settings
CREATE POLICY "Admins can manage domain settings" ON domain_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
```

## Admin Interface Features

### 1. Templates Manager
- Create new templates (automatically generates slug)
- Edit existing templates
- Duplicate templates for quick setup
- Mark templates as public for reuse
- Set default template
- Soft delete templates

**Location**: Admin Dashboard → CMS Dashboard → Templates tab

### 2. Domain Manager
- Map domains/subdomains to templates
- Enable/disable domain mappings
- Configure SSL settings
- View full domain preview
- Copy domain URLs

**Example Setup**:
```
Base Domain: learnforgrowth.com.vn
Subdomain: festival
Full Domain: festival.learnforgrowth.com.vn
Template: Spring Festival 2026
```

**Location**: Admin Dashboard → CMS Dashboard → Domains tab

### 3. Template Configuration Editor
- Customize event information (title, date, location)
- Visual color picker for primary, secondary, and accent colors
- Font family selection
- Hero section text and image
- Enable/disable specific sections (Hero, Stats, Features, etc.)
- Add custom CSS for advanced styling

**Location**: Admin Dashboard → CMS Dashboard → Cấu hình tab

## Usage Workflow

### 1. Create a New Event Template
1. Go to Admin Dashboard → CMS Dashboard → Templates
2. Click "New Template"
3. Enter template name (slug is auto-generated)
4. Add description
5. Set as public if you want to reuse it later
6. Click "Create"

### 2. Configure Template Appearance
1. Go to Admin Dashboard → CMS Dashboard → Cấu hình
2. Select your template from the dropdown
3. Customize event information
4. Pick colors and fonts in the Design tab
5. Enable/disable sections as needed
6. Add custom CSS if required
7. Click "Save Configuration"

### 3. Create Domain Mapping
1. Go to Admin Dashboard → CMS Dashboard → Domains
2. Click "New Domain Mapping"
3. Select the template to use
4. Enter base domain (e.g., `learnforgrowth.com.vn`)
5. Enter subdomain (e.g., `festival`)
6. Preview shows: `festival.learnforgrowth.com.vn`
7. Configure SSL settings
8. Click "Create"

### 4. Make Domain Active
- The domain mapping is automatically active
- You can disable it temporarily using the "Disable" button
- The page will show an error if accessed while disabled

## Multi-Domain Routing

The system automatically serves the correct template based on the domain accessed:

- `festival.learnforgrowth.com.vn` → loads "Spring Festival 2026" template
- `summit.learnforgrowth.com.vn` → loads "Tech Summit 2026" template
- `learnforgrowth.com.vn` → loads the default template

## DNS Configuration

To set up subdomains, you need to configure DNS records in your domain provider:

### Example for learnforgrowth.com.vn:

1. **Wildcard Subdomain** (recommended):
   - Type: CNAME
   - Name: `*.learnforgrowth.com.vn`
   - Value: your deployment host (e.g., `example.vercel.app`)
   - This allows all subdomains to work automatically

2. **Individual Subdomains**:
   - Type: CNAME
   - Name: `festival.learnforgrowth.com.vn`
   - Value: your deployment host

## Content Management

Each template can have different content:
- Different hero titles and images
- Different color schemes
- Different layouts (some sections enabled, others disabled)
- Custom CSS styling
- Different event information

## API Endpoints (for frontend)

### Get Active Domain Config
```typescript
const { data } = await supabase
  .from('template_domains')
  .select('*, templates(*), template_configs(*)')
  .eq('domain', currentDomain)
  .eq('is_active', true)
  .single();
```

### Get Template Config
```typescript
const { data } = await supabase
  .from('template_configs')
  .select('*')
  .eq('template_id', templateId)
  .single();
```

## Troubleshooting

### Domain Not Working
- Ensure DNS CNAME record is properly configured
- Check if domain mapping is set to active in the admin panel
- Verify the template is associated with the domain
- Check SSL certificate is valid

### Template Not Showing
- Verify template configuration is saved
- Check if sections are enabled in the configuration
- Ensure the template is not deleted (deleted_at is NULL)
- Clear browser cache

### Colors/Fonts Not Applying
- The custom CSS editor is for advanced styling
- Use the color picker in the Design tab for primary colors
- Ensure you saved the configuration

## Next Steps

1. Create your first template
2. Configure its appearance
3. Map it to a domain/subdomain
4. Update DNS records if using new subdomains
5. Test the domain in a browser

## Security Notes

- Only admins can create/edit templates and domains
- Domain configurations are cached to reduce database queries
- All user data is protected with RLS policies
- SSL encryption is recommended for all domains

