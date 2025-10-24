# Role-Based Dashboard System
## Multi-Role EHR Interface

---

## 🎭 Overview

The EHR system supports multiple user roles. This document focuses on the 5 key roles used in this system:

1. Doctors — Examinations, Procedures, Prescriptions
2. Front Desk — Billing, Scheduling
3. Clinic PIC (Person In Charge) — Clinic-level operations, Staff management, Procedure oversight
4. Branch Owner — Manages single or multiple clinics; full access to all Clinic PIC privileges across clinics
5. Super Admin (Walking Doctors) — Highest-level authority; can create all user types and access all functions

Each role has a specialized dashboard and navigation tailored to its responsibilities and permissions.

For a concise summary of permissions across these roles, see: ROLE_PERMISSIONS_MATRIX.md.
For terminology mapping across code and docs, see: ROLE_GLOSSARY.md.

---

## 👥 User Roles

### 1. **Doctor** (Clinical Focus)
**Primary Responsibilities:**
- Clinical examinations
- Diagnosis and treatment planning
- Patient medical records
- Prescriptions

**Dashboard Features:**
- ✅ Today's appointments (8 patients)
- ✅ Completed procedures count
- ✅ Critical medical alerts (allergies, X-ray reviews)
- ✅ Recent patients quick access
- ✅ Monthly revenue overview

**Sidebar Navigation:**
- Dashboard
- Patients
- Appointments
- Reports
- Procedures
- Settings

**Key Metrics:**
- Appointments today
- Completed procedures
- Total patients
- Monthly revenue

---

### 2. **Treatment Coordinator** (Treatment Acceptance Focus)
**Primary Responsibilities:**
- Review new treatment plans from doctors
- Present treatment plans to patients
- Track treatment acceptance/decline
- Follow up on pending treatments
- Manage payment discussions

**Dashboard Features:**
- ✅ Pending treatment plans requiring review (3 new)
- ✅ High-value plan alerts (>Rp 5M)
- ✅ Follow-up queue with aging (30d, 45d)
- ✅ Weekly acceptance rate tracking (76%)
- ✅ Conversion metrics

**Sidebar Navigation:**
- Dashboard
- Patients
- Treatment Plans
- Appointments
- Follow-ups
- Reports
- Settings

**Key Metrics:**
- Plans needing review
- Accepted this week
- Acceptance rate %
- Follow-ups needed

**Workflow:**
1. Dentist completes exam → Creates treatment plan
2. TC receives alert: "New high-value plan ready"
3. TC reviews plan and odontogram
4. TC presents to patient with educational materials
5. Patient accepts/declines/postpones
6. If accepted → Schedule appointments
7. If declined → Add to follow-up queue with reason
8. System tracks conversion funnel

---

### 3. **Front Desk** (Operations & Billing Focus)
**Primary Responsibilities:**
- Check-in/check-out
- Appointment scheduling
- Payment collection
- Billing management
- Insurance verification

**Dashboard Features:**
- ✅ Checkout queue (patients waiting for checkout)
- ✅ Upcoming appointments with payment status
- ✅ Today's payments log (Rp 8.4M)
- ✅ Outstanding balances (Rp 45M)
- ✅ Overdue accounts tracking

**Sidebar Navigation:**
- Dashboard
- Appointments
- Patients
- Billing
- Payments
- Reports
- Settings

**Key Metrics:**
- Appointments today (12)
- Checked in (4)
- Payments collected (Rp 8.4M)
- Outstanding balance (Rp 45M)

**Workflow:**
1. Patient arrives → Check-in
2. Treatment completed → Checkout queue alert
3. Process payment for today's services
4. Collect deposit for future treatment
5. Schedule next appointment
6. Print receipt and treatment summary
7. Send confirmation SMS

---

### 3. **Clinic PIC (Person In Charge)** (Clinic Operations & Oversight)
**Primary Responsibilities:**
- Clinic-level operations oversight
- Staff management and scheduling supervision
- Procedure oversight (approval and compliance)
- Financial and billing oversight at clinic level
- High-level intervention when needed

**Dashboard Features:**
- ✅ Revenue trends (6-month chart)
- ✅ Treatment acceptance pie chart
- ✅ Procedure mix analysis
- ✅ Top performing dentists
- ✅ Key practice metrics (retention, AR, no-show rate)
- ✅ Chair utilization (78%)
- ✅ Pending treatment value (Rp 145M)

