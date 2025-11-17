# Wedding Invitation Website - Jake & Micaela

A beautiful, responsive wedding invitation website with elegant design and modern features.

## Features

- 💒 **Elegant Design**: Matches the original Figma design with soft beige tones and serif typography
- 📱 **Fully Responsive**: Perfect viewing experience on all devices
- ⏱️ **Live Countdown**: Real-time countdown to the wedding day
- 📝 **RSVP Form**: Built-in RSVP form with form validation
- 🖼️ **Photo Gallery**: Showcase your journey together
- ✨ **Smooth Animations**: Delightful scroll animations and transitions
- 🎯 **Modal Invitation**: Interactive invitation modal with wedding details

## Customization

### Update Wedding Details

Edit `index.html` to customize:

1. **Couple Names** (line 26): Change "JAKE & MICAELA"
2. **Wedding Date** (line 48): Update "Saturday, June 14th, 2026"
3. **Venue Information** (lines 52-55): Add your venue details
4. **Story Section** (lines 129-159): Add your personal love story
5. **Wedding Details** (lines 168-203): Update location, schedule, dress code, hotels

### Update Countdown Timer

Edit `script.js` line 33:
```javascript
const weddingDate = new Date('2026-06-14T16:00:00').getTime();
```

### Add Photos to Gallery

Replace the placeholder gallery items in `index.html` (lines 211-242) with your actual images:
```html
<div class="gallery-item" style="background-image: url('path-to-your-image.jpg'); background-size: cover; background-position: center;">
</div>
```

### Customize Colors

Edit `styles.css` root variables (lines 9-16):
```css
:root {
    --primary-bg: #e8d5c4;      /* Main background */
    --secondary-bg: #f5e6d3;    /* Secondary background */
    --accent-brown: #8b7355;    /* Buttons and accents */
    --dark-text: #2c2c2c;       /* Main text */
    --light-text: #6b6b6b;      /* Secondary text */
}
```

## Setup RSVP Form (Optional)

The RSVP form currently logs data to console. To collect real responses:

### Option 1: Formspree (Easy)
1. Sign up at [formspree.io](https://formspree.io)
2. Create a new form
3. Uncomment lines 85-89 in `script.js` and add your form ID

### Option 2: EmailJS
1. Sign up at [emailjs.com](https://www.emailjs.com)
2. Follow their integration guide
3. Add the EmailJS SDK and configure in `script.js`

### Option 3: Google Sheets
1. Use Google Apps Script to create a webhook
2. Send form data to your Google Sheet
3. Update the fetch call in `script.js`

## Local Development

Open `index.html` in your browser, or run a local server:

```bash
# Python 3
python -m http.server 8000

# Node.js (with npx)
npx serve .
```

Then visit `http://localhost:8000`

## Deploy to Vercel

### Method 1: Using Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
cd wedding-clone
vercel
```

### Method 2: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your Git repository (or drag & drop the folder)
4. Click "Deploy"

Your site will be live at `your-project-name.vercel.app`

## Custom Domain

1. Go to your project in Vercel Dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Update DNS records as instructed

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Technologies Used

- HTML5
- CSS3 (Flexbox, Grid, Animations)
- Vanilla JavaScript (ES6+)
- Google Fonts (Cormorant Garamond, Montserrat)

## Credits

Design inspired by elegant wedding aesthetics with modern web technologies.

## License

MIT License - Feel free to use and customize for your special day!
