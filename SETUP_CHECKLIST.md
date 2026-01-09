# ✅ Multi-Tenant Template System - Setup Checklist

Use this checklist to track your progress setting up the template system.

## 📋 Phase 1: Database Setup (Required First)

- [ ] **1.1** Open Supabase dashboard
- [ ] **1.2** Go to SQL Editor
- [ ] **1.3** Copy SQL from `TEMPLATE_SETUP.md` (Create Tables section)
- [ ] **1.4** Run all table creation queries
- [ ] **1.5** Copy SQL from `TEMPLATE_SETUP.md` (RLS section)
- [ ] **1.6** Run all RLS policy queries
- [ ] **1.7** Verify tables exist in Supabase dashboard
  - [ ] templates table
  - [ ] template_configs table
  - [ ] template_domains table
  - [ ] domain_settings table

✅ **Database is ready!**

---

## 🎨 Phase 2: Create First Template (Admin Interface)

- [ ] **2.1** Log in as admin user
- [ ] **2.2** Go to Admin Dashboard (`/admin`)
- [ ] **2.3** Click "Templates" card
- [ ] **2.4** Click "New Template" button
- [ ] **2.5** Fill in template details:
  - [ ] Name: e.g., "Spring Festival 2026"
  - [ ] Slug: auto-generated (read-only)
  - [ ] Description: Brief description
  - [ ] Public: Check if reusable
- [ ] **2.6** Click "Create" button
- [ ] **2.7** Template appears in list

✅ **Template created!**

---

## 🎯 Phase 3: Configure Template Appearance

- [ ] **3.1** From Admin Dashboard, click "CMS Dashboard"
- [ ] **3.2** Click "Cấu hình" tab
- [ ] **3.3** Select your template from dropdown
- [ ] **3.4** **General Tab** - Fill in:
  - [ ] Event title
  - [ ] Event date
  - [ ] Event location
  - [ ] Hero title
  - [ ] Hero subtitle
  - [ ] Hero image URL
- [ ] **3.5** **Design Tab** - Customize:
  - [ ] Select font family
  - [ ] Pick primary color
  - [ ] Pick secondary color
  - [ ] Pick accent color
- [ ] **3.6** **Sections Tab** - Enable/disable:
  - [ ] Check/uncheck desired sections
  - [ ] At least keep Hero checked
- [ ] **3.7** **Custom CSS Tab** (optional):
  - [ ] Add custom CSS if needed
- [ ] **3.8** Click "Save Configuration" button
- [ ] **3.9** Verify no errors appear

✅ **Template configured!**

---

## 🌐 Phase 4: Create Domain Mapping

- [ ] **4.1** From Admin Dashboard, click "Domain Manager" card
- [ ] **4.2** Click "New Domain Mapping" button
- [ ] **4.3** Select template from dropdown
- [ ] **4.4** Enter base domain:
  - [ ] e.g., `learnforgrowth.com.vn`
- [ ] **4.5** Enter subdomain (optional):
  - [ ] e.g., `festival`
  - [ ] Leave empty for root domain
- [ ] **4.6** Verify full domain preview
  - [ ] Should show: `festival.learnforgrowth.com.vn`
- [ ] **4.7** Configure settings:
  - [ ] Check "Active"
  - [ ] Check "SSL Enabled"
- [ ] **4.8** Click "Create" button
- [ ] **4.9** Domain appears in list with green "Active" badge

✅ **Domain mapping created!**

---

## 🔌 Phase 5: Configure DNS (If Using New Subdomain)

Only needed if you're adding a NEW subdomain (not the main domain).

- [ ] **5.1** Go to your domain provider (GoDaddy, Namecheap, etc.)
- [ ] **5.2** Find DNS settings for `learnforgrowth.com.vn`
- [ ] **5.3** Add or edit CNAME record:
  - [ ] Type: CNAME
  - [ ] Name: `festival.learnforgrowth.com.vn`
  - [ ] Value: Your hosting (e.g., `example.vercel.app`)
  - [ ] TTL: 3600 (default)
- [ ] **5.4** Save the DNS record
- [ ] **5.5** Wait 10-30 minutes for DNS propagation
  - [ ] Optional: Test with `nslookup festival.learnforgrowth.com.vn`

✅ **DNS configured!** (May take 10-30 minutes to fully propagate)

---

## 🧪 Phase 6: Test Your Setup

- [ ] **6.1** Open browser
- [ ] **6.2** Visit your domain (e.g., `festival.learnforgrowth.com.vn`)
- [ ] **6.3** Verify template loads:
  - [ ] Page content appears
  - [ ] No error messages
  - [ ] Correct template shows
