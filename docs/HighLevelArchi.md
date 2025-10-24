Multi-tenant Architecture
Dental EHR Platform – Enterprise Multi-Clinic Edition
Document Version: 1.0
 Date: October 2025
 Module: Owner Dashboard, Admin, Multi-Tenancy, Financial Reporting
 Stakeholders: Walking Doctors, Branch Owners, Clinic Owners (Clinic PIC)

Executive Summary
This document outlines the user stories, functional requirements, and system architecture for the Owner role within a hierarchical, multi-tenant Dental EHR platform. The platform supports ownership and management across four structured levels:
Walking Doctors (Grandparents): Entity-level ownership with the ability to register and oversee multiple branches.


Branch Owners (Parents): Manage multiple clinics under a single branch.


Clinic Owners (Children): Oversee doctors and staff within a specific clinic.


Doctors & Staff (Grandchildren): Operate clinical and administrative tasks within their assigned clinic.


The system integrates Role-Based Access Control (RBAC) and Ownership-Based Access Control (OBAC) to ensure secure data segregation, privacy, and precise permission management. Each role can only access data they own or have been explicitly authorized to view.
Additionally, when a patient visits another clinic within the same Walking Doctor network, their medical records can be securely retrieved with the patient’s consent, verified using their Patient Record Number, Board of Directors (BOD) approval, and National ID (KTP) number provided during registration at the new clinic. This approach maintains continuity of care across clinics while ensuring compliance, security, and patient privacy within the shared ownership ecosystem.


Ownership & Role Hierarchy
Level 0: Walking Doctor (Grand Parent)
Definition: Entity-level owner; can own and manage multiple branches
 Key Responsibilities:
Register new branches
View consolidated dashboards across all branches
Manage branch owners (assign, remove, permissions)
Set company-wide policies (pricing, scheduling rules, templates)
Access all financial reports aggregated
Compliance and auditing across enterprise
Permissions:
Create/Edit/Delete Branches
View all Clinic data (read-only or edit based on policy)
Manage all Staff (Walking Doctor, Branch Owner, Clinic Owner roles)
Export consolidated reports
Configure system-wide settings

Level 1: Branch Owner (Parent)
Definition: Manages one or more clinics within a branch
 Key Responsibilities:
Manage multiple clinics under their branch
Hire and manage clinic owners and staff
View branch-level consolidated reports
Ensure compliance within branch
Allocate resources across clinics
Permissions:
View/Edit clinics they own
Create new clinics within branch
Manage clinic owners and staff assignments
View branch-level financial reports
Cannot see data from other branches (unless Walking Doctor grants access)

Level 2: Clinic Owner (Child)
Definition: Manages doctors and staff within a specific clinic
 Key Responsibilities:
Hire and manage doctors and operational staff
Approve treatment plans and clinical protocols
Manage clinic schedules and resources
View clinic-level financial and operational reports
Ensure HIPAA compliance within clinic
Permissions:
View/Edit clinic data (patients, appointments, billing)
Manage doctors and staff within clinic
Approve/reject treatment plans (workflow dependent)
View clinic-level reports only
Cannot see data from other clinics

Level 3: Doctor (Grand Child)
Role: Licensed dentist providing clinical care
 Permissions: (Already defined in front desk/clinical modules)
Level 3: Operational Staff (Grand Child)
Role: Front desk, Hygienist, Assistant, Receptionist, Cashier
 Permissions: (Role-specific as per job function)

Multi-Tenant Data Isolation Strategy
Data Layer
Walking Doctor
Branch Owner
Clinic Owner
Doctor/Staff
Own Branch Data
✓ (All)
✓ (Assigned)
✗
✗
Own Clinic Data
✓ (All)
✓ (Parent)
✓
✓ (Filtered)
Own Patient Data
✓ (All)
✓ (Parent)
✓
✓ (Assigned)
Cross-Clinic Data
✓ (Aggregated)
✗ (Blocked)
✗ (Blocked)
✗ (Blocked)
Cross-Branch Data
✓ (Aggregated)
✗ (Blocked)
✗ (Blocked)
✗ (Blocked)


