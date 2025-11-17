# Admin Panel - Complete System Summary

## What You Now Have ✅

### 1. **Admin Login Panel** (`/admin`)
- Password-protected access to admin dashboard
- Clean, elegant interface matching your wedding design
- Session management via localStorage

### 2. **Generate Invitation Codes**
- Enter guest names → Generate unique 8-character codes
- All codes securely hashed with bcrypt
- Copy individual codes or download as CSV
- Codes automatically added to Firestore database

### 3. **View & Monitor RSVPs**
- Real-time dashboard showing:
  - Total guests invited
  - Confirmed attendees count
  - Declined guests count
  - Pending responses count
- Search guests by name
- Filter by RSVP status
- View messages (dietary restrictions, notes)
- See submission dates
- Export data as CSV for planning

### 4. **API Endpoints**
- `POST /api/admin/auth` - Login authentication
- `POST /api/admin/generate-codes` - Create new codes
- `GET /api/admin/guests` - Fetch all guest data

---

## How It Works (Simplified)

### Step 1: Generate Codes
```
You: Enter guest names
↓
System: Creates unique 8-char codes (e.g., "JOHN5B2K")
↓
System: Hashes code with bcrypt for security
↓
System: Stores guest + code hash in Firestore
↓
You: Download CSV or copy codes individually
```

### Step 2: Guest RSVPs
```
You: Send code to guest (e.g., "JOHN5B2K")
↓
Guest: Visits http://localhost:3000/rsvp
↓
Guest: Enters code to authenticate
↓
Guest: Selects attendance (Yes/No) and adds message
↓
System: Marks code as "used" in database
↓
You: See RSVP status updated in admin panel
```

---

## Admin Workflow

### Timeline: 3 Months Before Wedding

**Month 1**: Generate & Distribute
```
admin.html → Generate Codes tab
→ Paste all guest names
→ Generate & Download CSV
→ Send codes to guests via email
```

**Month 2**: Monitor Progress
```
admin.html → View RSVPs tab
→ Check statistics
→ Follow up with pending guests
→ Review dietary restrictions in messages
```

**Week Before**: Final Planning
```
admin.html → Export CSV
→ Use data for:
   - Seating arrangements
   - Final headcount
   - Catering preparation
   - Place card printing
```

---

## File Structure

```
/app
  /admin
    page.tsx                    ← Admin dashboard page
  /api/admin
    /auth/route.ts            ← Login endpoint
    /guests/route.ts          ← Get all guests
    /generate-codes/route.ts  ← Generate codes endpoint

/components/admin
  AdminAuth.tsx               ← Login form
  AdminDashboard.tsx          ← Main dashboard
  GuestList.tsx               ← RSVP table & stats
  GenerateCode.tsx            ← Code generator form
```

---

## Key Features Explained

### 🔐 Security
- All invitation codes are hashed with bcrypt (10 salt rounds)
- Admin password validation on every request
- localStorage token management
- Codes marked as "used" after RSVP to prevent re-use

### 📊 Statistics
- Real-time counts of RSVP status
- Visual breakdown: Attending | Declining | Pending
- Color-coded status badges
- Search and filter capabilities

### 📥 Export Features
- Download guest list as CSV
- Download RSVP data as CSV
- Includes all guest information
- Ready for Excel/Google Sheets

### 📱 Responsive Design
- Works on desktop, tablet, mobile
- Elegant brown & cream color scheme (matches wedding site)
- Framer Motion animations
- Professional layout

---

## Using the Admin Panel

### Access
```
Development: http://localhost:3000/admin
Production: https://yourwebsite.com/admin
Password: admin123 (change before going live!)
```

### Tab 1: View Guests & RSVPs
- See all guests and their status
- Statistics dashboard at top
- Search and filter options
- Export as CSV button
- Color-coded statuses:
  - 🟢 Attending
  - 🔴 Declining
  - 🟡 Pending

### Tab 2: Generate Codes
- Paste guest names (one per line)
- Click "Generate Codes"
- Review generated codes
- Copy individual codes or download CSV
- Codes immediately stored in Firestore

---

## Database Structure

### Guests Collection
```javascript
{
  id: "auto-generated",
  name: "John Smith",
  code_hash: "$2b$10$...", // bcrypt hash
  rsvp_status: "pending", // or "attending" | "not_attending"
  message: "No shellfish please",
  used: false, // becomes true after RSVP
  created_at: timestamp,
  submitted_at: timestamp (if RSVPd)
}
```

---

## One-Time Setup

### Change Admin Password (Production Only)
1. Update `.env.local`:
   ```
   ADMIN_PASSWORD_HASH=your_new_secure_password
   ```
2. Redeploy to Vercel
3. Login with new password

---

## Example Usage

### Generate Codes for 3 Guests

**Input**:
```
Alice Johnson
Bob Smith
Carol Williams
```

**Output**:
```
Alice Johnson → CODE: ALICE9K2L
Bob Smith → CODE: BOB4M7Z9
Carol Williams → CODE: CAROL5R1W
```

**Distribution**:
- Email Alice: "Your code: ALICE9K2L"
- Email Bob: "Your code: BOB4M7Z9"
- Email Carol: "Your code: CAROL5R1W"

**Guests RSVP**:
- Alice enters ALICE9K2L → "Yes, attending"
- Bob enters BOB4M7Z9 → "No, can't make it"
- Carol enters CAROL5R1W → "Yes, attending + gluten-free"

**Final Status**:
```
Total: 3
Attending: 2 ✓
Declining: 1 ✗
Pending: 0
```

---

## Troubleshooting

### Can't log in
- Password: `admin123` (default)
- Check `.env.local` for custom password
- Clear browser cache/localStorage

### No guests appearing
- Firestore must be initialized
- Check Firebase connection in `.env.local`
- Ensure guests collection exists

### Codes not generating
- Check Firebase permissions
- Ensure Firestore has write access
- Check for error messages in console

### Export not working
- Try refreshing the page
- Check browser console for errors
- Clear browser cache

---

## Next Steps

1. ✅ **Start dev server**: `npm run dev`
2. ✅ **Log in**: Visit `http://localhost:3000/admin`
3. ✅ **Try generating codes**: Add test guests
4. ✅ **View guest list**: See all guests and stats
5. ✅ **Test RSVP**: Use generated code on `/rsvp` page
6. ✅ **Export data**: Download CSV files

---

## Security Checklist

- [ ] Change admin password in production
- [ ] Use HTTPS (automatic on Vercel)
- [ ] Firestore security rules configured
- [ ] Environment variables secure
- [ ] No passwords in version control
- [ ] Rate limiting considered for API

---

## Support & Documentation

**Full Admin Guide**: See `ADMIN-GUIDE.md`
**Quick Reference**: See `ADMIN-QUICK-START.md`
**RSVP System**: See `README-RSVP-SYSTEM.md`

**You're all set!** 🎉 The admin system is ready to use.
