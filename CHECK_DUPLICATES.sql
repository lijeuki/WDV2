-- =====================================================
-- Check for Duplicate Users
-- Run this in Supabase SQL Editor to diagnose login issues
-- =====================================================

-- 1. Check for duplicate auth_id entries
SELECT 
  auth_id,
  COUNT(*) as count,
  STRING_AGG(email, ', ') as emails,
  STRING_AGG(full_name, ', ') as names
FROM users
WHERE auth_id IS NOT NULL
GROUP BY auth_id
HAVING COUNT(*) > 1;

-- 2. Check for users without auth_id
SELECT 
  id,
  email,
  full_name,
  role
FROM users
WHERE auth_id IS NULL
ORDER BY created_at DESC;

-- 3. Check all users with their auth status
SELECT 
  u.id,
  u.email,
  u.full_name,
  u.role,
  u.auth_id,
  CASE 
    WHEN u.auth_id IS NULL THEN '❌ No auth linked'
    ELSE '✅ Auth linked'
  END as auth_status,
  u.created_at
FROM users u
ORDER BY u.created_at DESC;

-- =====================================================
-- Fix Duplicates (if found)
-- =====================================================

-- Option 1: Delete duplicate entries (keep the first one)
-- Uncomment and modify based on your findings:
/*
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
*/

-- Option 2: Manually delete specific duplicate by ID
-- Uncomment and replace with actual ID:
/*
DELETE FROM users WHERE id = 'DUPLICATE_USER_ID_HERE';
*/

-- =====================================================
-- Verify Auth Users
-- =====================================================

-- Check Supabase auth.users (you need to be admin)
-- This shows auth users that might not have a profile
/*
SELECT 
  au.id as auth_id,
  au.email as auth_email,
  u.id as user_profile_id,
  u.email as profile_email,
  CASE 
    WHEN u.id IS NULL THEN '❌ No profile'
    ELSE '✅ Has profile'
  END as status
FROM auth.users au
LEFT JOIN users u ON u.auth_id = au.id
ORDER BY au.created_at DESC;
*/

-- =====================================================
-- After Fixing
-- =====================================================

-- Verify the fix worked
SELECT 
  'Total users' as metric,
  COUNT(*) as count
FROM users
UNION ALL
SELECT 
  'Users with auth_id' as metric,
  COUNT(*) as count
FROM users
WHERE auth_id IS NOT NULL
UNION ALL
SELECT 
  'Users without auth_id' as metric,
  COUNT(*) as count
FROM users
WHERE auth_id IS NULL;
