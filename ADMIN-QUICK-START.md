# Quick Admin Reference

## 🔓 Admin Login
- **URL**: http://localhost:3000/admin
- **Password**: `admin123`

---

## 📋 Two Main Features

### 1️⃣ Generate Codes (Left Tab)
**What**: Create unique invitation codes for guests

**How**:
1. Paste guest names (one per line)
2. Click "Generate Codes"
3. Copy codes or download CSV
4. Send codes to guests

**Example Input**:
```
John Smith
Jane Doe
Michael Johnson
```

---

### 2️⃣ View RSVPs (Right Tab - Default)
**What**: See who's attending and their responses

**Shows**:
- 📊 Stats: Total | Attending | Declining | Pending
- 🔍 Search: Find guests by name
- 📋 Table: Status, Message, Submission date
- 📥 Export: Download as CSV for seating plans

---

## 🚀 Typical Workflow

### Before Wedding (2-3 months out)
```
1. Go to "Generate Codes" tab
2. Paste all guest names
3. Click "Generate Codes"
4. Download CSV
5. Email/text codes to each guest
```

### Leading Up to Wedding
```
1. Go to "View RSVPs" tab
2. Monitor status bar (who's accepted, declined, pending)
3. Search for specific guests
4. Check messages for dietary restrictions
```

### One Week Before
```
1. Export final guest list as CSV
2. Final headcount from stats
3. Use data for seating, catering, place cards
```

---

## 💡 Pro Tips

- **Copy codes individually** - Click "Copy" next to each name
- **Download CSV** - Best for managing large guest lists
- **Search guests** - Use search box to find specific people
- **Filter by status** - View only "Pending" to follow up
- **Read messages** - Check for dietary restrictions and notes
- **Export regularly** - Keep backup copies of guest data

---

## 🔒 Security Reminders

- Change password before going live: Update `ADMIN_PASSWORD_HASH` in `.env.local`
- Never share the admin login credentials
- Use HTTPS in production (automatic on Vercel)
- All codes are securely hashed in database

---

## 📧 Sample Email to Guests

```
Subject: You're Invited! Here's Your RSVP Code

Dear [GUEST NAME],

We're so excited to celebrate with you!

Your exclusive RSVP code: [CODE]

Please visit our wedding website to RSVP:
→ https://yourwebsite.com/rsvp

Enter your code and let us know if you can make it!

RSVP by: [DATE]

With love,
[YOUR NAMES]
```

---

## ❓ Common Issues

| Issue | Solution |
|-------|----------|
| Password not working | Check `.env.local` for `ADMIN_PASSWORD_HASH` |
| Codes not generating | Ensure Firebase is connected |
| Guests not showing | Check admin token in localStorage |
| Can't export CSV | Try refreshing the page first |

---

## 🎯 Next Steps

1. ✅ Log in: `http://localhost:3000/admin`
2. ✅ Generate codes for all guests
3. ✅ Distribute codes via email
4. ✅ Monitor RSVPs in real-time
5. ✅ Export final guest list

**Happy planning!** 🎉
