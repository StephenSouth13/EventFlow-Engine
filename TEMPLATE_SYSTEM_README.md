# 🚀 Multi-Tenant Event Platform - Complete Documentation

## Overview

You now have a complete admin system for managing multiple event templates and assigning them to different domains/subdomains. This allows you to:

- 🎨 Create unlimited event templates
- 🎯 Customize appearance for each template (colors, fonts, sections)
- 🌐 Host multiple events on different subdomains
- 📊 Manage everything from one admin dashboard
- 🔒 Secure multi-tenant architecture with database-level security

## Architecture

```
┌─────────────────────────────────────────┐
│     Admin Dashboard (One Location)      │
└─────────────────────────────────────────┘
         ↓
    ┌─── ┴─── ┐
    ↓         ↓
┌─────────┐  ┌────────────┐
│Templates│  │Domain Maps │
│Manager  │  │Manager     │
└─────────┘  └────────────┘
    ↓             ↓
┌─────────────────────────────────┐
│   Template Configuration        │
│ (Colors, Fonts, Sections, CSS)  │
└─────────────────────────────────┘
    ↓
┌──────────────────────────────────────────┐
│  Database (Supabase)                     │
│ ┌──────────────────────────────────────┐ │
│ │ templates                            │ │
│ │ template_configs                     │ │
│ │ template_domains                     │ │
│ │ domain_settings                      │ │
│ └──────────────────────────────────────┘ │
└──────────────────────────────────────────┘
    ↓
┌──────────────────────────────────────────┐
│     Live Domains                         │
│ ┌──────────────────────────────────────┐ │
│ │ festival.learnforgrowth.com.vn      │ │
│ │ summit.learnforgrowth.com.vn        │ │
│ │ pitch.learnforgrowth.com.vn         │ │
│ └──────────────────────────────────────┘ │
└──────────────────────────────────────────┘
```

## File Structure

```
src/
├── components/admin/cms/
│   ├── TemplatesManager.tsx          # Create/edit/delete templates
│   ├── DomainManager.tsx             # Manage domain mappings
│   ├── TemplateConfigEditor.tsx      # Customize template appearance
│   └── ... (existing CMS components)
│
├── hooks/
│   ├── useCurrentTemplate.ts         # Load template by domain
│   └── ... (existing hooks)
│
└── pages/admin/
    └── CMSDashboard.tsx              # Main admin interface

Documentation/
├── TEMPLATE_SETUP.md                 # Database schema & setup
├── QUICK_START_GUIDE.md              # Getting started guide
├── TEMPLATE_SAMPLE_DATA.sql          # Demo data
└── TEMPLATE_SYSTEM_README.md         # This file
```

## 📋 Database Schema

### Templates Table
```sql
- id: UUID (primary key)
- name: String (e.g., "Spring Festival 2026")
- slug: String (auto-generated, e.g., "spring-festival-2026")
- description: Text (optional)
- is_default: Boolean (fallback template)
- is_public: Boolean (can be duplicated)
- created_by: UUID (admin who created it)
- created_at, updated_at, deleted_at: Timestamps
```

### Template Configs Table
```sql
- id: UUID (primary key)
- template_id: UUID (foreign key)
- event_title: String
- event_date: Date
- event_location: String
- primary_color: String (hex, e.g., "#3b82f6")
- secondary_color: String
- accent_color: String
- font_family: String
- hero_title: String
- hero_subtitle: String
- hero_image_url: String
- sections_enabled: JSON (array of section names)
- social_links: JSON
- custom_css: Text
- created_at, updated_at: Timestamps
```

### Template Domains Table
```sql
- id: UUID (primary key)
- template_id: UUID (foreign key)
- domain: String (unique, e.g., "festival.learnforgrowth.com.vn")
- subdomain: String (e.g., "festival")
- is_active: Boolean
- ssl_enabled: Boolean
- created_at, updated_at: Timestamps
```