User Stories: Owner Role
User Story 1: Register & Manage Multiple Branches
As a Walking Doctor (Enterprise Owner),
I want to register new branches and assign branch owners to manage them,
so that I can expand my dental practice across multiple locations while maintaining centralized control.

Acceptance Criteria:
Walking Doctor can access "Manage Branches" dashboard from main navigation
"New Branch" form captures:
Branch Name
Location (Address, City, Country)
Contact Phone and Email
Branch Manager/Owner (assign existing staff or invite new)
Operating Hours (customizable)
Capacity (max clinics under this branch)
System validates branch name is unique within Walking Doctor's portfolio
Upon creation, branch is assigned a unique Branch ID
Branch Owner is notified via email with login credentials
Walking Doctor can view all branches in a list with:
Branch name, location, owner name
Status (Active, Suspended, Inactive)
Number of clinics under branch
Date created
Walking Doctor can edit branch details (name, contact, hours, owner reassignment)
Walking Doctor can suspend or deactivate branches (with confirmation)
Branch deactivation cascades permissions (clinics remain but inaccessible to staff)
Audit log records all branch creation, edit, and suspension actions
Business Rules:
Branch Owner role is mandatory; cannot have branch without owner
Branches are logical groupings; data is still isolated by clinic
Only Walking Doctor can create/delete branches

User Story 2: Create & Manage New Clinic Within Branch
As a Branch Owner,
I want to create new clinics within my branch,
so that I can expand my branch's operational footprint while maintaining operational standards.

Acceptance Criteria:
Branch Owner can access "Manage Clinics" within their branch dashboard
"New Clinic" form captures:
Clinic Name
Location (Address, City)
Clinic Owner (assign staff or invite new)
Clinical Specialties (General, Ortho, Pedo, Perio, Endo, etc.)
Capacity (max doctors, staff)
Operating Hours (inherit branch defaults or custom)
System validates clinic name is unique within branch
Clinic is assigned unique Clinic ID with prefix matching branch (e.g., BR01-CL001)
Clinic Owner is notified with login credentials
Branch Owner can view all clinics under their branch with:
Clinic name, location, owner
Active doctors and staff count
Patient count (YTD)
Revenue generated (YTD)
Branch Owner can edit clinic details (except deletion)
Walking Doctor can view all clinics across all branches (aggregated or filtered)
Business Rules:
Each Clinic is data-isolated tenant
Clinic Owner assigned automatically becomes Clinic Manager
Branch Owner cannot access patient-level data; only aggregate metrics
Clinic deactivation requires Walking Doctor approval

User Story 3: Hire & Manage Doctors and Operational Staff
As a Clinic Owner,
I want to hire and manage doctors and operational staff within my clinic,
so that I maintain appropriate staffing levels and ensure role-based responsibilities are clear.

Acceptance Criteria:
Clinic Owner can access "Manage Staff" within clinic dashboard
Staff hiring form captures:
Full Name, License #, Specialization (for doctors)
Role (Doctor, Front Desk, Hygienist, Assistant, Cashier, Cleaner)
Contact Information
Employment Status (Full-time, Part-time, Contract)
Hire Date
License expiration date (for clinical roles)
System validates license # is unique (no duplicate registrations)
System sends invitation email with temporary credentials
Staff member can reset password on first login
Clinic Owner can view staff list with:
Name, role, specialization, hire date
Status (Active, On-Leave, Suspended, Resigned)
Last login date (for activity tracking)
Clinic Owner can edit staff details (hours, schedule, role reassignment)
Clinic Owner can deactivate staff (soft delete; records retained for audit)
Staff manager can view their own profile and update personal info (phone, email)
Audit log tracks all staff changes (hire, update, deactivation)
Business Rules:
Doctors must have verified license # (future: integration with licensing board)
Staff role determines system permissions automatically
License expiration alerts sent 60 days before expiry
Deactivated staff cannot log in but records preserved for compliance



User Story 4: View Financial Reports & Revenue Analytics
As a Walking Doctor / Branch Owner / Clinic Owner,
I want to view financial reports and revenue analytics,
so that I can monitor business performance and make data-driven decisions.

