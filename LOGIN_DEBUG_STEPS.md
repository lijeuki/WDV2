# 🔍 Login Debug Steps

Your login is stuck on "Logging in..." - here's how to diagnose and fix it:

---

## 🛠️ **Step 1: Check Browser Console**

1. Open your browser Developer Tools:
   - **Chrome/Edge**: Press `F12` or `Ctrl+Shift+I`
   - **Firefox**: Press `F12` or `Ctrl+Shift+K`

2. Go to the **Console** tab

3. Try to login and watch for these messages:

### Expected Flow (Successful Login):
```
🔐 Attempting login with Supabase...
🔑 auth.ts: Signing in with email: doctor@clinic.com
✅ auth.ts: Auth successful, fetching user profile...
✅ auth.ts: Profile found: doctor@clinic.com Role: doctor
📝 AuthContext: Calling authSignIn...
✅ AuthContext: Got user: doctor@clinic.com Role: doctor
🏥 Navigating to /doctor
✅ Login successful
```

### Common Error Patterns:

#### Error 1: Invalid Credentials
```
❌ auth.ts: Supabase auth error: Invalid login credentials
❌ Login failed: Invalid login credentials
```
**Fix**: Check your password in Supabase Dashboard

---

#### Error 2: User Profile Not Found
```
✅ auth.ts: Auth successful, fetching user profile...
❌ auth.ts: No profile found for auth_id: abc123...
❌ Login failed: User profile not found. Please link your account...
```
**Fix**: Run this SQL in Supabase:
```sql
-- First, get your auth_id from Supabase Dashboard → Authentication → Users
-- Copy the UID

-- Then link it to user profile:
UPDATE users 
SET auth_id = 'PASTE_YOUR_AUTH_UID_HERE'
WHERE email = 'doctor@clinic.com';
```

---

#### Error 3: Multiple Profiles (Duplicates)
```
✅ auth.ts: Auth successful, fetching user profile...
❌ auth.ts: Profile fetch error: ...multiple rows...
```
**Fix**: Run `CHECK_DUPLICATES.sql` and delete duplicates

---

## 🛠️ **Step 2: Verify Database Setup**

Run these SQL queries in **Supabase SQL Editor**:

### Check 1: Does the user profile exist?
```sql
SELECT 
  id,
  email,
  full_name,
  role,
  auth_id,
  clinic_id
FROM users
WHERE email = 'doctor@clinic.com';
```

**Expected Result**: 1 row with:
- ✅ `email`: doctor@clinic.com
- ✅ `auth_id`: Should have a UUID (not NULL)
- ✅ `role`: Should be 'doctor'
- ✅ `clinic_id`: Should have a UUID

**If No Results**: User doesn't exist - follow `AUTHENTICATION_SETUP.md` to create it

**If auth_id is NULL**: Link it to auth account (see Fix for Error 2 above)

---

### Check 2: Does the auth account exist?
1. Go to: **Supabase Dashboard → Authentication → Users**
2. Search for: `doctor@clinic.com`
3. Should see 1 user

**If Not Found**: Create auth account:
- Click "Add User" → "Create new user"
- Email: `doctor@clinic.com`
- Password: (your choice)
- ✅ Auto confirm user
- Click "Create user"
- Copy the UID
- Link to profile (run SQL above)

---

### Check 3: Are there duplicates?
```sql
SELECT 
  auth_id,
  COUNT(*) as count,
  STRING_AGG(email, ', ') as emails
FROM users
WHERE auth_id IS NOT NULL
GROUP BY auth_id
HAVING COUNT(*) > 1;
```

**Expected Result**: Empty (no duplicates)

**If Has Results**: Delete duplicates using `CHECK_DUPLICATES.sql`

---

## 🛠️ **Step 3: Test With Demo Mode**

If Supabase setup is complex, test with demo mode first:

1. Rename `.env` to `.env.backup`:
   ```bash
   mv .env .env.backup
   ```

2. Restart dev server:
   ```bash
   npm run dev
   ```

3. Try login with `doctor@clinic.com` and any password

4. Should see:
   ```
   ⚠️ Demo Mode: Supabase not configured
   ```
   And redirect to `/doctor` immediately

5. If this works, the issue is in your Supabase setup, not the code

6. Restore `.env`:
   ```bash
   mv .env.backup .env
   ```

---

## 🛠️ **Step 4: Fresh Database Setup**

If nothing works, start fresh:

### Clean Slate:
```sql
-- Delete all users
DELETE FROM users;

-- Delete all organizations
DELETE FROM clinics;
DELETE FROM branches;
DELETE FROM walking_doctors;
```

### Re-run Setup:
1. Follow `MANUAL_MIGRATION_GUIDE.md` to setup database
2. Follow `AUTHENTICATION_SETUP.md` to create accounts
3. Make sure auth_id is properly linked

---

## 🛠️ **Step 5: Check Network Tab**

If console shows no errors:

1. Open Developer Tools → **Network** tab
2. Filter by **Fetch/XHR**
3. Try to login
4. Look for failed requests (red color)
5. Click on failed request → Response tab
6. Check the error message

Common issues:
- **401 Unauthorized**: Wrong password or email
- **404 Not Found**: User profile doesn't exist
- **500 Server Error**: Database issue
- **CORS Error**: Supabase URL wrong in .env

---

## ✅ **Quick Fix Checklist**

Try these in order:

- [ ] Check browser console for errors
- [ ] Verify `.env` file exists and has correct Supabase credentials
- [ ] Verify auth account exists in Supabase Dashboard
- [ ] Verify user profile exists in `users` table
- [ ] Verify `auth_id` is linked (not NULL)
- [ ] Check for duplicate users
- [ ] Clear browser cache and try again
- [ ] Restart dev server (`npm run dev`)
- [ ] Try demo mode (rename .env)
- [ ] Check Supabase project is not paused/suspended

---

## 🔧 **Most Common Issue & Fix**

**Problem**: Auth account exists but user profile has `auth_id = NULL`

**Solution**:
```sql
-- 1. Get auth UID from Supabase Dashboard → Authentication → Users
--    Click on doctor@clinic.com and copy the "UID"

-- 2. Link it to user profile:
UPDATE users 
SET auth_id = 'PASTE_UID_HERE'
WHERE email = 'doctor@clinic.com';

-- 3. Verify:
SELECT email, auth_id FROM users WHERE email = 'doctor@clinic.com';
-- Should show the auth_id (not NULL)
```

---

## 📞 **Still Stuck?**

Share these from browser console:
1. All error messages (red text)
2. The login flow logs (the emoji messages)
3. Network tab errors

And these from Supabase:
1. Screenshot of Authentication → Users
2. Result of: `SELECT * FROM users WHERE email = 'doctor@clinic.com'`
3. Project status (not paused)

---

## 🎯 **What The Code Does Now**

After the fix, the login flow:

1. **Login.tsx**: Calls `signIn(email, password)`
2. **AuthContext.tsx**: Calls `authSignIn(email, password)` 
3. **auth.ts**: 
   - Authenticates with Supabase Auth
   - Fetches user profile from `users` table
   - Returns user data
4. **AuthContext.tsx**: Navigates based on role
5. **Login.tsx**: Shows success or error

Each step now has **debug logs** so you can see exactly where it fails!

---

**Last Updated**: October 24, 2025  
**Status**: ✅ Debug logging added, ready to diagnose