### Domain Settings Table
```sql
- id: UUID (primary key)
- domain_id: UUID (foreign key)
- organization_name: String
- contact_email: String
- support_url: String
- analytics_enabled: Boolean
- analytics_code: String
- custom_metadata: JSON
- created_at, updated_at: Timestamps
```

## 🎯 Key Features

### 1. Templates Manager
**Location**: Admin Dashboard → CMS Dashboard → Templates

**Features**:
- ✅ Create new templates with auto-generated slugs
- ✅ Edit template names and descriptions
- ✅ Duplicate templates for quick setup
- ✅ Mark templates as public (reusable)
- ✅ Set default template (fallback for unknown domains)
- ✅ Soft delete templates (recoverable)

**Workflow**:
```
Create Template → Configure Appearance → Map to Domain → Go Live
```

### 2. Domain Manager
**Location**: Admin Dashboard → CMS Dashboard → Domains

**Features**:
- ✅ Map domains/subdomains to templates
- ✅ Support for multiple subdomains under one main domain
- ✅ Enable/disable domains without deletion
- ✅ Configure SSL settings
- ✅ View full domain preview
- ✅ Copy domain URLs

**Example Setups**:
```
Base Domain: learnforgrowth.com.vn
- festival.learnforgrowth.com.vn → Spring Festival template
- summit.learnforgrowth.com.vn → Tech Summit template
- pitch.learnforgrowth.com.vn → Pitch Day template
```

### 3. Template Configuration Editor
**Location**: Admin Dashboard → CMS Dashboard → Cấu hình

**Tabs**:

**General Tab**:
- Event title, date, location
- Hero section headline and subtitle
- Hero image URL

**Design Tab**:
- Font family selection (6 options)
- Color pickers for primary, secondary, accent colors
- Visual color preview

**Sections Tab**:
- Toggle visibility of 8 sections
- Hero, Stats, Features, CTA, Footer, Speakers, Schedule, Startups

**Custom CSS Tab**:
- Add advanced CSS styling
- Override default styles
- Create custom effects

## 🔌 API Hooks

### useCurrentTemplate()
Load template based on current domain:
```typescript
const { template, config, enabledSections, domain } = useCurrentTemplate();
```

### useTemplate(id_or_slug)
Load specific template by ID or slug:
```typescript
const { template, config, isLoading } = useTemplate("spring-festival-2026");
```

### useTemplateDomains(templateId)
Get all domains for a template:
```typescript
const { domains } = useTemplateDomains(templateId);
```

### useApplyTemplateStyles()
Apply template CSS to document:
```typescript
useApplyTemplateStyles(
  primaryColor,
  secondaryColor,
  accentColor,
  fontFamily,
  customCSS
);
```

## 🚀 Getting Started

### Quick Start (5 Steps)

**Step 1: Create Database Tables**
- Copy SQL from `TEMPLATE_SETUP.md`
- Run in Supabase SQL Editor
- Wait for all queries to complete

**Step 2: Create Template**
- Admin Dashboard → "Templates" card
- Click "New Template"
- Fill template name, click "Create"

**Step 3: Configure Appearance**
- Admin Dashboard → CMS Dashboard
- Go to "Cấu hình" tab
- Select your template
- Customize colors, fonts, sections
- Save Configuration

**Step 4: Create Domain Mapping**
- Admin Dashboard → "Domain Manager" card
- Click "New Domain Mapping"
- Select template, enter domain, click "Create"

**Step 5: Update DNS (if new subdomain)**
- Go to domain provider
- Add CNAME record for subdomain
- Wait 10-30 minutes for propagation
- Test the domain

### Sample Setup with Demo Data

1. Run `TEMPLATE_SAMPLE_DATA.sql` in Supabase
2. Creates 3 demo templates with configurations
3. Maps them to sample subdomains
4. Ready for testing

## 🎨 Customization Examples

### Change All Colors
1. Cấu hình tab → Design tab
2. Use color pickers
3. Save