Acceptance Criteria:
Owner dashboard displays "Financial Overview" widget with:
Total Revenue (YTD, MTD, custom date range)
Total Expenses (payroll, supplies, utilities - if tracked)
Net Profit
Average Revenue per Patient
Average Revenue per Doctor
Report filters available:
Date range (custom or preset: Today, This Week, This Month, YTD, All Time)
Branch (for Walking Doctor) / Clinic (for Branch/Clinic Owner)
Procedure type
Doctor/Staff member
Financial drill-down reports:
Revenue by Procedure: Line chart showing top 10 procedures and their contribution
Revenue by Doctor: Table showing total revenue generated per doctor
Daily Revenue Trend: Line chart showing revenue trends over time
Payment Method Breakdown: Pie chart (Cash vs. Insurance vs. Other)
Outstanding Invoices: Table of unpaid procedures/services
Export functionality:
PDF report with charts and summary
Excel file with detailed transaction data
Email report to stakeholders (configurable)
Comparison views:
Year-over-year (YoY) revenue comparison
Clinic-to-clinic comparison (for Branch Owner)
Budget vs. Actual (if budget module exists)
Alerts:
System flags unusual transaction patterns (e.g., high refunds, missing payments)
Low revenue alerts if daily total falls below threshold
Role-based visibility:
Walking Doctor sees all branch + clinic data
Branch Owner sees only their branch's clinics
Clinic Owner sees only their clinic
Business Rules:
Financial data calculated in real-time or daily snapshot (configurable for performance)
All calculations must match accounting standards (accrual or cash-based, configurable)
Reports must be auditable; every transaction traceable back to original entry
Walking Doctor can see rolling consolidated reports; Branch/Clinic Owners see only their scope

User Story 5: View Patient Handling Reports & Operational Metrics
As a Clinic Owner / Branch Owner / Walking Doctor,
I want to view reports on patient handling, appointment metrics, and operational insights,
so that I can optimize scheduling, identify bottlenecks, and improve patient experience.

Acceptance Criteria:
Owner dashboard displays "Patient & Operations Overview" with:
Total Active Patients (YTD new, monthly growth rate)
New Patients This Month
Appointment Volume (booked, completed, cancelled, no-show)
No-Show Rate (%)
Average Appointment Duration
Doctor Utilization Rate (%)
Patient drill-down reports:
Patient Demographics: Age distribution, gender distribution, location heatmap
Patient Acquisition: New patients by source (Referral, Walk-in, Online, Insurance)
Patient Retention: Returning patient percentage, patient churn rate
Treatment Plan Status: Active, Completed, On-Hold, Abandoned (count & %)
Procedure Popularity: Most booked procedures, top 10
Appointment & scheduling reports:
Doctor Schedule Utilization: % of available slots filled per doctor
Peak Hours Analysis: Busiest times of day/week
Appointment Type Breakdown: Cleaning vs. Treatment vs. Emergency
Wait Time Analysis: Average time from booking to appointment
Cancellation Reasons: Breakdown of why appointments cancelled
Operational insights:
Staff Performance: Patient count per doctor, appointment completion rate
Clinic Capacity Utilization: Current vs. max capacity per day/week
Treatment Plan Acceptance Rate: % of patients accepting treatment plans vs. declining
Alerts & anomalies:
High cancellation rate (threshold-based)
Doctor overbooking or idle time
Patients with overdue treatment plans
Recurring patient issues (e.g., frequent no-shows)
Business Rules:
Walking Doctor views aggregated metrics across branches
Branch Owner views aggregated metrics across clinics in branch
Clinic Owner views their clinic-specific metrics
No-show defined as appointment time passed without patient check-in
Metrics calculated daily; real-time dashboards update hourly

User Story 6: Access Strategic Business Insights & Decision Support
As a Walking Doctor / Branch Owner,
I want to access strategic business insights and predictive analytics,
so that I can identify growth opportunities, optimize resource allocation, and make informed business decisions.