- [ ] **6.4** Verify customizations applied:
  - [ ] Colors match what you selected
  - [ ] Font looks correct
  - [ ] Sections you enabled are visible
  - [ ] Sections you disabled are hidden
- [ ] **6.5** Test admin panel:
  - [ ] Go to Admin Dashboard
  - [ ] Change a color in Cấu hình
  - [ ] Save Configuration
  - [ ] Refresh your domain page
  - [ ] Verify color change appears

✅ **Live template working!**

---

## 📊 Phase 7: Create Second Template (Optional)

- [ ] **7.1** Repeat Phase 2 (Create template)
- [ ] **7.2** Repeat Phase 3 (Configure appearance)
  - [ ] Use different colors
  - [ ] Use different font
  - [ ] Different hero content
- [ ] **7.3** Repeat Phase 4 (Create domain mapping)
  - [ ] Use different subdomain
  - [ ] e.g., `summit.learnforgrowth.com.vn`
- [ ] **7.4** Repeat Phase 5 (Configure DNS)
- [ ] **7.5** Repeat Phase 6 (Test)
- [ ] **7.6** Visit both domains, verify different templates

✅ **Multiple events running!**

---

## 🎊 Phase 8: Celebrate!

You've successfully set up the complete multi-tenant template system!

- [ ] **8.1** You can create unlimited event templates
- [ ] **8.2** Each template has custom branding
- [ ] **8.3** Multiple events run on different subdomains
- [ ] **8.4** Everything is managed from one admin dashboard

🎉 **System is production-ready!**

---

## 📝 Post-Setup Tasks (Optional)

- [ ] **P.1** Back up database configuration
- [ ] **P.2** Document your DNS setup
- [ ] **P.3** Test staging domain before main domain
- [ ] **P.4** Set up analytics (if using)
- [ ] **P.5** Create template for next year's event
- [ ] **P.6** Duplicate successful template for new event
- [ ] **P.7** Set up SSL certificates (if not auto)

---

## 🆘 Troubleshooting During Setup

### Stuck at Phase 1 (Database)?
- [ ] Check Supabase connection
- [ ] Verify SQL syntax
- [ ] Check error messages
- [ ] See `TEMPLATE_SETUP.md` for details

### Stuck at Phase 3 (Configuration)?
- [ ] Refresh browser
- [ ] Verify admin role
- [ ] Check browser console for errors
- [ ] See `QUICK_START_GUIDE.md` for details

### Stuck at Phase 4 (Domain)?
- [ ] Verify template was created
- [ ] Check domain format (no spaces)
- [ ] See if domain is unique
- [ ] See `TEMPLATE_SETUP.md` for details

### Stuck at Phase 5 (DNS)?
- [ ] Wait longer (up to 30 minutes)
- [ ] Contact domain provider support
- [ ] Test with `nslookup` command
- [ ] Verify CNAME record format

### Stuck at Phase 6 (Testing)?
- [ ] Hard refresh browser (Ctrl+Shift+R)
- [ ] Clear browser cache
- [ ] Check console for errors
- [ ] Try incognito/private mode
- [ ] See `QUICK_START_GUIDE.md` troubleshooting

---

## 📚 Reference Materials

| Need Help With | See File |
|---|---|
| Database setup | TEMPLATE_SETUP.md |
| Getting started | QUICK_START_GUIDE.md |
| Full documentation | TEMPLATE_SYSTEM_README.md |
| Component code | src/components/admin/cms/ |
| API reference | src/hooks/useCurrentTemplate.ts |
| Sample data | TEMPLATE_SAMPLE_DATA.sql |

---

## ✨ What You Can Now Do

Once complete, you'll be able to:

✅ Create unlimited event templates
✅ Customize each template independently
✅ Host multiple events on different subdomains
✅ Manage everything from one admin dashboard
✅ Switch events with a simple domain change
✅ Scale to hundreds of events

---

## 🎯 Final Checklist

- [ ] Database tables created
- [ ] First template created
- [ ] Template configured
- [ ] Domain mapped
- [ ] DNS configured (if needed)
- [ ] Live domain tested
- [ ] Customizations verified
- [ ] Second template created (optional)
- [ ] All documentation read
- [ ] Ready to create more events

---

**Estimated Time**: 1-2 hours (including DNS propagation wait)
**Difficulty**: Easy to Medium
**Support**: See documentation files for help

**You're all set! Happy event hosting! 🚀**
