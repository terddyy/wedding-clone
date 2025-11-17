# Admin Panel Guide

## Access the Admin Panel

Visit: `http://localhost:3000/admin` (development) or `https://yourwebsite.com/admin` (production)

### Login Credentials
- **Password**: `admin123` (default demo password)
- **Change this in production!** Update the `ADMIN_PASSWORD_HASH` environment variable

---

## How to Generate Invitation Codes

### Step 1: Access Code Generator
1. Log in to the admin panel with your password
2. Click on the **"Generate Codes"** tab

### Step 2: Enter Guest Names
1. In the text area, enter guest names - **one per line**
2. Example:
   ```
   John Smith
   Jane Doe
   Michael Johnson
   Sarah Williams
   ```

### Step 3: Generate Codes
1. Click **"Generate Codes"** button
2. The system will create unique 8-character codes for each guest
3. Each code is stored securely in your database with a bcrypt hash

### Step 4: Distribute Codes
You have two options:

#### Option A: Copy Individually
- Click **"Copy"** button next to each guest's code
- Send the code to the guest via email or text

#### Option B: Download CSV
- Click **"Download CSV"** button
- Opens a spreadsheet with guest names and codes
- Print or email the spreadsheet to guests

---

## How to View RSVPs

### Step 1: Access Guest List
1. Log in to the admin panel
2. Click on **"View Guests & RSVPs"** tab (default view)

### Step 2: View Statistics
At the top, you'll see:
- **Total Guests**: All guests invited
- **Attending**: Confirmed attendees
- **Not Attending**: Declined guests
- **Pending**: Guests who haven't RSVP'd yet

### Step 3: Search and Filter
- **Search box**: Find guests by name
- **Filter dropdown**: View specific status groups (Attending, Declining, Pending)

### Step 4: Review Guest Details
Each row shows:
- **Guest Name**: Full name from invitation
- **Status**: ✓ Attending | ✗ Declining | ⏳ Pending
- **Message**: Any notes left by the guest (dietary restrictions, etc.)
- **Submitted**: Date when RSVP was completed
- **Code Used**: Whether the guest used their code

### Step 5: Export Data
- Click **"Export as CSV"** button at the bottom
- Downloads a spreadsheet with all filtered guest data
- Useful for seating arrangements, catering counts, etc.

---

## Example Workflow

### 1. Before the Wedding (2-3 months prior)
```
Admin Panel → Generate Codes Tab
↓
Enter guest names (one per line)
↓
Generate & Download CSV
↓
Send individual codes to guests via email/text
```

**Sample Email to Guest:**
```
Dear John,

We're thrilled you'll be joining us! 

Your exclusive RSVP code is: JSMITH42

Please visit our wedding website and enter this code to RSVP:
https://yourwebsite.com/rsvp

We need your response by [DATE]

Thanks!
```

### 2. After Guests RSVP (Leading up to wedding)
```
Admin Panel → View Guests & RSVPs Tab
↓
Monitor RSVP status
↓
Track who's attending vs. declining
↓
Check messages for dietary restrictions
↓
Export final guest list as CSV
```

### 3. Final Preparations
```
Use exported CSV for:
- Seating chart planning
- Catering count
- Place card printing
- Head count confirmation
```

---

## API Endpoints (For Technical Reference)

### Authentication
```
POST /api/admin/auth
Body: { "password": "admin123" }
Response: { "token": "...", "success": true }
```

### Generate Codes
```
POST /api/admin/generate-codes
Headers: { "Authorization": "Bearer TOKEN" }
Body: { "guestNames": ["John Smith", "Jane Doe"] }
Response: { "codes": [...], "count": 2 }
```

### Get All Guests
```
GET /api/admin/guests
Headers: { "Authorization": "Bearer TOKEN" }
Response: { "guests": [...], "count": 150 }
```

---

## Security Best Practices

### For Production:

1. **Change the Admin Password**
   - Update `.env.local`:
     ```
     ADMIN_PASSWORD_HASH=your_secure_password_here
     ```

2. **Use HTTPS Only**
   - Deployed to Vercel automatically uses HTTPS

3. **Secure Your Database**
   - All codes are bcrypt hashed
   - Never store plain text passwords

4. **Rate Limiting**
   - Consider adding rate limiting to prevent brute force attacks

5. **Audit Logging**
   - Log all admin actions for security

---

## Troubleshooting

### "Cannot find module 'bcrypt'"
- Run: `npm install bcrypt`

### "Invalid password" error
- Make sure you're using the correct password
- Default: `admin123`
- Check your `.env.local` file

### No guests showing up
- Make sure Firestore is initialized
- Check Firebase connection

### Codes not generating
- Check Firebase permissions
- Ensure database has enough quota

---

## Advanced: Bulk Import Script

If you have a large guest list, use the helper script:

```bash
node scripts/bulk-import-guests.js
```

This script:
- Reads from a CSV file
- Generates codes for all guests
- Imports to Firestore in bulk
- Much faster than manual entry

---

## Next Steps

1. ✅ **Log in** to admin panel: `http://localhost:3000/admin`
2. ✅ **Generate codes** for your guests
3. ✅ **Download CSV** and distribute codes
4. ✅ **Monitor RSVPs** as guests respond
5. ✅ **Export final list** for planning

Enjoy your wedding! 🎉