Acceptance Criteria:
Owner dashboard displays "Business Intelligence" section with:
Key Performance Indicators (KPIs): Customizable dashboard showing top metrics
Revenue Forecast: Projected revenue for next 30/90/180 days (trend-based)
Patient Trend Analysis: Projected patient growth/decline
Doctor Productivity Ranking: Top performers, underperformers
Procedure Profitability: Revenue vs. cost by procedure type
Market Insights: Patient demographics vs. local market data (future)
Predictive alerts:
Identifies at-risk patients (low appointment frequency, declining treatment completion)
Flags underutilized doctors (low appointment bookings)
Alerts to supply chain issues (if inventory tracked)
Predicts seasonal trends (busy vs. slow periods)
Benchmarking:
Clinic performance comparison (for Branch/Walking Doctor)
Doctor productivity benchmarks (internal)
Industry benchmarks (if available via third-party data)
Growth opportunity identification:
Underexploited procedure types (low volume but high margin)
Underserved patient demographics
Geographic expansion recommendations (branch level)
Resource optimization:
Staffing recommendations (hire/reassign based on utilization)
Scheduling optimization (reduce idle time, balance workload)
Supply chain optimization (cost reduction, supplier analysis)
Custom report builder:
Drag-and-drop report creation
Save and schedule recurring reports
Share reports with team
Business Rules:
Predictions based on historical data only (minimum 3 months data required)
Benchmarks are internal only unless external data source integrated
Walking Doctor can access all clinics' insights; Branch/Clinic Owners see only their scope
Confidential metrics (e.g., doctor income) hidden from junior staff

User Story 7: Manage Branch Owners & Assign Ownership Hierarchy
As a Walking Doctor,
I want to assign and manage branch owners, and define their permissions,
so that I maintain control over my organization while delegating operational management.

Acceptance Criteria:
Walking Doctor can access "Ownership Management" console
Invite or assign existing staff as Branch Owner:
Enter email or select from staff directory
Assign to specific branch(es)
Set permission level (Full Control, Limited, Read-Only)
Permission levels:
Full Control: Can manage clinics, staff, finances within branch; cannot manage other branches
Limited: Can manage clinics and staff; cannot modify financials or branch settings
Read-Only: View-only access to reports and dashboards
Walking Doctor can view ownership structure:
Tree view showing Walking Doctor → Branches → Clinics → Staff
Each level shows assigned owner/manager
Walking Doctor can reassign branch ownership:
Select branch and reassign to different owner
Transition period allows old owner to hand off data
Audit log records ownership change
Walking Doctor can set company-wide policies:
Approval workflows (e.g., treatment plans, staff hiring)
Pricing templates
Scheduling rules (e.g., min appointment duration, max bookings per doctor)
Compliance checkpoints (HIPAA training, license renewal reminders)
Delegation audit trail:
All ownership changes logged with timestamps and reasons
Business Rules:
Walking Doctor cannot delegate their role (can only have one Walking Doctor per entity)
Branch Owner must be a confirmed staff member first
Permission changes effective immediately or on scheduled date (configurable)
Walking Doctor retains override capability on all decisions

User Story 8: Create Multi-Clinic Strategic Reports & Compliance Audits
As a Walking Doctor,
I want to generate compliance audits, data integrity reports, and cross-clinic performance summaries,
so that I ensure regulatory adherence and maintain organizational health.

Acceptance Criteria:
Walking Doctor can generate "Compliance Audit Report" including:
HIPAA compliance checklist (access logs, data encryption, breach incidents)
Data backup verification (frequency, success rate)
License verification status (all doctors, all clinics)
Training completion status (HIPAA, bloodborne pathogen, etc.)
Incident log (security breaches, patient complaints, system errors)
Performance comparison reports:
Clinic-to-clinic KPI comparison (revenue, patient count, utilization)
Branch-to-branch performance ranking
Year-over-year growth analysis per clinic
Seasonal trend analysis across enterprise
Data integrity reports:
Missing or incomplete patient records
Orphaned or unlinked appointments
Billing discrepancies (procedures billed but not documented)
Duplicate patient records flagged for cleanup
Scheduling analysis:
Doctor availability gaps across branches
Peak demand periods and capacity constraints
Clinic overlap in service areas (potential consolidation opportunities)
Financial consolidation reports:
Aggregate revenue by branch, clinic, doctor, procedure
Cost center analysis (if applicable)
Profitability by business unit
Export & distribution:
Generate PDF or Excel reports
Email to stakeholders on schedule (daily, weekly, monthly)
Archive reports for audit trail
Business Rules:
Compliance reports generated on demand or scheduled (weekly/monthly)
All data anonymized except for management review (no patient names in shared reports)
Audit reports cannot be deleted (compliance archive)
Walking Doctor can delegate report generation to admin staff

