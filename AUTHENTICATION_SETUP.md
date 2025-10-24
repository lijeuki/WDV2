# 🔐 Authentication Setup Guide

## Overview

The WD Dental EHR system uses **Supabase Authentication** with **role-based access control (RBAC)**. This guide explains how to create demo accounts for all user roles.

---

## 🎭 Available User Roles

| Role | Description | Access Level | Dashboard Route |
|------|-------------|--------------|-----------------|
| **walking_doctor** | Super Admin - Grand Parent | Full system access | `/walking-doctor/dashboard` |
| **branch_owner** | Branch Manager - Parent | Branch-level access | `/branch/dashboard` |
| **clinic_owner** | Clinic Manager - Child | Clinic-level access | `/clinic/dashboard` |
| **doctor** | Clinician | Patient care, treatments | `/doctor` |
| **front_desk** | Reception Staff | Appointments, check-in | `/front-desk` |
| **hygienist** | Dental Hygienist | Cleanings, basic procedures | `/hygienist/dashboard` |
| **assistant** | Dental Assistant | Support tasks | `/assistant/dashboard` |

---

## 🚀 Quick Start - Create Demo Accounts

### Prerequisites
1. Supabase project is set up
2. Database schema is migrated (see `MANUAL_MIGRATION_GUIDE.md`)
3. `.env` file is configured with Supabase credentials

---

## 📝 Step-by-Step Account Creation

### **Step 1: Access Supabase Dashboard**

Go to: **Supabase Dashboard → Your Project → Authentication → Users**

Or use this link format: `https://supabase.com/dashboard/project/YOUR_PROJECT_ID/auth/users`

---

### **Step 2: Create Auth Users**

For each role, click **"Add User"** → **"Create new user"** and fill in:

#### 1. Walking Doctor (Super Admin)
```
Email: walkingdoctor@admin.com
Password: <create-strong-password>
✅ Auto confirm user
```

#### 2. Branch Owner
```
Email: branch@owner.com
Password: <create-strong-password>
✅ Auto confirm user
```

#### 3. Clinic Owner
```
Email: clinic@owner.com
Password: <create-strong-password>
✅ Auto confirm user
```

#### 4. Doctor
```
Email: doctor@clinic.com
Password: <create-strong-password>
✅ Auto confirm user
```

#### 5. Front Desk
```
Email: desk@clinic.com
Password: <create-strong-password>
✅ Auto confirm user
```

#### 6. Hygienist
```
Email: hygienist@clinic.com
Password: <create-strong-password>
✅ Auto confirm user
```

#### 7. Assistant
```
Email: assistant@clinic.com
Password: <create-strong-password>
✅ Auto confirm user
```

**Note**: Use strong passwords (min 8 characters, mix of letters, numbers, and symbols). For demo purposes, you can use simple passwords like `Demo123!` but change them in production.

---

### **Step 3: Link Auth Users to Database**

After creating each auth user, **copy the User UID** and run this SQL in **SQL Editor** (`https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql/new`):

