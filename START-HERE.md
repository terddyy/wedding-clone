# 🎉 Jhe & Eifer's Wedding Website - Quick Start

## ✨ Your Website is Ready!

You now have a complete wedding website with:
- 🏠 Beautiful main wedding site
- 🔐 Secure RSVP system with invitation codes
- 📱 Fully mobile responsive
- ⏱️ Live countdown to December 21, 2025

## 🚀 Start Your Website

```powershell
npm run dev
```

Visit: **http://localhost:3000**

## 📋 Quick Test (5 minutes)

### 1. View Wedding Site
- Open http://localhost:3000
- See your wedding details
- Scroll through sections

### 2. Test RSVP System
- Click "Enter Your RSVP Code" button
- Enter code: `TEST1234`
- Fill out RSVP form
- See success confirmation

**⚠️ Before testing RSVP:** Add test guest to Firestore (see below)

## 🔥 Add Test Guest to Firebase

**Quick Method:**

1. Go to: https://console.firebase.google.com/project/wedding-rsvp-32d66/firestore
2. Create collection: `guests`
3. Add document with these fields:
   - `name`: "Test User" (string)
   - `email`: "test@example.com" (string)
   - `code_hash`: "$2b$10$kVv8FJ.OqHHdjo4bzU9eQ.w7jVcq0h5e8ptd6GcBfmecA/dI5Q2i." (string)
   - `used`: false (boolean)
   - `rsvp_status`: "pending" (string)
   - `message`: "" (string)
   - `created_at`: Click "Current timestamp"

**Test Code:** TEST1234

## 📖 Full Documentation

- **INTEGRATION-GUIDE.md** - Complete customization guide
- **FIREBASE-SETUP-GUIDE.md** - Detailed Firebase setup
- **TESTING-GUIDE.md** - Full testing instructions
- **README-RSVP-SYSTEM.md** - Technical documentation

## 🎨 Quick Customizations

### Change Wedding Date
Edit `public/script.js` line 61:
```javascript
const weddingDate = new Date('2025-12-21T16:00:00').getTime();
```

### Change Couple Names
Edit `public/index.html` line 20:
```html
<h1 class="couple-names">JHE & EIFER</h1>
```

### Change Venue
Edit `public/index.html` lines 54-56

### Add Photos
Place photos in `public/images/` and update gallery section

## 🌐 Deploy to Production

```powershell
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Then add environment variables from `.env.local` to Vercel dashboard.

## ❓ Need Help?

- Check INTEGRATION-GUIDE.md for detailed instructions
- Review TROUBLESHOOTING section in guides
- Email: terddy03@gmail.com

## 🎊 That's It!

Your wedding website is production-ready. Just:
1. ✅ Test locally
2. ✅ Add real guests to Firestore
3. ✅ Deploy to Vercel
4. ✅ Share with guests!

**Happy Wedding Planning! 💒**

---

**Wedding Date:** December 21, 2025
**Couple:** Jhe & Eifer
