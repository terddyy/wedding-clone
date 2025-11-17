# Admin System - Visual Guide

## 🎯 Quick Start (5 Minutes)

```
┌─────────────────────────────────────────────────┐
│  Your Wedding Website                           │
│  ├─ Home (index.html)                          │
│  ├─ Details                                     │
│  ├─ Gallery                                     │
│  ├─ RSVP → /rsvp (guest-facing)              │
│  └─ Admin → /admin (YOUR access)              │
└─────────────────────────────────────────────────┘
```

---

## 📍 Access Admin Panel

```
URL: http://localhost:3000/admin
     https://yourwebsite.com/admin (after deployment)

Password: admin123
```

---

## 🎛️ Admin Dashboard Layout

```
┌─────────────────────────────────────────────────────┐
│                   ADMIN DASHBOARD                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [Logout Button] (top right)                       │
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │ Tab 1: View Guests & RSVPs  Tab 2: Generate  │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  ┌─ Stats ──────────────────────────────────────┐  │
│  │ Total: 150  ✓Attending: 120  ✗Declining: 20 │  │
│  │                              ⏳Pending: 10   │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  ┌─ Search & Filter ─────────────────────────────┐ │
│  │ Search: [Search by name...]  Filter: [▼All]  │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  ┌─ Guest List ──────────────────────────────────┐ │
│  │ Name      │ Status      │ Message  │ Submitted│ │
│  ├───────────┼─────────────┼──────────┼──────────┤ │
│  │ Alice J.  │ ✓ Attending │ —        │ Nov 10   │ │
│  │ Bob S.    │ ✗ Declining │ —        │ Nov 8    │ │
│  │ Carol W.  │ ⏳ Pending   │ —        │ —        │ │
│  └───────────────────────────────────────────────┘ │
│                                      [Export CSV]  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 📝 Tab 1: View Guests & RSVPs

### What You See:
1. **Statistics Dashboard** (4 cards at top)
   - Total Guests: 150
   - Attending: 120 ✓
   - Declining: 20 ✗
   - Pending: 10 ⏳

2. **Search & Filter**
   - Search by guest name
   - Filter by status (All, Attending, Declining, Pending)

3. **Guest Table** with columns:
   - Name
   - RSVP Status (color-coded)
   - Message (dietary, notes, etc.)
   - Submission Date
   - Code Used (Yes/No)

4. **Export Button**
   - Download as CSV for seating, catering, etc.

### Example Table:

```
┌──────────────────┬──────────────┬─────────────────┬─────────────┐
│ Name             │ Status       │ Message         │ Submitted   │
├──────────────────┼──────────────┼─────────────────┼─────────────┤
│ John Smith       │ ✓ Attending  │ Vegetarian      │ Nov 15      │
│ Jane Doe         │ ✓ Attending  │ —               │ Nov 14      │
│ Michael Johnson  │ ✗ Declining  │ Conflict        │ Nov 10      │
│ Sarah Williams   │ ⏳ Pending    │ —               │ —           │
└──────────────────┴──────────────┴─────────────────┴─────────────┘
```

---

## 🔑 Tab 2: Generate Codes

```
┌──────────────────────────────────────────────────────┐
│           GENERATE INVITATION CODES                 │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Guest Names (one per line):                        │
│  ┌──────────────────────────────────────────────┐  │
│  │ John Smith                                   │  │
│  │ Jane Doe                                     │  │
│  │ Michael Johnson                              │  │
│  │ Sarah Williams                               │  │
│  │                                              │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │         [Generate Codes]                      │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
└──────────────────────────────────────────────────────┘

                         ↓ After Click ↓

┌──────────────────────────────────────────────────────┐
│         GENERATED CODES (4 Total)                    │
│                       [Download CSV]                │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌─────────────────────────────────────────────┐   │
│  │ John Smith                                  │   │
│  │ Code: JOHN5B2K                  [Copy ✓]   │   │
│  └─────────────────────────────────────────────┘   │
│                                                      │
│  ┌─────────────────────────────────────────────┐   │
│  │ Jane Doe                                    │   │
│  │ Code: JANE9L4M                  [Copy]      │   │
│  └─────────────────────────────────────────────┘   │
│                                                      │
│  ┌─────────────────────────────────────────────┐   │
│  │ Michael Johnson                             │   │
│  │ Code: MICH7Z8N                  [Copy]      │   │
│  └─────────────────────────────────────────────┘   │
│                                                      │
│  ┌─────────────────────────────────────────────┐   │
│  │ Sarah Williams                              │   │
│  │ Code: SARA3K2O                  [Copy]      │   │
│  └─────────────────────────────────────────────┘   │
│                                                      │
│  ✓ Codes generated successfully!                    │
│  These codes are now in your database.              │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## 👥 Guest Journey