**Sidebar Navigation:**
- Dashboard
- Analytics
- Revenue
- Patients
- Appointments
- Reports
- Procedures
- Settings

**Key Metrics:**
- Monthly revenue (Rp 780M) +8.3%
- Active patients (1,247) +4.1%
- Avg transaction (Rp 2.4M) +14.3%
- Monthly appointments (342)

**Advanced Metrics:**
- New patients this month: 42 (+12%)
- Patient retention: 89% (+3%)
- Days in AR: 28 days (-4d)
- No-show rate: 4.2% (-1.3%)
- Chair utilization: 78%
- Collection rate: 94%

---

### 4. **Branch Owner** (Multi-Clinic Management)
**Primary Responsibilities:**
- Manage one or multiple clinics within a branch
- Full access to all Clinic PIC privileges across clinics
- Cross-clinic staff assignment and oversight
- Branch-level analytics and financial reporting

**Dashboard Features:**
- Aggregated metrics across clinics (appointments, revenue, treatments)
- Branch list with per-clinic KPIs and drilldowns
- Cross-clinic staff management and scheduling oversight
- Procedure oversight at branch level (approvals, compliance)
- Financial health monitoring across clinics

**Permissions:**
- View PII: Yes
- Perform Clinical Actions: Limited (oversight/approval)
- Manage Staff: Yes (across clinics)
- View Financial Reports: Yes (branch-wide)
- Create Users: Yes (can create Clinic PIC and staff roles)
- Access All Functions: Broad administrative access across assigned clinics

---

### 5. **Super Admin (Walking Doctors)** (Enterprise Control & Mobile Practice)
**Primary Responsibilities:**
- Mobile practitioner capabilities (examinations, procedures, prescriptions) across clinics
- Highest-level authority over system configuration and governance
- Create and manage all user types and roles
- Global policy management, auditing, and data governance

**Dashboard Features:**
- Enterprise-level overview (system health, usage, compliance)
- User & role management (create/assign/revoke across all clinics)
- Global settings and policy control
- Full clinical capabilities across clinics when acting as a walking doctor

**Permissions:**
- View PII: Yes (system-wide)
- Perform Clinical Actions: Yes (examinations, procedures, prescriptions)
- Manage Staff: Yes (system-wide)
- View Financial Reports: Yes (global)
- Create Users: Yes (all roles)
- Access All Functions: Yes

---

## 🔄 Role Switching

### How to Switch Roles

1. Click on the **user profile area** in the top-right header
2. A popover appears showing all relevant roles
3. Click on the desired role
4. Dashboard and sidebar instantly update to that role's view

### Visual Indicators

Each role has a distinct icon and color:
- 👨‍⚕️ **Doctor**: Blue (User icon)
- 💰 **Front Desk**: Green (DollarSign icon)
- 🏥 **Clinic PIC**: Slate (Building icon)
- 🏢 **Branch Owner**: Sky (Building2 icon)
- 🛡️ **Super Admin (Walking Doctors)**: Indigo (ShieldCheck icon)

### State Behavior

- When switching roles, the view **resets to that role's dashboard**
- Selected patient data is preserved
- Active navigation state updates to role-specific menu

---

## 🎯 Role-Specific Workflows

### Doctor → Treatment Coordinator Handoff

```
DOCTOR:
1. Complete exam in ExamWorkflow
2. Chart findings on odontogram
3. Add procedures to treatment plan
4. Mark urgency/priority
5. Click "Complete Exam"

SYSTEM:
- Saves exam data
- Analyzes treatment plan value
- Routes to TC if high-value (>Rp 5M)
- Creates notification

TREATMENT COORDINATOR:
6. Receives alert: "New high-value plan - Rizky Pratama"
7. Reviews on TC Dashboard
8. Clicks "Present to Patient"
9. Shows visual odontogram
10. Discusses payment options
11. Patient accepts → Schedule
12. Patient declines → Add to follow-up queue
```

### Treatment Coordinator → Front Desk Handoff

```
TREATMENT COORDINATOR:
1. Patient accepts treatment plan
2. Clicks "Schedule Appointments"
3. Treatment plan marked as "Accepted"

SYSTEM:
- Notifies Front Desk
- Opens scheduling interface
- Pre-fills procedures and duration

FRONT DESK:
4. Receives notification
5. Books appointment(s)
6. Collects deposit
7. Sends confirmation
8. Updates billing system
```