Functional Requirements Specification
FR7: Branch Management
Requirement ID
Requirement
Priority
Type
FR7.1
Walking Doctor shall create new branch with location and owner assignment
High
Functional
FR7.2
System shall validate branch name uniqueness within Walking Doctor portfolio
High
Functional
FR7.3
System shall assign unique Branch ID upon creation
High
Functional
FR7.4
Walking Doctor shall view all branches in list/map view
High
Functional
FR7.5
Branch Owner shall manage clinics only within assigned branch
High
Functional
FR7.6
System shall prevent cross-branch data access (data isolation)
High
Functional
FR7.7
Walking Doctor shall edit branch details and reassign branch owner
Medium
Functional
FR7.8
System shall log all branch creation, edit, suspension actions
High
Functional


FR8: Clinic Creation & Management
Requirement ID
Requirement
Priority
Type
FR8.1
Branch Owner shall create new clinic within branch
High
Functional
FR8.2
System shall assign unique Clinic ID with branch prefix
High
Functional
FR8.3
System shall isolate clinic data from other clinics in same branch
High
Functional
FR8.4
Walking Doctor shall view all clinics across all branches
High
Functional
FR8.5
Clinic Owner shall manage only their assigned clinic's data
High
Functional
FR8.6
System shall prevent clinic access outside ownership scope
High
Functional
FR8.7
Branch/Walking Doctor shall view clinic capacity and utilization metrics
Medium
Functional


FR9: Staff Management & Hiring
Requirement ID
Requirement
Priority
Type
FR9.1
Clinic Owner shall hire doctors and operational staff with role assignment
High
Functional
FR9.2
System shall validate license # uniqueness for licensed roles
High
Functional
FR9.3
System shall send invitation email with temp credentials
High
Functional
FR9.4
System shall auto-expire temp credentials and enforce password reset
High
Functional
FR9.5
Clinic Owner shall deactivate staff (soft delete) without removing historical records
High
Functional
FR9.6
System shall alert 60 days before license expiration
Medium
Functional
FR9.7
Staff member shall view/edit own profile only
High
Functional
FR9.8
System shall log all staff hire, update, deactivation actions
High
Functional


FR10: Financial Reporting & Analytics
Requirement ID
Requirement
Priority
Type
FR10.1
System shall calculate and display total revenue, expenses, net profit
High
Functional
FR10.2
System shall support custom date range filtering (Today, MTD, YTD, custom)
High
Functional
FR10.3
System shall generate revenue by procedure, doctor, payment method reports
High
Functional
FR10.4
System shall calculate rolling metrics (30, 60, 90 day trends)
Medium
Functional
FR10.5
System shall support PDF and Excel export of financial reports
Medium
Functional
FR10.6
System shall enforce role-based financial data visibility (no cross-clinic data)
High
Functional
FR10.7
System shall flag unusual transaction patterns (high refunds, missing payments)
Medium
Functional
FR10.8
Walking Doctor shall view consolidated financial data across all branches
High
Functional
FR10.9
Branch Owner shall view aggregated financials across branch clinics
High
Functional
FR10.10
Clinic Owner shall view only their clinic's financials
High
Functional


