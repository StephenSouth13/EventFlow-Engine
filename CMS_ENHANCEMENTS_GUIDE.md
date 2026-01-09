# CMS Enhancements Complete Guide

## 🎉 What's New

Your CMS admin interface has been significantly enhanced with **6 major new features**:

1. **Social Media Links Manager** - Manage footer social links
2. **Logo & Footer Manager** - Edit header/footer logos and copyright text
3. **Page Content Manager** - Manage 8 pages with section visibility
4. **Homepage Theme System** - Choose from 10 customizable themes
5. **User Management** - View and manage user roles
6. **Contact Submissions Manager** - View and manage form submissions

---

## 📊 New Admin Tabs

In `/admin/cms` you'll see **6 new tabs**:

### 1. **Social Links** 📱
**Path**: Admin → CMS Dashboard → Social Links tab

**Features**:
- Add/edit/delete social media links
- Show/hide individual links
- Reorder links
- Supported platforms: Twitter, LinkedIn, Instagram, YouTube, Facebook, TikTok, GitHub, Discord

**Usage**:
1. Click "Add Social Link"
2. Select platform (auto-selects icon)
3. Enter URL
4. Click "Add"
5. Use eye icon to show/hide links
6. Use delete icon to remove

**Example**:
```
Platform: Twitter
URL: https://twitter.com/sisf2026
Status: Visible ✓
```

---

### 2. **Logo & Footer** 🏢
**Path**: Admin → CMS Dashboard → Logo & Footer tab

**Features**:
- Edit header logo
- Edit footer logo
- Edit footer copyright text
- Edit footer event info

**Usage**:
1. Upload or paste logo URLs
2. Edit footer copyright text (e.g., "© 2026 SISF. All rights reserved.")
3. Edit footer event info (e.g., "April 15-17, 2026 • Innovation Hub")
4. Click "Save Branding Settings"

**Example**:
```
Header Logo: https://example.com/logo-header.png
Footer Logo: https://example.com/logo-footer.png
Copyright: © 2026 Startup & Innovation Spring Festival. All rights reserved.
Event Info: April 15-17, 2026 • Innovation Hub, Singapore
```

---

### 3. **Page Content (8 Pages)** 📄
**Path**: Admin → CMS Dashboard → Trang (8 Pages) tab

**Manages These Pages**:
- Trang chủ (Homepage)
- Giới thiệu (About)
- Lịch trình (Schedule)
- Diễn giả (Speakers)
- Startups
- Địa điểm (Venue)
- FAQ
- Liên hệ (Contact)

**Per-Page Features**:
- Page title
- Page description
- Visibility toggle (show/hide page)
- Section enable/disable
- Custom content (HTML/text)

**Usage**:
1. Select page from buttons
2. Edit page title and description
3. Toggle page visibility
4. Check/uncheck sections to enable/disable
5. Add custom content if needed
6. Click "Save Page Configuration"

**Example**:
```
Page: Giới thiệu (About)
Title: About SISF 2026
Description: Learn more about our event
Visible: ✓
Sections: About Content ✓, Team ✓, Mission ✓
```

---

### 4. **Themes (10 Presets)** 🎨
**Path**: Admin → CMS Dashboard → Themes (10 Presets) tab

**10 Built-in Themes**:
1. Ocean Blue - Cool professional theme
2. Sunset Gold - Warm energetic theme
3. Purple Haze - Creative modern theme
4. Tech Dark - Minimalist dark theme
5. Green Energy - Eco-friendly theme
6. Pink Blossom - Elegant soft theme
7. Neon Cyberpunk - Bold neon theme
8. Forest Deep - Earthy natural theme
9. Coral Reef - Tropical vibrant theme
10. Midnight Indigo - Deep night theme

**Features**:
- Preview color palette
- Activate theme with one click
- Customize colors per theme
- Live color picker

**Usage**:
1. Browse themes
2. Click "Activate" to use
3. Click "Customize" to adjust colors
4. Edit primary, secondary, accent colors
5. See live preview
6. Click "Save Customization"

**Example**:
```
Currently Active: Midnight Indigo
Primary Color: #4f46e5 (Deep blue)
Secondary Color: #6366f1 (Lighter blue)
Accent Color: #818cf8 (Bright blue)
```

---

### 5. **User Management** 👥
**Path**: Admin → CMS Dashboard → Users tab

**Features**:
- View all registered users
- See email and join date
- View last login date
- Search by email
- Filter by role
- Add/remove user roles

**Available Roles**:
- attendee (Participant)
- startup (Startup company)
- investor (Investor)
- speaker (Speaker)
- sponsor (Sponsor)
- admin (Administrator)

**Usage**:
1. Search by email (optional)
2. Filter by role (optional)
3. Click "Add Role" on user
4. Select role from dropdown
5. Click "Add"
6. Click ✕ to remove role

**Example**:
```
User: john@example.com
Joined: Jan 1, 2026
Last Login: Today
Roles: [Startup] [Speaker]
Add: [Investor]
```

---

### 6. **Contact Submissions** 📧
**Path**: Admin → CMS Dashboard → Liên hệ (Contact) tab

**Features**:
- View all form submissions
- Stats: New, Read, Replied counts
- Search and filter submissions
- Mark as read/replied
- Add internal notes
- Delete submissions
- Contact via email/phone