### Front Desk → Clinic PIC Reporting

```
FRONT DESK:
- Daily: Check-in/out patients
- Daily: Collect payments
- Daily: Schedule appointments

SYSTEM:
- Aggregates daily data
- Updates analytics in real-time

CLINIC PIC:
- Views clinic-level dashboard metrics
- Analyzes clinic revenue trends
- Reviews staff performance
- Makes clinic-level decisions based on data
```

---

## 📊 Dashboard Comparison

| Feature | Doctor | TC | Front Desk | Clinic PIC |
|---------|--------|----|-----------:|-------|
| **Primary Focus** | Clinical | Acceptance | Operations | Analytics |
| **Today's Schedule** | ✅ | ✅ | ✅ | ❌ |
| **Treatment Plans** | Create | Review/Present | - | View metrics |
| **Payments** | ❌ | Discussion | ✅ Collect | ✅ Analyze |
| **Analytics** | Basic | Acceptance rate | Daily totals | ✅ Advanced |
| **Charts/Graphs** | ❌ | ❌ | ❌ | ✅ Multiple |
| **Follow-ups** | ❌ | ✅ Manage | ❌ | ✅ View stats |

---

## 🛠️ Technical Implementation

### File Structure

```
/components
  /pages
    Dashboard.tsx                      ← Doctor dashboard
    TreatmentCoordinatorDashboard.tsx  ← TC dashboard
    FrontDeskDashboard.tsx             ← Front desk dashboard
    OwnerDashboard.tsx                 ← Clinic PIC (Owner in code) dashboard
  /molecules
    RoleSwitcher.tsx                   ← Role switching component
  /organisms
    Header.tsx                         ← Updated with RoleSwitcher
    Sidebar.tsx                        ← Role-aware menu
```

### State Management

```typescript
// App.tsx
const [currentRole, setCurrentRole] = useState<UserRole>("doctor");

const handleRoleChange = (role: UserRole) => {
  setCurrentRole(role);
  setActiveView("dashboard"); // Reset to dashboard
};
```

### Role-Based Rendering

```typescript
// Sidebar menu items determined by role
const menuItemsByRole: Record<UserRole, MenuItem[]> = {
  doctor: [...],
  "treatment-coordinator": [...],
  "front-desk": [...],
  owner: [...] // treated as Clinic Owner (Clinic PIC) in this demo
};

// Dashboard rendering based on role
switch (currentRole) {
  case "doctor": return <Dashboard />;
  case "treatment-coordinator": return <TreatmentCoordinatorDashboard />;
  case "front-desk": return <FrontDeskDashboard />;
  case "owner": return <OwnerDashboard />; // Clinic PIC (Owner) view
}
```

---

## 🎨 Design Consistency

All dashboards maintain:
- ✅ Same color palette (blue, teal, white)
- ✅ Same card-based design
- ✅ Same typography system
- ✅ Indonesian localization (Rp currency)
- ✅ Consistent spacing and layout grid

---

## 🚀 Future Enhancements

### Phase 2: Role Permissions
- [ ] Restrict certain actions by role
- [ ] Audit log of role switches
- [ ] Custom role creation

### Phase 3: Multi-User Support
- [ ] Multiple users can be logged in
- [ ] Real-time collaboration
- [ ] User-specific preferences

### Phase 4: Advanced Analytics
- [ ] Role-specific KPI tracking
- [ ] Performance benchmarking by role
- [ ] Custom dashboards per user

---

## 📝 Usage Guide

### For Testing

1. **Start as Doctor** (default)
   - View clinical dashboard
   - See today's appointments
   - Access patient records

2. **Switch to Treatment Coordinator**
   - Click user profile (top-right)
   - Select "Treatment Coordinator"
   - See pending treatment plans

3. **Switch to Front Desk**
   - Click user profile
   - Select "Front Desk"
   - See checkout queue and payments

4. **Switch to Clinic PIC (Owner)**
   - Click user profile
   - Select "Owner" (Clinic PIC view)
   - See clinic-level analytics and charts

### For Development

Each role's dashboard is a separate component that can be developed independently:
- Mock data is already included
- Charts use Recharts library
- All use same design system
- Easy to add new features per role

---

**The role-based system ensures that each team member sees exactly what they need to do their job effectively, reducing cognitive load and improving workflow efficiency.**

---

**Document Version**: 1.0  
**Last Updated**: October 17, 2025