```
┌─────────────────────────────────────────────────┐
│              GUEST EXPERIENCE                   │
└─────────────────────────────────────────────────┘

1. YOU (Admin)
   ↓
   Generate Code: "JOHN5B2K"
   ↓
   Send to Guest via Email

2. GUEST Receives Email
   ↓
   "Your RSVP Code: JOHN5B2K"
   ↓
   Clicks: http://yoursite.com/rsvp

3. RSVP Page - Stage 1
   ┌────────────────────────────┐
   │     Enter Your Code        │
   │  [JOHN5B2K      ↲]         │
   │  [Continue to RSVP]        │
   └────────────────────────────┘
   ↓

4. RSVP Page - Stage 2
   ┌────────────────────────────┐
   │  Welcome, John Smith!      │
   │                            │
   │  Will you attend?          │
   │  ○ Joyfully accepts 🎉     │ (selected)
   │  ○ Regretfully declines 💙 │
   │                            │
   │  Message (optional):       │
   │  [Vegetarian menu please]  │
   │                            │
   │  [Submit RSVP]             │
   └────────────────────────────┘
   ↓

5. RSVP Page - Stage 3
   ┌────────────────────────────┐
   │      Thank You!            │
   │  Your RSVP has been sent   │
   └────────────────────────────┘
   ↓

6. YOU (Admin) - INSTANTLY SEE:
   ✓ John Smith
   ✓ Status: Attending
   ✓ Message: Vegetarian menu please
   ✓ Code Used: Yes
   ✓ Submitted: Nov 15, 2025
```

---

## 📊 Statistics Timeline

```
Before Invites:
┌─────────────┐
│ Total: 0    │
│ Attend: 0   │
│ Decline: 0  │
│ Pending: 0  │
└─────────────┘

After Sending Codes (Day 1):
┌─────────────┐
│ Total: 150  │
│ Attend: 0   │
│ Decline: 0  │
│ Pending: 150│
└─────────────┘

Week 1:
┌─────────────┐
│ Total: 150  │
│ Attend: 45  │
│ Decline: 5  │
│ Pending: 100│
└─────────────┘

Week 3:
┌─────────────┐
│ Total: 150  │
│ Attend: 110 │
│ Decline: 20 │
│ Pending: 20 │
└─────────────┘

Final (Day Before):
┌─────────────┐
│ Total: 150  │
│ Attend: 120 │
│ Decline: 25 │
│ Pending: 5  │
└─────────────┘
```

---

## 🔄 Complete Workflow

```
┌──────────────────────────────────────────────────────┐
│ TIMELINE: Create Invites to Final Count             │
└──────────────────────────────────────────────────────┘

MONTH 1: SETUP
├─ Create admin panel ✓ (Done!)
├─ Test with demo guests
└─ Prepare guest list

MONTH 1-2: GENERATE & SEND
├─ Log in to admin
├─ Generate codes for all guests
├─ Download CSV
└─ Send codes via email/text
   └─ Email Template:
      "Your RSVP Code: JOHN5B2K
       Visit: yoursite.com/rsvp"

MONTH 2-3: MONITOR
├─ Check admin dashboard daily
├─ View statistics
├─ Follow up with pending guests
├─ Note dietary restrictions
└─ Update catering counts

WEEK BEFORE: FINALIZE
├─ Export final guest list
├─ Use for:
│  ├─ Seating arrangements
│  ├─ Catering headcount
│  ├─ Place card printing
│  └─ Final confirmation
└─ Total confirmed: 120 guests

DAY OF: REFERENCE
├─ Use guest list as reference
├─ Check-in guests
└─ Have backup codes for walk-ins

POST-WEDDING: THANK YOU
├─ Use guest data for thank-yous
├─ Reference dietary notes
└─ Archivefor records
```

---

## 🎁 What CSV Export Includes

**When you export, you get a spreadsheet with:**

```
Guest Name | RSVP Status | Message | Submitted | Code Used
──────────────────────────────────────────────────────────
John Smith | attending   | Veg     | Nov 15    | Yes
Jane Doe   | attending   | —       | Nov 14    | Yes
Michael J  | decl...     | Conf... | Nov 10    | Yes
Sarah W    | pending     | —       | —         | No
```

**Use CSV for:**
- Seating charts
- Catering count
- Place card printing
- Thank you card list
- Guest database

---

## ✅ You're Ready!

### Access Points:

```
👤 Guests visit:      http://localhost:3000/rsvp
👨‍💼 You (admin) visit: http://localhost:3000/admin
```

### Your Immediate Next Steps:

1. ✅ Start dev server: `npm run dev`
2. ✅ Visit: `http://localhost:3000/admin`
3. ✅ Enter password: `admin123`
4. ✅ Click "Generate Codes" tab
5. ✅ Enter a test guest name
6. ✅ Generate code
7. ✅ Copy code
8. ✅ Go to `/rsvp` and test the flow

**Everything is set up and ready!** 🎉