FR11: Patient & Operational Reporting
Requirement ID
Requirement
Priority
Type
FR11.1
System shall calculate and display total active patients, new patients, growth rate
High
Functional
FR11.2
System shall track appointment volume (booked, completed, cancelled, no-show)
High
Functional
FR11.3
System shall calculate no-show rate and cancellation rate by reason
High
Functional
FR11.4
System shall generate patient demographics report (age, gender, location)
Medium
Functional
FR11.5
System shall track patient acquisition source (referral, walk-in, online, insurance)
Medium
Functional
FR11.6
System shall calculate doctor utilization rate (% booked vs. available slots)
High
Functional
FR11.7
System shall generate treatment plan status breakdown (active, completed, on-hold)
High
Functional
FR11.8
System shall identify at-risk patients (low frequency, declining completion)
Medium
Functional
FR11.9
Clinic Owner shall view clinic-specific metrics only
High
Functional
FR11.10
Walking Doctor shall view aggregated metrics across all clinics
High
Functional


FR12: Strategic Business Intelligence
Requirement ID
Requirement
Priority
Type
FR12.1
System shall generate revenue forecast for 30/90/180 days
Medium
Functional
FR12.2
System shall identify procedure profitability (revenue vs. cost)
Medium
Functional
FR12.3
System shall rank doctor productivity with top/underperformer alerts
Medium
Functional
FR12.4
System shall predict at-risk patients and flag for retention
Low
Functional
FR12.5
System shall suggest resource optimization (staffing, scheduling)
Low
Functional
FR12.6
System shall support custom report builder (drag-and-drop)
Low
Functional
FR12.7
System shall provide clinic-to-clinic and doctor benchmarking
Medium
Functional
FR12.8
System shall support scheduled report generation and email distribution
Medium
Functional


FR13: Ownership & Permissions Management
Requirement ID
Requirement
Priority
Type
FR13.1
Walking Doctor shall assign and manage Branch Owners
High
Functional
FR13.2
System shall define permission levels (Full Control, Limited, Read-Only)
High
Functional
FR13.3
System shall enforce role-based access control (RBAC)
High
Functional
FR13.4
System shall enforce ownership-based access control (OBAC)
High
Functional
FR13.5
Branch Owner shall access only assigned branches and clinics
High
Functional
FR13.6
Clinic Owner shall access only assigned clinic
High
Functional
FR13.7
System shall log all permission changes with audit trail
High
Functional
FR13.8
Walking Doctor shall set company-wide policies and templates
Medium
Functional


FR14: Compliance & Audit Reporting
Requirement ID
Requirement
Priority
Type
FR14.1
System shall generate HIPAA compliance audit report
High
Functional
FR14.2
System shall verify data backup status and frequency
High
Functional
FR14.3
System shall verify license status for all doctors, staff
High
Functional
FR14.4
System shall generate incident log (breaches, errors, complaints)
High
Functional
FR14.5
System shall detect data integrity issues (missing records, duplicates)
Medium
Functional
FR14.6
System shall generate cross-clinic performance comparison reports
High
Functional
FR14.7
System shall archive audit reports (no deletion)
High
Functional
FR14.8
System shall anonymize patient data in shared reports (no PII)
High
Functional


Role-Based Access Control (RBAC) + Ownership-Based Access Control (OBAC) Matrix
Walking Doctor (Level 0: Grand Parent)
Feature
Permission
Scope
Create Branch
Create/Edit/Delete
Unlimited
Manage Branch Owners
Assign/Remove
All branches
View Branch Data
Read All
All branches
Create Clinic
Delegate to Branch Owners
N/A
View Clinic Data
Read All
All clinics across all branches
View Patient Data
Read All (Aggregated)
No individual PII by default
View Financial Data
Read All
All branches, consolidated
View Operational Metrics
Read All (Aggregated)
All clinics
Set Company Policies
Create/Edit
All clinics inherit
Generate Audit Reports
Create/Export
All clinics
Manage Compliance
Monitor/Escalate
All clinics
Access Level
Super Admin
Enterprise-wide


Branch Owner (Level 1: Parent)
Feature
Permission
Scope
Create Clinic
Create/Edit
Assigned branch only
Manage Clinic Owners
Assign/Remove
Assigned branch only
View Clinic Data
Read (Aggregated)
Assigned branch clinics only
View Patient Data
Read (Aggregated)
No individual PII access
View Financial Data
Read (Aggregated)
Assigned branch only
View Operational Metrics
Read (Aggregated)
Assigned branch clinics
Hire Staff
N/A (Clinic Owner role)
N/A
Access Reports
Limited (Branch-level)
Assigned branch only
Access Level
Branch Manager
Single branch scope


