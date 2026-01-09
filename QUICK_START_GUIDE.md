# Quick Start Guide: Multi-Tenant Event Platform

## ✅ What's New

Your admin dashboard now includes a complete system for managing multiple event templates and assigning them to different domains/subdomains.

### New Features:
1. **Templates Manager** - Create and manage event templates
2. **Domain Manager** - Map subdomains to templates
3. **Template Configuration Editor** - Customize colors, fonts, and content per template
4. **Multi-Domain Routing** - Automatic template selection based on domain

## 🚀 Getting Started (5 Steps)

### Step 1: Set Up Database Tables

You need to create the database tables in Supabase. Follow the detailed instructions in `TEMPLATE_SETUP.md`:

1. Go to your Supabase dashboard
2. Open the SQL Editor
3. Copy and paste the SQL schema from `TEMPLATE_SETUP.md`
4. Run all queries (they'll be executed sequentially)

**Note**: If you need help with this, ask your database administrator.

### Step 2: Create Your First Template

1. Go to **Admin Dashboard** → Click on "Templates" card
2. Click "New Template"
3. Fill in:
   - **Name**: e.g., "Spring Festival 2026"
   - Slug auto-generates: "spring-festival-2026"
   - **Description**: (optional) Brief description
   - **Public**: Check if you want to reuse this template
4. Click "Create"

✅ Template created! Now you can customize it.

### Step 3: Configure Template Appearance

1. Go to **Admin Dashboard** → Click "CMS Dashboard"
2. Select "Cấu hình" (Configuration) tab
3. Select your template from the dropdown
4. Customize these sections:

   **General Tab:**
   - Event title, date, location
   - Hero section title and subtitle
   - Hero image URL

   **Design Tab:**
   - Font family (Inter, Poppins, etc.)
   - Primary color (main brand color)
   - Secondary color (supporting color)
   - Accent color (highlights)

   **Sections Tab:**
   - Toggle which sections appear on homepage
   - Hero, Stats, Features, Schedule, Speakers, etc.

   **Custom CSS Tab:**
   - Add custom CSS for advanced styling

5. Click "Save Configuration"

✅ Your template now has custom appearance!

### Step 4: Create Domain Mapping

1. Go to **Admin Dashboard** → Click "Domain Manager" card
2. Click "New Domain Mapping"
3. Fill in:
   - **Template**: Select your template
   - **Base Domain**: e.g., `learnforgrowth.com.vn`
   - **Subdomain**: e.g., `festival` (for `festival.learnforgrowth.com.vn`)
   - Preview shows full domain: `festival.learnforgrowth.com.vn`
   - **SSL Enabled**: Check if using HTTPS (recommended)
4. Click "Create"

✅ Domain mapping created!

### Step 5: Configure DNS (If Using New Subdomains)

If you're adding new subdomains, update your DNS records:

1. Go to your domain provider (GoDaddy, Namecheap, etc.)
2. Find DNS settings for `learnforgrowth.com.vn`
3. Add a CNAME record:
   ```
   Type: CNAME
   Name: festival.learnforgrowth.com.vn
   Value: [your-deployment-host] (e.g., example.vercel.app)
   ```
4. Save and wait 10-30 minutes for DNS to propagate

✅ Your subdomain is now active!

## 📋 Example: Setting Up 2 Event Templates

### Event 1: Spring Festival 2026
- Template Name: "Spring Festival 2026"
- Domain: `festival.learnforgrowth.com.vn`
- Colors: Blue & Pink
- Sections: Hero, Features, Speakers, CTA

### Event 2: Tech Summit 2026
- Template Name: "Tech Summit 2026"
- Domain: `summit.learnforgrowth.com.vn`
- Colors: Black & Gold
- Sections: Hero, Schedule, Speakers, Startups

Both templates are managed independently but use the same codebase!

## 🎨 Customization Examples

### Change Brand Colors
1. Go to Cấu hình → Design Tab
2. Use the color pickers to set your colors
3. Save Configuration
4. Colors update automatically on the live site

### Hide/Show Sections
1. Go to Cấu hình → Sections Tab
2. Check/uncheck sections to show/hide them
3. Save Configuration
4. Homepage updates immediately

### Add Custom CSS
1. Go to Cấu hình → Custom CSS Tab
2. Add CSS rules like:
   ```css
   .hero-section {
     background: linear-gradient(to right, #667eea, #764ba2);
   }
   
   .button-primary {
     border-radius: 12px;
     box-shadow: 0 4px 12px rgba(0,0,0,0.2);
   }
   ```
3. Save Configuration

## 🔍 Testing Your Setup

### Test Template Configuration
1. Go to `festival.learnforgrowth.com.vn` (or your domain)
2. You should see your configured template
3. Verify colors, fonts, and enabled sections are correct

### Test Domain Routing
1. Create 2 templates with different colors
2. Map them to different subdomains
3. Visit both subdomains
4. Each should show different colors/content

### Test Domain Manager
1. Go to Domain Manager tab
2. Click "Disable" on a domain
3. Visit that domain - should show error
4. Click "Enable" again
5. Domain should work

## 📊 Managing Multiple Events

### For Each Event:
1. ✅ Create template with event name
2. ✅ Configure appearance (colors, fonts, sections)
3. ✅ Create domain mapping (subdomain assignment)
4. ✅ Update DNS if new subdomain
5. ✅ Test the live domain

### Reusing Templates:
- Mark templates as "Public" when creating
- Other admins can duplicate public templates
- Great for event series (2026, 2027, etc.)

## ⚙️ Admin Features Reference

### Templates Manager
- **Create**: Add new event template
- **Edit**: Modify template name/description
- **Duplicate**: Clone template for variations
- **Delete**: Soft delete (recoverable)
- **Set Default**: Choose fallback template

### Domain Manager
- **Create**: Map domain to template
- **Edit**: Change template/domain assignment
- **Enable/Disable**: Temporarily disable domain
- **Copy Domain**: Copy full domain URL
- **Delete**: Remove domain mapping

### Template Configuration
- **Event Info**: Title, date, location, hero text
- **Design**: Colors, fonts
- **Sections**: Show/hide page sections
- **Custom CSS**: Advanced styling

## 🆘 Troubleshooting

### "Database Error" or "Table Not Found"
- ❌ Database tables not created
- ✅ Run SQL from `TEMPLATE_SETUP.md`

### Domain not working
- ❌ DNS not configured
- ✅ Check DNS CNAME records
- ❌ Domain mapping not active
- ✅ Enable domain in Domain Manager

### Colors not showing
- ❌ Configuration not saved
- ✅ Click "Save Configuration" button
- ❌ Browser cache issue
- ✅ Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### Sections not hiding
- ❌ Custom CSS override
- ✅ Check Custom CSS tab for display:block rules
- ❌ Configuration not applied
- ✅ Ensure template is selected and saved

## 📚 For More Information

- **Database Setup**: See `TEMPLATE_SETUP.md`
- **API Reference**: See `src/hooks/useCurrentTemplate.ts`
- **Components**: See `src/components/admin/cms/`

## 🎯 Next Steps

1. Create database tables (Step 1)
2. Create first template (Step 2)
3. Configure appearance (Step 3)
4. Create domain mapping (Step 4)
5. Update DNS for subdomains (Step 5)
6. Test your live domain
7. Create more templates as needed

---

**Questions?** Contact your development team or see the detailed documentation in TEMPLATE_SETUP.md
