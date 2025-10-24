# 🚀 Demo Setup Guide

## ⚡ Quick Setup (Recommended)

The easiest way is to run the SQL directly in Supabase SQL Editor:

### Step 1: Add password_hash column

```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ;
```

### Step 2: Run seed data

Copy and paste the entire contents of `supabase/seed_data.sql` into Supabase SQL Editor and execute.

**Done!** All 7 demo accounts are now ready to use.

---

## 🤖 Automatic Setup (Alternative)

You can try the automatic script, but it requires proper database permissions:

```bash
npm run seed
```

**Note:** This may fail due to Row Level Security (RLS) policies. If it fails, use the manual method above.

## What gets created:

1. ✅ Creates Walking Doctor organization
2. ✅ Creates Jakarta Branch
3. ✅ Creates Jakarta Central Clinic
4. ✅ Creates 7 demo user accounts with passwords

## Demo Accounts Created:

All accounts use password: **`password`**

| Role | Email | Dashboard |
|------|-------|-----------|
| 👨‍⚕️ Doctor | `doctor@clinic.com` | Full clinical workflows |
| 💼 Front Desk | `desk@clinic.com` | Check-in & appointments |
| 🏥 Clinic Owner | `clinic@owner.com` | Analytics dashboard |
| 🏢 Branch Owner | `branch@owner.com` | Multi-clinic view |
| 🦷 Walking Doctor | `walkingdoctor@admin.com` | Super admin |
| 🦷 Hygienist | `hygienist@clinic.com` | Hygiene workflows |
| 👨‍⚕️ Assistant | `assistant@clinic.com` | Assistant tasks |

## Prerequisites:

1. ✅ Initial schema migration must be run first (001_initial_schema.sql)
2. ✅ .env file must have valid Supabase credentials
3. ✅ password_hash column must exist in users table

If password_hash column doesn't exist, run this in Supabase SQL Editor first:

```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ;
```

## Usage:

```bash
# Run the automatic setup
npm run seed

# Then start the dev server
npm run dev

# Login at http://localhost:5173/login
```

## Troubleshooting:

### Error: "Supabase credentials not found"
- Check your .env file has VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

### Error: "column password_hash does not exist"
- Run the ALTER TABLE command above in Supabase SQL Editor

### Error: "permission denied for table users"
- Make sure your ANON_KEY has proper permissions
- Or run the seed_data.sql manually in Supabase SQL Editor

## Manual Alternative:

If the automatic script doesn't work, you can run the SQL manually:

1. Open Supabase SQL Editor
2. Copy contents from `supabase/seed_data.sql`
3. Execute the SQL

---

**Quick Start:** `npm run seed` → `npm run dev` → Login! 🎉