Clinic Owner (Level 2: Child)
Feature
Permission
Scope
Manage Doctors/Staff
Hire/Edit/Deactivate
Assigned clinic only
View Patient Data
Read (Full)
Assigned clinic patients only
View Appointment Data
Read/Manage
Assigned clinic only
View Billing Data
Read (Clinic-level)
Assigned clinic only
View Financial Data
Read (Clinic-level)
Assigned clinic only
View Operational Metrics
Read (Full)
Assigned clinic only
Access Reports
Clinic-level only
Assigned clinic only
Access Level
Clinic Manager
Single clinic scope


Doctor (Level 3: Grand Child)
Feature
Permission
Scope
View Patient Data
Read (Assigned only)
Patients under their care
Manage Treatment Plans
Create/Edit/Approve
Assigned patients
View Appointments
Read/Manage
Own schedule only
View Financial Data
Read (Own revenue)
Personal productivity metrics
Access Reports
None (Dashboard only)
Personal metrics
Access Level
Clinical Staff
Own patient load


Operational Staff (Level 3: Grand Child)
Feature
Permission
Scope
View Patient Data
Read (Basic)
Assigned patients (front desk, hygienist)
Manage Appointments
Create/Edit/Cancel
Clinic appointments
Process Payments
Cash/Insurance
Clinic transactions
View Financial Data
None
No access
Access Reports
None (Dashboard only)
Daily task list only
Access Level
Clinic Staff
Clinic operations only


Data Flow Diagram: Owner Dashboard & Multi-Tenant Access
┌──────────────────────────────────────────────────────────┐
│         OWNER LOGIN & ROLE DETECTION                    │
│  (User email + Organization context)                    │
└──────────────────┬───────────────────────────────────────┘
                   │
        ┌──────────┼──────────┐
        │          │          │
        ▼          ▼          ▼
    ┌─────────┐ ┌──────────┐ ┌─────────┐
    │Walking  │ │Branch    │ │Clinic   │
    │Doctor   │ │Owner     │ │Owner    │
    └────┬────┘ └────┬─────┘ └────┬────┘
         │           │            │
         ▼           ▼            ▼
    ┌────────────────────────────────────────────────┐
    │  ROLE-BASED & OWNERSHIP-BASED QUERY FILTER    │
    │  (Apply WHERE clauses to all data queries)    │
    └─────────────┬────────────────────────────────┘
                  │
        ┌─────────┼─────────┐
        │         │         │
        ▼         ▼         ▼
    ┌──────┐ ┌────────┐ ┌──────────┐
    │ALL   │ │ASSIGNED│ │ASSIGNED  │
    │DATA  │ │BRANCHES│ │CLINIC    │
    │SCOPE │ │& CLINICS│ │ONLY      │
    └──────┘ └────────┘ └──────────┘
        │         │         │
        └─────────┼─────────┘
                  │
                  ▼
    ┌────────────────────────────────────────┐
    │    OWNER DASHBOARD                    │
    │  (Widgets, Reports, Analytics)        │
    │  (Data shown per role scope)           │
    └────────────────────────────────────────┘
         │           │           │
         ▼           ▼           ▼
    ┌─────────┐ ┌─────────┐ ┌──────────┐
    │Financial│ │Patient &│ │Strategic │
    │Reports  │ │Ops      │ │Analytics │
    │         │ │Reports  │ │          │
    └─────────┘ └─────────┘ └──────────┘



Non-Functional Requirements (NFRs) - Multi-Tenant
NFR ID
Requirement
Target
Rationale
NFR9
Data Isolation (Clinic-level)
100% enforcement
Security & Compliance
NFR10
Multi-tenant query latency
<2 sec (aggregated)
User experience
NFR11
Concurrent owners per clinic
10+ simultaneous
Scalability
NFR12
Ownership hierarchy levels
Support 4 levels deep
System design
NFR13
Cross-tenant data access
0% leakage (audited)
Security critical
NFR14
Financial report accuracy
100% reconciliation
Audit compliance
NFR15
Role permission load time
<1 sec
Admin experience
NFR16
Audit log completeness
100% of actions logged
Compliance
NFR17
Dashboard refresh rate
Real-time or 1-hour snapshot
Configurable per clinic
NFR18
Export file generation
<30 sec for large reports
Performance


