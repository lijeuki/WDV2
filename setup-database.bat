@echo off
echo ========================================
echo WD Dental EHR - Database Setup
echo ========================================
echo.
echo This will copy the migration SQL to your clipboard.
echo.
echo Steps:
echo 1. The SQL will be copied to clipboard automatically
echo 2. Open: https://supabase.com/dashboard/project/kshfxmgwqsacptvhztcj/sql/new
echo 3. Paste (Ctrl+V) in the SQL Editor
echo 4. Click "Run" to execute
echo.
pause
echo.
echo Copying migration to clipboard...
type "supabase\migrations\001_initial_schema.sql" | clip
echo.
echo ✓ SQL copied to clipboard!
echo.
echo Now:
echo 1. Open Supabase SQL Editor (link above)
echo 2. Paste the SQL (Ctrl+V)
echo 3. Click "Run"
echo.
pause