### Hide Sections
1. Cấu hình tab → Sections tab
2. Uncheck unwanted sections
3. Save

### Custom Styling
1. Cấu hình tab → Custom CSS tab
2. Add CSS rules
3. Save

### Different Event Date
1. Cấu hình tab → General tab
2. Change event_date
3. Save

## 🔒 Security

### Database Level (RLS)
- Only admins can create/edit templates
- Only admins can manage domains
- Public templates visible to all

### Authentication
- Route `/admin/*` protected by auth middleware
- Requires admin role in user_roles table
- Session-based authentication via Supabase

### Multi-Tenancy
- Each domain is completely isolated
- Separate configurations per template
- No cross-domain data leakage

## 📊 Performance

### Optimizations
- Database indexes on frequently queried columns
- Cached template queries via React Query
- Lazy loading of template configs
- CSS injection only when needed

### Query Examples
```typescript
// Get active domain config
const { data } = await supabase
  .from('template_domains')
  .select('*, templates(*), template_configs(*)')
  .eq('domain', currentDomain)
  .eq('is_active', true)
  .single();

// Get all active domains
const { data } = await supabase
  .from('template_domains')
  .select('*')
  .eq('is_active', true);
```

## 🆘 Troubleshooting

### "Table not found" error
**Solution**: Run the database schema creation SQL

### Domain not resolving
**Solution**: 
1. Check DNS CNAME records
2. Verify domain is active in Domain Manager
3. Wait for DNS propagation (10-30 min)

### Colors not applying
**Solution**:
1. Verify configuration is saved
2. Hard refresh browser (Ctrl+Shift+R)
3. Check Custom CSS for conflicts

### Template not showing
**Solution**:
1. Verify template is not deleted
2. Check domain mapping is active
3. Ensure configuration is saved

### Sections not hiding
**Solution**:
1. Verify sections are unchecked in Sections tab
2. Check Custom CSS for display rules
3. Clear browser cache

## 🔧 Advanced Usage

### Using Custom CSS for Branding
```css
:root {
  --brand-color: #ff6b6b;
  --brand-font: 'Custom Font';
}

.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: var(--brand-font);
}

.button-primary {
  background-color: var(--brand-color);
  border-radius: 12px;
  transition: all 0.3s ease;
}
```

### Duplicating Popular Templates
1. Create original template
2. Mark as public
3. Go to Templates Manager
4. Click Copy button
5. Customize the copy for new event

### Managing Multiple Events
Each template gets its own:
- Unique slug and name
- Custom configuration (colors, fonts, sections)
- Dedicated domain/subdomain
- Separate analytics (optional)

## 📈 Scaling

### For 10+ Events
- All managed from one admin dashboard
- Minimal database queries (cached)
- Fast domain switching
- No performance degradation

### For 100+ Events
- Consider adding analytics dashboard
- Implement template versioning
- Archive old templates
- Monitor database performance

## 🎓 Learning Resources

1. **Getting Started**: QUICK_START_GUIDE.md
2. **Database Setup**: TEMPLATE_SETUP.md
3. **API Reference**: src/hooks/useCurrentTemplate.ts
4. **Components**: src/components/admin/cms/

## 📞 Support

### Common Issues
See Troubleshooting section above

### Feature Requests
Contact your development team

### Bug Reports
Include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Browser/environment info

## 🎯 Next Steps

1. ✅ Create database tables
2. ✅ Create first template
3. ✅ Configure appearance
4. ✅ Create domain mapping
5. ✅ Test live domain
6. ✅ Create more templates as needed
7. (Optional) Set up analytics
8. (Optional) Implement template versioning

---

## Summary

You now have a **complete, production-ready multi-tenant event platform** where:

✅ Multiple events can run simultaneously
✅ Each event has custom branding and content
✅ All managed from one admin dashboard
✅ Secure database-level isolation
✅ Easy domain/subdomain management
✅ Fully customizable appearance
✅ Ready to scale

**Start building your next event template today!**
