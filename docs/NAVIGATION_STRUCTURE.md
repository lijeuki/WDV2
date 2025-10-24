# Navigation Structure - Dental EHR System

## Overview

The navigation has been streamlined to show only parent menus in the sidebar. Child pages (like Enhanced Dental Charting, Treatment Plans, and regular Dental Charting) are now accessible through the patient workflow, ensuring proper context and patient-specific data.

Note on roles: The application distinguishes five key roles (Doctors, Front Desk, Clinic PIC, Branch Owner, Super Admin). Sidebar visibility, dashboard content, and quick actions are filtered based on the current role's permissions. See ROLE_GLOSSARY.md for terminology mapping (e.g., Receptionist = Front Desk; Clinic Owner = Clinic PIC).

---

## 📋 Main Menu (Sidebar)

### Parent Menus Only

```
┌─────────────────────────────┐
│   CLINIC CIPTA SEHAT        │
│   Dentistry & Surgery       │
├─────────────────────────────┤
│                             │
│  📊 Dashboard               │
│  👥 Patients                │
│  📅 Appointments            │
│  📄 Reports                 │
│  ⚡ Procedures              │
│  ⚙️  Settings               │
│                             │
├─────────────────────────────┤
│  Last sync: Today 10:45 AM  │
│  🚪 Logout                  │
└─────────────────────────────┘
```

---

## 🔄 Navigation Flow

### 1️⃣ Dashboard → Patient Profile

```
Dashboard
  ↓
  Click on appointment card / patient card
  ↓
Patient Profile (with patient context)
```

### 2️⃣ Patients Menu → Patient Profile

```
Sidebar: Patients
  ↓
Patients Directory (list of all patients)
  ↓
  Click on specific patient
  ↓
Patient Profile (with patient context)
```

### 3️⃣ Patient Profile → Enhanced Dental Charting

```
Patient Profile
  ↓
  Click "Enhanced Dental Chart" quick action
  ↓
Enhanced Dental Charting Page
  (with patient name and ID context)
```

### 4️⃣ Patient Profile → Treatment Plans

```
Patient Profile
  ↓
  Click "Treatment Plans" quick action
  ↓
Treatment Plans Page
  (with patient name and ID context)
```

---

## 🗂️ Page Hierarchy

### Level 1: Main Menu (Accessible from Sidebar)

- **Dashboard** - Overview of daily appointments and alerts
- **Patients** - Full patient directory with search
- **Appointments** - Calendar and scheduling
- **Reports** - Analytics and insights
- **Procedures** - Procedure library
- **Settings** - System configuration

### Level 2: Patient Context Pages (Accessible from Patient Profile)

- **Patient Profile** - Detailed patient information
  - Contact information
  - Medical history
  - Dental history
  - Insurance details
  - Billing information
  - Documents

### Level 3: Patient-Specific Tools (Accessible from Patient Profile Quick Actions)

- **Enhanced Dental Charting** - Surface-based FDI notation charting
- **Dental Charting** - Standard dental charting
- **Treatment Plans** - Patient-specific treatment planning
- **Generate Reports** - Patient-specific reports

---

## 🎯 Quick Actions in Patient Profile

When viewing a patient profile, users have access to these quick actions:

```
┌──────────────────────────────────────────────────────────┐
│  Quick Actions                                           │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  [📅]                [⚡]                 [📋]           │
│  Schedule            Enhanced            Treatment       │
│  Appointment         Dental Chart        Plans           │
│                                                          │
│  [📄]                                                    │
│  Generate                                                │
│  Reports                                                 │
└──────────────────────────────────────────────────────────┘
```

---

## 🔙 Back Navigation

### Navigation Hierarchy

```
Dashboard (Home)
  ├─ Patients Directory
  │    └─ Patient Profile
  │         ├─ Enhanced Dental Charting  ──→ Back to Patients
  │         ├─ Dental Charting           ──→ Back to Patients
  │         └─ Treatment Plans           ──→ Back to Patients
  │
  ├─ Appointments
  ├─ Reports
  ├─ Procedures
  └─ Settings
```

### Back Button Behavior

- **From Patient Profile** → Returns to Patients Directory
- **From Enhanced Dental Charting** → Returns to Patients Directory
- **From Dental Charting** → Returns to Patients Directory
- **From Treatment Plans** → Returns to Patients Directory

> This ensures users can easily navigate back to the patient list to select another patient.

---

## 📊 Patients Directory Features

The Patients page now includes:

### Stats Overview
- Total Patients
- Active Patients
- New This Month
- Patients with Medical Alerts

### Patient List
Each patient card shows:
- **Patient Name** with avatar initials
- **Status Badge** (Active, Pending, Inactive)
- **Medical Alert Badge** (if applicable)
- **Patient ID**
- **Demographics** (Age, Gender)
- **Contact Info** (Phone, Email)
- **Visit History** (Last visit date)
- **Upcoming Appointments**

