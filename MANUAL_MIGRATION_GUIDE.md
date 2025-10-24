# 📘 Manual Database Migration Guide

Since automated migration isn't working through the API, here's the simple manual process:

## ✅ **Step-by-Step Instructions** (Takes 2 minutes)

### **Step 1: Open SQL Editor**
Click this link: **[Open Supabase SQL Editor](https://supabase.com/dashboard/project/kshfxmgwqsacptvhztcj/sql/new)**

### **Step 2: Copy the Migration SQL**

Open this file on your computer:
```
C:\Users\rizkk\Documents\WD\Revamp\supabase\migrations\001_initial_schema.sql
```

**Select All** (Ctrl+A) and **Copy** (Ctrl+C)

### **Step 3: Paste and Run**

1. **Paste** the SQL into the Supabase SQL Editor (Ctrl+V)
2. Click the **"RUN"** button (or press Ctrl+Enter)
3. Wait ~10 seconds for execution
4. You should see: **"Success. No rows returned"**

### **Step 4: Verify Tables Created**

Go to: **[Table Editor](https://supabase.com/dashboard/project/kshfxmgwqsacptvhztcj/editor)**

You should see these **15 tables**:
- ✅ walking_doctors
- ✅ branches
- ✅ clinics
- ✅ users
- ✅ patients
- ✅ patient_consent_records
- ✅ appointments
- ✅ exams
- ✅ tooth_findings
- ✅ treatment_plans
- ✅ treatment_procedures
- ✅ invoices
- ✅ payments
- ✅ notifications
- ✅ audit_logs

---

## 🎯 **After Migration: Create Test User**

### **Option A: Use Supabase Dashboard**

1. Go to **[Authentication > Users](https://supabase.com/dashboard/project/kshfxmgwqsacptvhztcj/auth/users)**
2. Click **"Add User"** → **"Create new user"**
3. Fill in:
   - Email: `doctor@clinic.com`
   - Password: `Doctor123!` (or your choice)
   - Auto confirm user: ✅ **Check this**
4. Click **"Create user"**
5. **Copy the User UID** (it looks like: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)

### **Option B: Run This SQL** (After Option A)

Go back to **[SQL Editor](https://supabase.com/dashboard/project/kshfxmgwqsacptvhztcj/sql/new)** and run:

```sql
-- Replace YOUR_AUTH_ID_HERE with the UID you copied above
INSERT INTO users (
  auth_id,
  email,
  full_name,
  role,
  clinic_id
) VALUES (
  'YOUR_AUTH_ID_HERE',  -- ← Paste the UID here
  'doctor@clinic.com',
  'Dr. John Smith',
  'doctor',
  '00000000-0000-0000-0000-000000000003'
);
```

---

## 🎉 **Test Login**

1. Go to: http://localhost:5173
2. Login with:
   - Email: `doctor@clinic.com`
   - Password: `Doctor123!` (or whatever you set)
3. You should now be logged in with **real authentication**! 🎊

---

## ⚠️ **Troubleshooting**

### **"Success. No rows returned" is normal**
- This means the SQL executed successfully
- Tables are created even though no data is returned

### **If you get errors:**
- Check if tables already exist (go to Table Editor)
- If they do, you can skip the migration
- If not, try running the SQL in smaller chunks

### **Can't find the migration file?**
- File location: `C:\Users\rizkk\Documents\WD\Revamp\supabase\migrations\001_initial_schema.sql`
- Or copy from GitHub: https://github.com/lijeuki/WDV2/blob/main/supabase/migrations/001_initial_schema.sql

---

## 📞 **Need Help?**

If you encounter issues:
1. Check the Supabase logs: [Project Logs](https://supabase.com/dashboard/project/kshfxmgwqsacptvhztcj/logs)
2. Verify your service role key is correct
3. Make sure you're using the SQL Editor (not REST API)

---

**After completing this, your database will be ready!** 🚀
