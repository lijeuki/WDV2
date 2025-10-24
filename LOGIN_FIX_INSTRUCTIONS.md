# 🔧 Login Issue - Quick Fix

## Problem
Cannot login with demo accounts - getting "Invalid email or password" error.

## Solution (2 minutes)

### Step 1: Open Supabase SQL Editor

1. Go to your Supabase project: https://supabase.com/dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New query**

### Step 2: Run the Fix Script

Copy the **ENTIRE contents** of `QUICK_FIX_LOGIN.sql` and paste into the SQL Editor, then click **Run**.

Or manually copy this:

```sql
-- Add password column
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Create organization (if not exists)
INSERT INTO walking_doctors (id, name, email, phone, address) VALUES
('00000000-0000-0000-0000-000000000001', 'Walking Doctors Indonesia', 'admin@walkingdoctors.co.id', '+62-21-12345678', 'Jl. Sudirman No. 123, Jakarta')
ON CONFLICT (id) DO NOTHING;

INSERT INTO branches (id, walking_doctor_id, name, location, address, phone, email, status) VALUES
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Jakarta Branch', 'Jakarta', 'Jl. Thamrin No. 45, Jakarta Pusat', '+62-21-87654321', 'jakarta@walkingdoctors.co.id', 'active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO clinics (id, branch_id, name, location, address, phone, email, specialties, status) VALUES
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'Jakarta Central Clinic', 'Jakarta Pusat', 'Jl. MH Thamrin No. 45, Jakarta Pusat 10350', '+62-21-55555555', 'central@walkingdoctors.co.id', ARRAY['general', 'orthodontics', 'pediatric'], 'active')
ON CONFLICT (id) DO NOTHING;

-- Create users with password
INSERT INTO users (email, full_name, role, password_hash, clinic_id, branch_id, walking_doctor_id, employment_status, phone) VALUES
('walkingdoctor@admin.com', 'Dr. Admin Super', 'walking_doctor', 'cGFzc3dvcmQ=', NULL, NULL, '00000000-0000-0000-0000-000000000001', 'active', '+62-811-1111-1111'),
('branch@owner.com', 'Mr. Branch Manager', 'branch_owner', 'cGFzc3dvcmQ=', NULL, '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'active', '+62-811-2222-2222'),
('clinic@owner.com', 'Mrs. Clinic Owner', 'clinic_owner', 'cGFzc3dvcmQ=', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'active', '+62-811-3333-3333'),
('doctor@clinic.com', 'Dr. John Smith', 'doctor', 'cGFzc3dvcmQ=', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'active', '+62-811-4444-4444'),
('desk@clinic.com', 'Ms. Sarah Front', 'front_desk', 'cGFzc3dvcmQ=', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'active', '+62-811-5555-5555'),
('hygienist@clinic.com', 'Ms. Mary Clean', 'hygienist', 'cGFzc3dvcmQ=', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'active', '+62-811-6666-6666'),
('assistant@clinic.com', 'Mr. Tom Helper', 'assistant', 'cGFzc3dvcmQ=', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'active', '+62-811-7777-7777')
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  employment_status = EXCLUDED.employment_status,
  updated_at = NOW();

-- Verify
SELECT email, full_name, role, 
       CASE WHEN password_hash IS NOT NULL THEN '✓ Has password' ELSE '✗ No password' END 
FROM users ORDER BY role;
```

### Step 3: Verify Users Created

You should see output showing 7 users with "✓ Has password".

### Step 4: Login!

Now go to http://localhost:5173/login and use:

**Email:** `doctor@clinic.com`  
**Password:** `password`

Or any of these:
- walkingdoctor@admin.com / password
- branch@owner.com / password
- clinic@owner.com / password
- desk@clinic.com / password

---

## Troubleshooting

### Still getting "Invalid email or password"?

**Check 1:** Open browser console (F12) and look for error messages

**Check 2:** Verify users exist in database:
```sql
SELECT COUNT(*) FROM users WHERE password_hash IS NOT NULL;
```
Should return 7.

**Check 3:** Check if you ran the initial schema migration:
```sql
SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'users';
```
Should return 1. If returns 0, you need to run `001_initial_schema.sql` first.

**Check 4:** Make sure you're using the correct Supabase URL in `.env`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Then restart dev server:
```bash
npm run dev
```

---

## What This Does

1. **Adds password_hash column** to users table (if missing)
2. **Creates organization structure** (Walking Doctor → Branch → Clinic)
3. **Creates 7 demo users** with password "password" (Base64 encoded: cGFzc3dvcmQ=)
4. **Verifies** all users have passwords

---

## Need More Help?

Check the browser console (F12) when logging in - it will show detailed error messages that explain what's wrong.

Common issues:
- ❌ **"User not found"** → Run the SQL above to create users
- ❌ **"password_hash column not found"** → Run `ALTER TABLE users ADD COLUMN password_hash TEXT;`
- ❌ **"Invalid email or password"** → User exists but wrong password (should be "password")
- ❌ **Database error** → Check Supabase connection in `.env` file