Implementation Checklist: Multi-Tenant RBAC + OBAC
Phase 1: Infrastructure (Weeks 1-3)
[ ] Design tenant isolation strategy (database schemas: shared vs. separate)
[ ] Implement authentication layer (login, role detection)
[ ] Create RBAC middleware (permission validation per request)
[ ] Implement OBAC middleware (ownership validation per query)
[ ] Set up audit logging (all data access and modifications)
[ ] Configure database encryption (data at rest)
Phase 2: Owner-Level Features (Weeks 4-6)
[ ] Build Branch management module (create, edit, assign owners)
[ ] Build Clinic creation module (scope to branches)
[ ] Implement staff hiring workflow (doctors & operational staff)
[ ] Create ownership hierarchy view (tree structure)
[ ] Build permission management console
Phase 3: Reporting & Analytics (Weeks 7-9)
[ ] Implement financial reporting engine (revenue, expenses, trends)
[ ] Build patient/operational reporting
[ ] Implement strategic business intelligence dashboard
[ ] Create compliance audit report generator
[ ] Build custom report builder
Phase 4: Testing & Deployment (Weeks 10-12)
[ ] Multi-tenant data isolation testing
[ ] Role-based access control testing (all role combinations)
[ ] Ownership hierarchy testing (permission enforcement)
[ ] Financial accuracy testing (reconciliation)
[ ] Performance testing (concurrent users, large data sets)
[ ] Security testing (penetration, cross-tenant access attempts)
[ ] UAT with pilot clinics/owners



Security & Compliance Considerations
HIPAA Compliance
✓ Patient data encrypted (AES-256)
✓ Access logs maintained (2+ years)
✓ Audit trail for all data access
✓ Role-based access controls
✓ Automatic session timeout (15 min inactivity)
✓ Breach notification capability
Data Privacy (GDPR/India DPA)
✓ Data subject access requests (DSAR) automatable
✓ Right to be forgotten support (clinic-level deletion)
✓ Data portability export (standard formats)
✓ Consent management (tracked & timestamped)
✓ Third-party processor agreements (vendors)
Multi-Tenant Security
✓ Complete data isolation per tenant (clinic)
✓ No shared patient data across clinics
✓ Ownership-based query filtering (every request)
✓ Cross-tenant access attempt logging
✓ Automatic role downgrade on access violation attempt

Assumptions & Dependencies
Assumptions:
Walking Doctor can own unlimited branches; each branch can own unlimited clinics
Each clinic is independently managed (no shared resources between clinics in same branch)
Financial data is consolidated in real-time or daily snapshot (configurable)
Patient data is never visible at Branch/Walking Doctor level (only aggregates)
Ownership cannot be transferred mid-operation (only deactivation + reassignment)
All owners have verified email and must set strong passwords on first login
Staff hiring requires clinic owner approval (no self-registration for staff roles)
If a patient using their patient record number come to other clinic within walking doctors the patients data can be extracted with consent of the patients, proof with BOD & KTP number that paatient need to bring when signup in other clinic in the network of Walking doctors


Dependencies:
Authentication Service (login, session management)
Authorization Service (RBAC + OBAC enforcement)
Database (multi-tenant schema design)
Audit Logging Service (compliance tracking)
Notification Service (email for invitations, alerts)
Reporting Engine (analytics, KPI calculations)
Encryption Service (data protection)

Version Control & Document History
Version
Date
Author
Changes
1.0
Oct 2025
IT Business Analyst
Initial Owner role documentation, multi-tenant RBAC/OBAC, hierarchical ownership model
—
—
—
Ready for refinement and stakeholder feedback


Document Classification: Internal Use
 Audience: Development Team, Product Management, Clinic Owners, Walking Doctors
 Next Review Date: Upon stakeholder feedback & design approval
 Status: Draft - Awaiting Clarification

