# 🎉 Wedding Website + RSVP System - Complete Setup

## Overview

Your wedding website now has TWO parts working together:

1. **Main Wedding Website** (`/index.html`) - Beautiful static site with all your wedding info
2. **Secure RSVP System** (`/rsvp`) - Next.js app with code-based authentication

## How It Works

```
User visits → http://localhost:3000
              ↓
        Loads: index.html (Your wedding site)
              ↓
        User clicks "Enter Your RSVP Code" button
              ↓
        Redirects to: /rsvp (Next.js RSVP system)
              ↓
        3-Stage Secure Flow:
        1. Code Entry
        2. RSVP Form
        3. Confirmation
```

## 🚀 Quick Start

### 1. Start Development Server

```powershell
npm run dev
```

Server runs at: **http://localhost:3000**

### 2. Test the Complete Flow

#### Step 1: Visit Main Wedding Site
- Open: http://localhost:3000
- You'll see your beautiful wedding website with:
  - Hero section with "JHE & EIFER"
  - Countdown timer
  - Wedding details
  - Gallery section
  - RSVP section with secure code button

#### Step 2: Navigate to RSVP
- Scroll down to the RSVP section
- Click "Enter Your RSVP Code" button
- **OR** navigate directly to: http://localhost:3000/rsvp

