# 🔧 Login Troubleshooting Guide

## Error: "Cannot coerce the result to a single JSON object"

### 🔍 **What This Error Means**
This error occurs when the authentication system tries to fetch your user profile from the database but finds either:
1. **Multiple user records** with the same `auth_id` (duplicates)
2. **No user record** matching the `auth_id`

---

## ✅ **Fix Applied**

The authentication code has been updated to handle this issue better:
- Changed `.single()` to `.maybeSingle()` to prevent crashes
- Added better error messages
- Added null checks

**Files Updated:**
- `src/lib/auth/auth.ts`

---

## 🔍 **How to Diagnose the Issue**

### Step 1: Check for Duplicate Users

Run this SQL in **Supabase SQL Editor**:

```sql
-- Check for duplicate auth_id entries
SELECT 
  auth_id,
  COUNT(*) as count,
  STRING_AGG(email, ', ') as emails,
  STRING_AGG(full_name, ', ') as names
FROM users
WHERE auth_id IS NOT NULL
GROUP BY auth_id
HAVING COUNT(*) > 1;
```

**If you see results**: You have duplicate users. Skip to "Fix Duplicates" below.

**If empty**: No duplicates. Go to Step 2.

---

### Step 2: Check if User Profile Exists

Run this SQL:

```sql
-- Check all users and their auth status
SELECT 
  id,
  email,
  full_name,
  role,
  auth_id,
  CASE 
    WHEN auth_id IS NULL THEN '❌ No auth linked'
    ELSE '✅ Auth linked'
  END as auth_status
FROM users
ORDER BY created_at DESC;
```

**Look for:**
- Users with `❌ No auth linked` - these cannot login
- Missing users - you need to create them

---

### Step 3: Verify Auth Account Exists

Check if you created the auth account in Supabase:

1. Go to **Supabase Dashboard → Authentication → Users**
2. Look for your email (e.g., `doctor@clinic.com`)
3. If not found, you need to create it

---

## 🔧 **How to Fix**

### Fix 1: Remove Duplicate Users

If Step 1 found duplicates, delete them:

```sql
-- Option A: Keep the oldest user, delete newer duplicates
DELETE FROM users 
WHERE id IN (
  SELECT id FROM (
    SELECT id, 
           ROW_NUMBER() OVER (PARTITION BY auth_id ORDER BY created_at) as rn
    FROM users
    WHERE auth_id IS NOT NULL
  ) t
  WHERE t.rn > 1
);
```

**OR manually delete specific duplicate:**

```sql
-- Find the duplicate user ID first
SELECT id, email, full_name, created_at
FROM users
WHERE auth_id = 'YOUR_AUTH_ID_HERE'
ORDER BY created_at;

-- Then delete the unwanted one
DELETE FROM users WHERE id = 'DUPLICATE_USER_ID_HERE';
```

---

### Fix 2: Create Missing User Profile

If auth account exists but no user profile:

```sql
-- Get your auth user ID first from: Dashboard → Authentication → Users
-- Click on the user and copy the "UID"

-- Then create the profile:
INSERT INTO users (
  auth_id,
  email,
  full_name,
  role,
  clinic_id,
  branch_id,
  walking_doctor_id,
  employment_status
) VALUES (
  'PASTE_AUTH_UID_HERE',
  'doctor@clinic.com',
  'Dr. John Smith',
  'doctor',
  '00000000-0000-0000-0000-000000000003', -- From seed data
  '00000000-0000-0000-0000-000000000002', -- From seed data
  '00000000-0000-0000-0000-000000000001', -- From seed data
  'active'
);
```

---

### Fix 3: Create Missing Auth Account

If user profile exists but no auth account:

1. Go to **Supabase Dashboard → Authentication → Users**
2. Click **"Add User"** → **"Create new user"**
3. Enter:
   ```
   Email: doctor@clinic.com
   Password: <create-password>
   ✅ Auto confirm user
   ```
4. Click **"Create user"**
5. Copy the User UID
6. Update the user profile:

