# Role Permissions & Responsibilities Matrix

This document summarizes the specific permissions and responsibilities for the five key roles in the system.

Key Roles
- Doctors — Examinations, Procedures, Prescriptions
- Front Desk — Billing, Scheduling
- Clinic PIC (Person In Charge) — Clinic-level operations, Staff management, Procedure oversight
- Branch Owner — Manages single or multiple clinics; full Clinic PIC privileges across clinics
- Super Admin (Walking Doctors) — Highest-level authority; can create all user types and access all functions

---

Permissions Matrix

- Doctors
  - View PII: Yes (patients under care)
  - Perform Clinical Actions: Yes (examinations, procedures, prescriptions)
  - Manage Staff: No
  - Manage Billing: No (can view patient balance)
  - Scheduling: Limited (can request or modify own appointments)
  - View Financial Reports: Limited (clinical KPIs only)
  - Create Users: No
  - Access All Functions: No

- Front Desk
  - View PII: Yes (administrative scope)
  - Perform Clinical Actions: No
  - Manage Staff: No
  - Manage Billing: Yes (invoices, payments, outstanding balances)
  - Scheduling: Yes (appointments, providers, rooms)
  - View Financial Reports: Limited (daily billing and cash reports)
  - Create Users: No
  - Access All Functions: No

- Clinic PIC (Person In Charge)
  - View PII: Yes (clinic-wide)
  - Perform Clinical Actions: Limited (oversight/approval; not routine charting)
  - Manage Staff: Yes (assignments, schedules, performance)
  - Manage Billing: Yes (clinic-level oversight)
  - Scheduling: Yes (clinic-level, escalations)
  - View Financial Reports: Yes (clinic KPIs, revenue)
  - Create Users: Yes (clinic-level staff)
  - Access All Functions: Broad for clinic operations

- Branch Owner
  - View PII: Yes (across owned clinics)
  - Perform Clinical Actions: Limited (oversight/approval; not routine charting)
  - Manage Staff: Yes (cross-clinic assignments)
  - Manage Billing: Yes (branch-level oversight)
  - Scheduling: Yes (cross-clinic oversight)
  - View Financial Reports: Yes (aggregated across clinics)
  - Create Users: Yes (can create Clinic PIC and staff roles)
  - Access All Functions: Broad administrative access across clinics

- Super Admin (Walking Doctors)
  - View PII: Yes (system-wide)
  - Perform Clinical Actions: Yes (examinations, procedures, prescriptions)
  - Manage Staff: Yes (system-wide)
  - Manage Billing: Yes (system-wide)
  - Scheduling: Yes (system-wide)
  - View Financial Reports: Yes (enterprise level)
  - Create Users: Yes (all roles)
  - Access All Functions: Yes (full system)

---

Responsibilities Summary

- Doctors
  - Conduct examinations and record findings
  - Perform procedures and update clinical records
  - Issue prescriptions and manage treatment plans

- Front Desk
  - Manage scheduling for patients and providers
  - Handle billing: invoices, payments, and outstanding balances
  - Support check-in/out workflows

- Clinic PIC (Person In Charge)
  - Oversee clinic operations and ensure compliance
  - Manage staff assignments, schedules, and performance
  - Approve procedures and escalate clinical cases when needed
  - Monitor clinic financials and KPIs

- Branch Owner
  - Oversee one or multiple clinics within a branch
  - Monitor aggregated KPIs and financial performance
  - Assign PICs and manage cross-clinic staffing
  - Ensure procedure oversight and consistency across clinics

- Super Admin (Walking Doctors)
  - Act as mobile practitioner across clinics with full clinical capabilities
  - Create and manage all user types and roles
  - Set global policies, handle audits, and ensure data governance
  - Access enterprise dashboards and system-wide reporting

---

Notes
- Treatment Coordinator (if present) typically operates under Clinic PIC oversight with a focus on treatment acceptance and patient communication. While not one of the five primary roles, it remains compatible with this role model.
- This matrix is intended to inform dashboard design, sidebar visibility, and access control (RoleGuard) behavior across the application.