#### Step 3: Enter Invitation Code
- Use test code: **TEST1234**
- *(Make sure you've added the test guest to Firestore - see FIREBASE-SETUP-GUIDE.md)*

#### Step 4: Complete RSVP Form
- Select attendance
- Add optional message
- Submit

#### Step 5: See Confirmation
- Success animation
- What's next guidance
- Navigation back to main site

## 📂 File Structure

```
wedding-clone/
├── public/                          # Static wedding website files
│   ├── index.html                   # Main wedding site ✨
│   ├── styles.css                   # Wedding site styles
│   └── script.js                    # Wedding site JavaScript
│
├── app/                             # Next.js RSVP application
│   ├── page.tsx                     # Redirects to index.html
│   ├── layout.tsx                   # Root layout
│   ├── globals.css                  # Global Next.js styles
│   ├── rsvp/
│   │   ├── page.tsx                 # Stage 1: Code entry
│   │   ├── form/page.tsx            # Stage 2: RSVP form
│   │   └── confirmation/page.tsx    # Stage 3: Success
│   └── api/
│       ├── auth/validate/route.ts   # Code validation
│       └── rsvp/submit/route.ts     # RSVP submission
│
├── components/ui/                   # Reusable UI components
├── lib/                             # Utilities and Firebase
├── types/                           # TypeScript types
└── scripts/                         # Helper scripts
```

## 🎨 Customization Guide

### Update Wedding Details

All wedding details are in `public/index.html`:

**Couple Names** (line 20):
```html
<h1 class="couple-names">JHE & EIFER</h1>
```

**Wedding Date** (line 46):
```html
<p>Sunday, December 21st, 2025</p>
```

**Wedding Time** (line 50):
```html
<p>4:00 PM</p>
```

**Venue** (lines 54-56):
```html
<p>The Garden Estate</p>
<p class="venue-address">To be announced</p>
```

**RSVP Deadline** (line 183):
```html
<p class="rsvp-subtitle">Please respond by November 21st, 2025</p>
```

### Update Colors

Edit `public/styles.css` (lines 8-12):
```css
:root {
    --primary-bg: #e8d5c4;      /* Light tan */
    --secondary-bg: #f5e6d3;    /* Cream */
    --accent-brown: #8b7355;    /* Brown accent */
    --dark-text: #2c2c2c;       /* Dark gray */
    --light-text: #6b6b6b;      /* Light gray */
}
```

### Add Your Photos

Replace gallery placeholders in `public/index.html` (lines 167-192):

```html
<!-- Replace this: -->
<div class="gallery-item" style="background: linear-gradient(135deg, #e8d5c4 0%, #d4b5a0 100%);">
    <div class="gallery-placeholder">📸</div>
</div>

<!-- With this: -->
<div class="gallery-item" style="background-image: url('/images/photo1.jpg'); background-size: cover;">
</div>
```

Upload photos to `public/images/` folder.

### Update Contact Email

**In index.html** (line 198):
```html
<a href="mailto:terddy03@gmail.com" class="help-link">Contact us</a>
```

**In RSVP pages** (search for `terddy03@gmail.com` and replace):
- `app/rsvp/form/page.tsx`
- `app/rsvp/confirmation/page.tsx`

## 🔧 Advanced Customization

### Add More Sections to Main Site

Edit `public/index.html` and `public/styles.css`. Structure:

```html
<section class="your-section" id="your-id">
    <div class="container">
        <h2 class="section-title">Your Title</h2>
        <!-- Your content -->
    </div>
</section>
```

Add navigation link in `<nav>` (line 71):
```html
<li><a href="#your-id">Your Section</a></li>
```

### Modify RSVP Flow

**Change session timeout** (1 hour default):
Edit `lib/utils.ts` line 99:
```typescript
const expiresAt = new Date(Date.now() + 3600000); // 3600000 = 1 hour
```

**Add custom fields to RSVP form**:
Edit `app/rsvp/form/page.tsx` and add form fields.

**Customize confirmation page**:
Edit `app/rsvp/confirmation/page.tsx`.

## 🌐 Deployment

### Deploy to Vercel

```powershell
# Install Vercel CLI (if not installed)
npm install -g vercel

# Login
vercel login

# Deploy
vercel
```

### Important: Environment Variables

Add ALL environment variables from `.env.local` to Vercel:

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add each variable:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - etc. (see `.env.local` for full list)

### Vercel Configuration

Your `vercel.json` is automatically configured by Next.js. The setup will:
- ✅ Serve `index.html` at the root (`/`)
- ✅ Serve RSVP app at `/rsvp`
- ✅ Serve API routes at `/api/*`
- ✅ Serve static assets from `/public`

## 📱 Responsive Design

Your wedding website is fully responsive:

- **Desktop** (1200px+): Full layout with side-by-side cards
- **Tablet** (768px-1199px): Adjusted grid layouts
- **Mobile** (< 768px): Single column, optimized for touch

Test on different devices or use browser DevTools.

## ✅ Testing Checklist

### Main Website Testing

- [ ] Homepage loads at http://localhost:3000
- [ ] Countdown timer displays correct time to December 21, 2025
- [ ] Navigation menu appears on scroll
- [ ] All navigation links work (smooth scroll)
- [ ] Modal invitation opens and closes
- [ ] Wedding details are accurate
- [ ] RSVP button is visible and styled correctly
- [ ] RSVP button links to `/rsvp`
- [ ] Footer displays correct names and date

### RSVP System Testing

- [ ] `/rsvp` loads code entry page
- [ ] Test code **TEST1234** validates successfully
- [ ] Session stores correctly
- [ ] Redirects to `/rsvp/form` after validation
- [ ] Form shows personalized greeting
- [ ] Both attendance options work
- [ ] Message textarea accepts input
- [ ] Submit button shows loading state
- [ ] Redirects to `/rsvp/confirmation` after submit
- [ ] Confirmation page shows success animation
- [ ] Firestore updates with RSVP data
- [ ] Code marked as `used: true`
- [ ] Cannot reuse code

### Mobile Testing

- [ ] Responsive layout works on mobile
- [ ] Touch interactions work (buttons, links)
- [ ] Text is readable (not too small)
- [ ] No horizontal scrolling
- [ ] Navigation menu works on mobile

## 🎨 Design Customization Ideas

### 1. Add Custom Fonts

Add to `public/index.html` `<head>`:
```html
<link href="https://fonts.googleapis.com/css2?family=YourFont&display=swap" rel="stylesheet">
```

Update CSS:
```css
body {
    font-family: 'YourFont', sans-serif;
}
```

### 2. Add Animations

Use the existing animation classes in `styles.css`:
- `fadeInUp` - Fade and slide up
- `fadeIn` - Simple fade in
- `slideIn` - Slide from top
- `heartbeat` - Pulsing animation

### 3. Add Video Background

In hero section:
```html
<section class="hero" id="home">
    <video autoplay muted loop class="hero-video">
        <source src="/video/wedding-video.mp4" type="video/mp4">
    </video>
    <!-- existing content -->
</section>
```

CSS:
```css
.hero-video {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.3;
}
```

## 🐛 Troubleshooting

### Issue: Main site doesn't load

**Check:**
- Files in `public/` directory?
- Dev server running? (`npm run dev`)
- Port 3000 available?

### Issue: RSVP button doesn't work

**Check:**
- Link in HTML: `href="/rsvp"`
- RSVP page exists: `app/rsvp/page.tsx`
- No JavaScript errors in console

### Issue: Countdown shows wrong date

**Fix:** Edit `public/script.js` line 61:
```javascript
const weddingDate = new Date('2025-12-21T16:00:00').getTime();
```

### Issue: Styles not loading

**Check:**
- `styles.css` in `public/` folder
- Link in HTML: `<link rel="stylesheet" href="styles.css">`
- No CSS errors in DevTools

### Issue: RSVP code doesn't validate

**Check:**
- Guest added to Firestore? (See FIREBASE-SETUP-GUIDE.md)
- Code hash correct?
- Firebase credentials in `.env.local`?
- Check browser console and terminal for errors

## 📞 Support Resources

- **Main Setup**: README-RSVP-SYSTEM.md
- **Firebase Setup**: FIREBASE-SETUP-GUIDE.md
- **Testing Guide**: TESTING-GUIDE.md
- **Complete Implementation**: RSVP.md

## 🎊 You're All Set!

Your wedding website is now complete with:
- ✅ Beautiful, customizable main website
- ✅ Secure, code-based RSVP system
- ✅ Mobile-responsive design
- ✅ Countdown timer
- ✅ Gallery section
- ✅ Wedding details
- ✅ Easy deployment to Vercel

**Next Steps:**
1. Customize wedding details
2. Add your photos
3. Add guests to Firestore
4. Test the complete flow
5. Deploy to Vercel
6. Share with your guests!

**Congratulations on your upcoming wedding! 💒💍**

---

**Built with ❤️ for Jhe & Eifer - December 21, 2025**