```sql
-- Link the auth account to existing user profile
UPDATE users 
SET auth_id = 'PASTE_UID_HERE'
WHERE email = 'doctor@clinic.com';
```

---

## ✅ **Verify the Fix**

After fixing, verify everything is correct:

```sql
-- Should show 1 user per auth_id (no duplicates)
SELECT 
  auth_id,
  COUNT(*) as count
FROM users
WHERE auth_id IS NOT NULL
GROUP BY auth_id
HAVING COUNT(*) > 1;
-- Expected result: No rows (empty)

-- Check your specific user
SELECT 
  id,
  email,
  full_name,
  role,
  auth_id,
  clinic_id
FROM users
WHERE email = 'doctor@clinic.com';
-- Expected result: 1 row with auth_id filled
```

---

## 🧪 **Test Login Again**

1. Clear your browser cache (or use incognito mode)
2. Go to http://localhost:5173/login
3. Enter credentials:
   ```
   Email: doctor@clinic.com
   Password: <your-password>
   ```
4. Click **Login**

**Expected result**: Successfully redirected to dashboard

---

## 🔍 **Common Scenarios**

### Scenario 1: First Time Setup
**Problem**: No auth account or user profile exists

**Solution**:
1. Follow `AUTHENTICATION_SETUP.md` to create auth account
2. Link it to user profile with SQL
3. Test login

### Scenario 2: Accidentally Created Multiple Profiles
**Problem**: Same email exists multiple times in users table

**Solution**:
1. Run duplicate check query
2. Delete extra profiles
3. Keep the one linked to auth

### Scenario 3: Auth Account Exists But No Profile
**Problem**: Can authenticate but profile not found

**Solution**:
1. Check if profile exists: `SELECT * FROM users WHERE email = 'your@email.com'`
2. If missing, create it with INSERT query above
3. Make sure to link auth_id correctly

### Scenario 4: Profile Exists But No Auth Account
**Problem**: User in database but cannot login

**Solution**:
1. Create auth account in Supabase Dashboard
2. Update user profile with new auth_id
3. Test login

---

## 🛠️ **Helpful SQL Queries**

### Check Everything
```sql
-- Complete diagnostic
SELECT 
  u.email,
  u.full_name,
  u.role,
  u.auth_id,
  u.clinic_id,
  c.name as clinic_name,
  CASE 
    WHEN u.auth_id IS NULL THEN '❌ Cannot login - no auth'
    ELSE '✅ Can login'
  END as login_status
FROM users u
LEFT JOIN clinics c ON u.clinic_id = c.id
ORDER BY u.created_at DESC;
```

### Count Users by Status
```sql
SELECT 
  CASE 
    WHEN auth_id IS NULL THEN 'No auth (cannot login)'
    ELSE 'Has auth (can login)'
  END as status,
  COUNT(*) as count
FROM users
GROUP BY (auth_id IS NULL);
```

---

## 📞 **Still Having Issues?**

1. **Check browser console** for detailed error messages
2. **Check Supabase logs**: Dashboard → Project Logs
3. **Verify .env file** has correct Supabase credentials
4. **Check network tab** to see the exact API error

### Debug Checklist:
- [ ] Database schema migrated successfully
- [ ] Seed data inserted (walking_doctors, branches, clinics exist)
- [ ] Auth account created in Supabase Dashboard
- [ ] User profile exists in users table
- [ ] auth_id in users table matches UID from auth.users
- [ ] No duplicate users with same auth_id
- [ ] .env file has correct VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

---

## 📋 **Quick Reference**

**Create Auth Account**: Supabase Dashboard → Authentication → Users → Add User

**Link to Profile**: 
```sql
UPDATE users SET auth_id = 'UID_HERE' WHERE email = 'email@example.com';
```

**Check for Duplicates**:
```sql
SELECT auth_id, COUNT(*) FROM users GROUP BY auth_id HAVING COUNT(*) > 1;
```

**Delete Duplicate**:
```sql
DELETE FROM users WHERE id = 'DUPLICATE_ID_HERE';
```

---

**Last Updated**: October 24, 2025  
**Status**: ✅ Auth code fixed, diagnostics provided