**Status Types**:
- **New** (Red) - Unread submissions
- **Read** (Blue) - Viewed but not answered
- **Replied** (Green) - Answered

**Usage**:
1. View submission stats at top
2. Filter by status
3. Click submission to view details
4. Add notes (internal use only)
5. Click "Mark as Replied" when done
6. Click email/phone to contact
7. Delete if spam

**Example**:
```
From: Jane Smith
Email: jane@company.com
Subject: Partnership Inquiry
Status: New (unread)
Message: [Full message shown]
Notes: [Internal notes here]
Actions: Mark as Replied, Save Notes, Delete
```

---

## 🗄️ Database Setup Required

Before using these features, you must create the database tables.

### Step 1: Copy SQL
Copy all SQL from `CMS_ENHANCEMENTS_DATABASE.sql`

### Step 2: Run in Supabase
1. Go to Supabase dashboard
2. Click SQL Editor
3. Paste the SQL
4. Click "Run"

### Step 3: Verify
Tables should be created:
- social_links
- branding_settings
- page_configs
- homepage_themes
- contact_submissions

---

## 💡 Usage Scenarios

### Scenario 1: Add Social Media Links
```
Goal: Add Twitter and LinkedIn to footer

Steps:
1. Admin → CMS → Social Links
2. Click "Add Social Link"
3. Select "Twitter", paste URL
4. Click "Add"
5. Repeat for LinkedIn
6. All links show in footer ✓
```

### Scenario 2: Change Homepage Theme
```
Goal: Switch to Purple Haze theme

Steps:
1. Admin → CMS → Themes (10 Presets)
2. Find "Purple Haze"
3. Click "Activate"
4. (Optional) Click "Customize" to adjust colors
5. Save
6. Homepage now uses purple colors ✓
```

### Scenario 3: Hide About Page
```
Goal: Temporarily hide About page

Steps:
1. Admin → CMS → Trang (8 Pages)
2. Click "Giới thiệu" (About) button
3. Uncheck "Page Visible"
4. Click "Save Page Configuration"
5. Page is now hidden from website ✓
```

### Scenario 4: Review Customer Inquiry
```
Goal: Review and respond to contact form

Steps:
1. Admin → CMS → Liên hệ (Contact)
2. See "New" count (unread)
3. Click submission to read
4. Add notes about follow-up
5. Click "Mark as Replied"
6. Click email to send response ✓
```

### Scenario 5: Change Footer Copyright
```
Goal: Update copyright year

Steps:
1. Admin → CMS → Logo & Footer
2. Update "Copyright Text" field
3. Change "2026" to "2027"
4. Click "Save Branding Settings"
5. Footer copyright updated ✓
```

---

## 🎯 Best Practices

### Social Links
- Keep links in order (Twitter, LinkedIn, Instagram, etc.)
- Use eye icon to hide links instead of deleting
- Keep URLs up-to-date

### Themes
- Test theme on mobile before activating
- Use light text on dark themes
- Ensure accent color is different from primary

### Pages
- Don't hide all sections (keep at least hero)
- Use custom content sparingly
- Test pages after changes

### Users
- Only give admin role to trusted staff
- Review user roles regularly
- Remove inactive users

### Contacts
- Respond to new inquiries within 24 hours
- Add notes for team collaboration
- Archive old submissions if needed

---

## 🔒 Security

All features are protected by:
- Admin role verification
- Row-level security (RLS)
- Database-level permissions
- No public write access

Only admins can:
- Edit social links
- Change branding
- Manage pages
- Activate themes
- Manage users
- View contact submissions

---

## 🚀 Tips & Tricks

### Bulk Update Social Links
1. Go to Social Links
2. Edit multiple links quickly
3. Use show/hide instead of deleting

### Test Themes Before Activating
1. Go to Themes
2. Click "Customize"
3. See color preview
4. Save customization
5. Then activate

### Track Contact Inquiries
1. Set a workflow: New → Read → Replied
2. Add notes for each step
3. Archive when complete

### Manage Sections Easily
1. Open Page Content
2. Quick toggle sections per page
3. Hide entire sections without deletion
4. Re-enable anytime

---

## 📱 Mobile Admin Access

All CMS features work on mobile:
- Social links manager
- Logo & footer editor
- Page content manager
- Theme selector
- User management
- Contact viewer

---

## ❓ FAQ

**Q: Can I add unlimited social links?**
A: Yes, add as many as needed

**Q: Can I create custom themes?**
A: Currently 10 presets. Customize colors as needed.

**Q: What if I delete a user role?**
A: Just click ✕ next to role. User can be re-added anytime.

**Q: Can visitors submit contact forms?**
A: Yes, forms are public. Admin receives submissions.

**Q: Can I export contact submissions?**
A: Not yet. Use notes feature to track follow-ups.

**Q: Can I restore deleted social links?**
A: Use show/hide instead of deleting. Deleted links can't be restored.

---

## 🎊 Summary

You now have a **complete professional CMS** with:

✅ Social media management
✅ Branding control
✅ Multi-page content management
✅ Theme customization
✅ User role management
✅ Contact form handling

All managed from **one admin dashboard** with **professional UI**.

---

**Start managing your site content today! 🚀**

Next: [Run the database setup SQL](#database-setup-required)