```sql
-- 1. Walking Doctor (Super Admin)
INSERT INTO users (
  auth_id,
  email,
  full_name,
  role,
  walking_doctor_id
) VALUES (
  'PASTE_AUTH_UID_HERE',
  'walkingdoctor@admin.com',
  'Dr. Admin Walking',
  'walking_doctor',
  '00000000-0000-0000-0000-000000000001' -- From seed data
);

-- 2. Branch Owner
INSERT INTO users (
  auth_id,
  email,
  full_name,
  role,
  walking_doctor_id,
  branch_id
) VALUES (
  'PASTE_AUTH_UID_HERE',
  'branch@owner.com',
  'John Branch Manager',
  'branch_owner',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002' -- From seed data
);

-- 3. Clinic Owner
INSERT INTO users (
  auth_id,
  email,
  full_name,
  role,
  walking_doctor_id,
  branch_id,
  clinic_id
) VALUES (
  'PASTE_AUTH_UID_HERE',
  'clinic@owner.com',
  'Sarah Clinic Manager',
  'clinic_owner',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000003' -- From seed data
);

-- 4. Doctor
INSERT INTO users (
  auth_id,
  email,
  full_name,
  role,
  license_number,
  specialization,
  walking_doctor_id,
  branch_id,
  clinic_id
) VALUES (
  'PASTE_AUTH_UID_HERE',
  'doctor@clinic.com',
  'Dr. John Smith',
  'doctor',
  'DDS-12345',
  'General Dentistry',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000003'
);

-- 5. Front Desk
INSERT INTO users (
  auth_id,
  email,
  full_name,
  role,
  walking_doctor_id,
  branch_id,
  clinic_id
) VALUES (
  'PASTE_AUTH_UID_HERE',
  'desk@clinic.com',
  'Mary Reception',
  'front_desk',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000003'
);

-- 6. Hygienist
INSERT INTO users (
  auth_id,
  email,
  full_name,
  role,
  license_number,
  walking_doctor_id,
  branch_id,
  clinic_id
) VALUES (
  'PASTE_AUTH_UID_HERE',
  'hygienist@clinic.com',
  'Emma Clean',
  'hygienist',
  'DH-67890',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000003'
);

-- 7. Assistant
INSERT INTO users (
  auth_id,
  email,
  full_name,
  role,
  walking_doctor_id,
  branch_id,
  clinic_id
) VALUES (
  'PASTE_AUTH_UID_HERE',
  'assistant@clinic.com',
  'Lisa Helper',
  'assistant',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000003'
);
```

---

## 🧪 Testing Authentication

### **1. Start Development Server**
```bash
npm run dev
```

### **2. Test Each Role**

Visit http://localhost:5173/login and try:

| Role | Email | Password | Expected Route |
|------|-------|----------|----------------|
| Walking Doctor | `walkingdoctor@admin.com` | `<your-password>` | `/walking-doctor/dashboard` |
| Branch Owner | `branch@owner.com` | `<your-password>` | `/branch/dashboard` |
| Clinic Owner | `clinic@owner.com` | `<your-password>` | `/clinic/dashboard` |
| Doctor | `doctor@clinic.com` | `<your-password>` | `/doctor` |
| Front Desk | `desk@clinic.com` | `<your-password>` | `/front-desk` |
| Hygienist | `hygienist@clinic.com` | `<your-password>` | `/hygienist/dashboard` |
| Assistant | `assistant@clinic.com` | `<your-password>` | `/assistant/dashboard` |

---

## 🔒 Security Notes

1. **Change passwords** in production
2. **Enable MFA** for admin roles
3. **Set up Row Level Security (RLS)** in Supabase
4. **Never commit** `.env` file to git
5. **Use strong passwords** (min 12 characters)

---

## ⚠️ Current Development Status

### ✅ **Implemented**
- Login page with Supabase Auth
- Role-based routing (all 7 roles)
- Auth state management
- Logout functionality
- Doctor dashboard
- Front Desk dashboard

### 🚧 **In Development**
- Walking Doctor dashboard
- Branch Owner dashboard
- Clinic Owner dashboard
- Hygienist dashboard
- Assistant dashboard
- Patient management workflows
- Appointment scheduling
- Treatment planning

### 📋 **Currently Active Roles**
As of now, **only 2 roles have full dashboards**:
1. **Doctor** - Complete with patient list, exam forms
2. **Front Desk** - Complete with appointment management

**Other roles** (walking_doctor, branch_owner, clinic_owner, hygienist, assistant) have routing configured but dashboards are pending development.

---

## 🎯 Recommended Testing Approach

**Phase 1 - Working Features:**
1. Test **Doctor** account → Full patient workflows
2. Test **Front Desk** account → Appointment management

**Phase 2 - Future Development:**
3. Create accounts for other roles (for when their dashboards are ready)
4. Test role-based access control
5. Test multi-tenancy (walking_doctor → branch → clinic hierarchy)

---

## 📞 Support

If you encounter issues:
1. Check Supabase logs in dashboard (Project Settings → Logs)
2. Verify `.env` configuration
3. Ensure database schema is migrated
4. Check that auth users are linked to users table

---

## 📚 Related Documentation

- `MANUAL_MIGRATION_GUIDE.md` - Database setup
- `QUICK_START.md` - Getting started guide
- `DEPLOYMENT_SUCCESS.md` - Deployment information
- `.env.example` - Environment configuration template

---

**Last Updated**: October 24, 2025