### Search & Filter
- Search by name, patient ID, or email
- Filter options for status, alerts, etc.

### Actions
- Click on any patient card to view full profile
- "Add New Patient" button for registration

---

## 🎨 Visual Structure

```
┌──────────────┬────────────────────────────────────────────────┐
│              │  Header (Clinic Info, Notifications)          │
│   SIDEBAR    ├────────────────────────────────────────────────┤
│              │                                                │
│  Dashboard   │                                                │
│  Patients    │          MAIN CONTENT AREA                     │
│  Appointment │                                                │
│  Reports     │  • Dashboard                                   │
│  Procedures  │  • Patients Directory                          │
│  Settings    │  • Patient Profile                             │
│              │    ↳ Enhanced Dental Charting (child)          │
│              │    ↳ Treatment Plans (child)                   │
│              │    ↳ Dental Charting (child)                   │
│              │  • Appointments                                │
│              │  • Reports                                     │
│              │  • Procedures                                  │
│              │  • Settings                                    │
│              │                                                │
└──────────────┴────────────────────────────────────────────────┘
```

---

## ✅ Benefits of This Structure

### 1. **Clear Information Architecture**
- Parent menus are always visible in the sidebar
- Child pages are contextual (patient-specific)
- Reduces sidebar clutter

### 2. **Patient-Centric Workflow**
- Enhanced Dental Charting always has patient context
- No orphaned charting pages without patient info
- Proper data association

### 3. **Intuitive Navigation**
- Users must select a patient first
- Then access patient-specific tools
- Natural workflow progression

### 4. **Scalability**
- Easy to add more patient-specific tools
- Main menu stays clean
- Can add more main features without crowding

### 5. **Professional EHR Pattern**
- Follows industry standard for medical records systems
- Context → Action workflow
- Prevents data entry errors

---

## 🔐 Future Considerations

### Role-Based Menu Access
```typescript
// Different menus for different user roles
const menuByRole = {
  dentist: ['dashboard', 'patients', 'appointments', 'reports', 'procedures', 'settings'],
  hygienist: ['dashboard', 'patients', 'appointments'],
  'front-desk': ['dashboard', 'patients', 'appointments', 'reports'] // Receptionist = Front Desk
};
```

### Breadcrumb Navigation
```
Dashboard > Patients > John Doe > Enhanced Dental Charting
```

### Recent Patients
- Quick access to recently viewed patients
- Could be added to sidebar or header

### Favorites/Pinned Patients
- Star/pin frequently accessed patients
- Quick access dropdown

---

## 📝 Implementation Notes

### State Management

```typescript
// App.tsx maintains:
- activeView: string              // Current main view
- selectedPatient: string | null  // Patient name
- selectedPatientId: string | null // Patient ID
```

### Navigation Functions

```typescript
handleNavigateToPatient(patientId, patientName)
  → Sets patient context
  → Navigates to patient-profile

handleBackToPatients()
  → Clears patient context
  → Returns to patients directory

handleNavigateToEnhancedDentalChart()
  → Maintains patient context
  → Shows enhanced charting
```

---

## 🎯 User Journey Examples

### Example 1: Review Patient's Dental Chart

```
1. User logs in → Dashboard
2. Click "Patients" in sidebar → Patients Directory
3. Search for "John Doe" → Patient list filtered
4. Click on John Doe → Patient Profile
5. Click "Enhanced Dental Chart" → Enhanced Dental Charting
6. Review tooth conditions with FDI notation
7. Click back arrow → Return to Patients Directory
```

### Example 2: Create Treatment Plan

```
1. Start from Dashboard
2. Click on appointment card for "Sarah Johnson" → Patient Profile
3. Review medical history in tabs
4. Click "Treatment Plans" quick action → Treatment Plans
5. Create new treatment plan
6. Click back arrow → Return to Patients Directory
```

### Example 3: Quick Patient Lookup

```
1. Click "Patients" in sidebar → Patients Directory
2. Type patient ID in search → Find patient
3. Click patient → Patient Profile
4. View all patient information
5. Access any patient-specific tool as needed
```

---

## 📚 Related Documentation

- [DENTAL_CHARTING_REQUIREMENTS.md](./DENTAL_CHARTING_REQUIREMENTS.md) - Charting business requirements
- [FDI_NOTATION_GUIDE.md](./FDI_NOTATION_GUIDE.md) - FDI notation reference
- [SURFACE_BASED_RECORDING.md](./SURFACE_BASED_RECORDING.md) - Surface recording guide
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Implementation details

---

**Document Version:** 1.0  
**Last Updated:** October 17, 2025  
**System:** Dental EHR - Clinic Cipta Sehat
