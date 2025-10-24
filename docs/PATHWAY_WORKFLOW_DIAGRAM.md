# Clinical Pathway Workflow Diagrams

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      PATIENT ENTRY POINTS                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                  ┌───────────┴──────────┐
                  │                      │
         ┌────────▼────────┐    ┌────────▼────────┐
         │   Dashboard     │    │  Patients Menu  │
         │   (Today's      │    │  (Search/Browse)│
         │   Appointments) │    │                 │
         └────────┬────────┘    └────────┬────────┘
                  │                      │
                  └───────────┬──────────┘
                              │
                  ┌───────────▼────────────┐
                  │   PATIENT PROFILE      │
                  │   (Central Hub)        │
                  └────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              │                               │
    ┌─────────▼─────────┐         ┌──────────▼──────────┐
    │  🩺 PATHWAY A     │         │  📋 PATHWAY B       │
    │  NEW EXAM         │         │  TREATMENT          │
    │  (Full Diagnostic)│         │  EXECUTION          │
    └───────────────────┘         └─────────────────────┘
```

---

## Pathway A: New Exam (6 Steps)

```
┌────────────────────────────────────────────────────────────────┐
│                     PATHWAY A: NEW EXAM                        │
│                   (Full Diagnostic Visit)                      │
└────────────────────────────────────────────────────────────────┘

STEP 1: PRE-EXAMINATION REVIEW
┌─────────────────────────────────────┐
│  📋 Review Patient Background       │
│  ├─ Medical alerts (allergies)      │
│  ├─ Demographics & insurance        │
│  ├─ Medical history                 │
│  ├─ Dental history                  │
│  └─ Chief complaint (today's issue) │
└─────────────────────────────────────┘
          │
          ▼
STEP 2: CLINICAL EXAMINATION ⭐ ODONTOGRAM
┌─────────────────────────────────────┐
│  🦷 Interactive Dental Chart        │
│  ├─ FDI notation (11-48)            │
│  ├─ Click teeth to mark findings    │
│  ├─ Surface-level recording:        │
│  │  • Mesial / Distal               │
│  │  • Occlusal / Incisal            │
│  │  • Buccal / Lingual              │
│  ├─ Mark conditions:                │
│  │  • Caries / Decay                │
│  │  • Existing restorations         │
│  │  • Missing / Impacted            │
│  │  • Fractures / Wear              │
│  └─ Add per-tooth clinical notes    │
└─────────────────────────────────────┘
          │
          ▼
STEP 3: TREATMENT PLAN CREATION
┌─────────────────────────────────────┐
│  📝 Generate Treatment Plan         │
│  ├─ Auto-populate from findings     │
│  ├─ Add procedures per tooth        │
│  │  Example:                        │
│  │  • Tooth #36: Composite filling  │
│  │  • Surfaces: Occlusal, Mesial    │
│  │  • Cost: Rp 750,000             │
│  │  • Duration: 45 minutes          │
│  ├─ Set priorities (H/M/L)          │
│  ├─ Add clinical notes              │
│  └─ Review pending procedures       │
└─────────────────────────────────────┘
          │
          ▼
STEP 4: SOAP NOTES
┌─────────────────────────────────────┐
│  📄 Structured Documentation        │
│  ├─ S (Subjective):                 │
│  │   What patient reports           │
│  ├─ O (Objective):                  │
│  │   Clinical observations          │
│  ├─ A (Assessment):                 │
│  │   Diagnosis (ICD-10 codes)       │
│  └─ P (Plan):                       │
│      Treatment & follow-up plan     │
└─────────────────────────────────────┘
          │
          ▼
STEP 5: PRESCRIPTIONS
┌─────────────────────────────────────┐
│  💊 Medication Management           │
│  ├─ Add prescriptions if needed     │
│  ├─ Safety checks:                  │
│  │  • Drug interactions             │
│  │  • Allergy conflicts             │
│  │  • Medication duplication        │
│  └─ E-prescribe to pharmacy         │
└─────────────────────────────────────┘
          │
          ▼
STEP 6: COMPLETE EXAMINATION
┌─────────────────────────────────────┐
│  ✅ Review & Finalize               │
│  ├─ Review checklist:               │
│  │  ✓ Clinical exam completed       │
│  │  ✓ Treatment plan created        │
│  │  ✓ SOAP notes saved              │
│  │  ✓ Prescriptions issued          │
│  ├─ Schedule follow-up appointment  │
│  ├─ Add final notes                 │
│  └─ Save all records to database    │
└─────────────────────────────────────┘
          │
          ▼
    ┌─────────────────────────────┐
    │  DATA SAVED & SYNCED        │
    │  ├─ Patient record updated  │
    │  ├─ Treatment plan created  │
    │  ├─ Billing codes generated │
    │  └─ Return to Patient Profile│
    └─────────────────────────────┘
```

---

## Pathway B: Treatment Execution (5 Steps)

```
┌────────────────────────────────────────────────────────────────┐
│                  PATHWAY B: TREATMENT EXECUTION                │
│                  (Scheduled Procedure Visit)                   │
└────────────────────────────────────────────────────────────────┘

STEP 1: SELECT PROCEDURE FROM PLAN
┌─────────────────────────────────────┐
│  📋 View Scheduled Procedures       │
│  ┌─────────────────────────────┐   │
│  │ PROCEDURE 1 (Today - 10:00) │   │
│  │ Tambalan Komposit           │   │
│  │ Tooth #36 (Oklusal, Mesial) │   │
│  │ Duration: 45 min            │   │
│  │ Cost: Rp 750,000           │   │
│  │ Priority: HIGH 🔴          │   │
│  │ CDT: D2392 | ICD: K02.51   │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ PROCEDURE 2 (Today - 11:00) │   │
│  │ Mahkota Keramik             │   │
│  │ Tooth #26                   │   │
│  │ Duration: 60 min            │   │
│  │ Cost: Rp 4,500,000         │   │
│  │ Priority: MEDIUM 🟡        │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ PROCEDURE 3 (Next week)     │   │
│  │ Perawatan Saluran Akar      │   │
│  │ ...                         │   │
│  └─────────────────────────────┘   │
│                                     │
│  → Click to select procedure        │
└─────────────────────────────────────┘
          │
          ▼
STEP 2: UPDATE ODONTOGRAM ⭐ MANDATORY
┌─────────────────────────────────────┐
│  🦷 Check & Update Dental Chart     │
│  ┌─────────────────────────────┐   │
│  │ ⚠️  IMPORTANT NOTICE        │   │
│  │ Odontogram must be reviewed │   │
│  │ at EVERY visit. Add any new │   │
│  │ findings or changes.        │   │
│  └─────────────────────────────┘   │
│                                     │
│  📍 Highlighted: Tooth #36          │
│  (Today's treatment focus)          │
│                                     │
│  ├─ Symbol palette available        │
│  ├─ Click teeth to update           │
│  ├─ Add new findings if any         │
│  └─ Update existing conditions      │
│                                     │
│  ☑️ Required Confirmation:          │
│  [ ] I have reviewed and updated    │
│      the odontogram per current     │
│      patient condition              │
│                                     │
│  ⚠️ Cannot proceed without ✓        │
└─────────────────────────────────────┘
          │
          ▼
STEP 3: EXECUTE PROCEDURE
┌─────────────────────────────────────┐
│  🕐 Document Procedure Execution    │
│                                     │
│  Selected: Tambalan Komposit #36    │
│  Surfaces: Oklusal, Mesial          │
│  CDT Code: D2392                    │
│                                     │
│  ┌─ TIME TRACKING ────────────┐    │
│  │ Start: [10:15]              │    │
│  │ End:   [10:58]              │    │
│  │ Actual: 43 minutes          │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─ ANESTHESIA 💉 ────────────┐    │
│  │ Type: Lidocaine 2%          │    │
│  │ Amount: 1.8ml (1 carpule)   │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─ MATERIALS USED ───────────┐    │
│  │ • 3M Filtek Z350 XT (A2)    │    │
│  │ • Adper Single Bond 2       │    │
│  │ • Scotchbond Etchant        │    │
│  │ • FlowLine Flow Composite   │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─ PATIENT RESPONSE ─────────┐    │
│  │ ⚪ Excellent                 │    │
│  │ 🔵 Good ← Selected          │    │
│  │ ⚪ Moderate                  │    │
│  │ ⚪ Poor                      │    │
│  │ ⚪ Adverse reaction          │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─ COMPLICATIONS (Optional) ─┐    │
│  │ [None - procedure normal]   │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
          │
          ▼
STEP 4: CLINICAL NOTES (FOCUSED SOAP)
┌─────────────────────────────────────┐
│  📝 Brief Procedure Documentation   │
│                                     │
│  Focus: Tambalan Komposit #36       │
│                                     │
│  ┌─ S (SUBJECTIVE) ───────────┐    │
│  │ Patient datang untuk        │    │
│  │ perawatan yang sudah        │    │
│  │ dijadwalkan. Tidak ada      │    │
│  │ keluhan tambahan.           │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─ O (OBJECTIVE) ────────────┐    │
│  │ Tambalan komposit dilakukan │    │
│  │ pada gigi #36 permukaan     │    │
│  │ oklusal dan mesial.         │    │
│  │ Preparasi kavitas, isolasi  │    │
│  │ dengan rubber dam...        │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─ A (ASSESSMENT) ───────────┐    │
│  │ Tambalan komposit berhasil  │    │
│  │ dilakukan. Oklusi normal,   │    │
│  │ kontur anatomis baik.       │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─ P (PLAN) ─────────────────┐    │
│  │ Instruksi: Hindari makanan  │    │
│  │ keras 24 jam. Kontrol jika  │    │
│  │ ada keluhan.                │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─ FOLLOW-UP ────────────────┐    │
│  │ ☑️ Follow-up required       │    │
│  │ Date: [2024-08-25]          │    │
│  │ Note: Check occlusion       │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
          │
          ▼
STEP 5: COMPLETE & REVIEW
┌─────────────────────────────────────┐
│  ✅ Summary & Finalize              │
│                                     │
│  ┌─ PROCEDURE SUMMARY ────────┐    │
│  │ Procedure: Tambalan Komposit│    │
│  │ Tooth: #36                  │    │
│  │ Surfaces: Oklusal, Mesial   │    │
│  │ Cost: Rp 750,000           │    │
│  │ Time: 10:15 - 10:58 (43m)  │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─ DOCUMENTATION CHECKLIST ──┐    │
│  │ ✅ Procedure selected       │    │
│  │ ✅ Odontogram updated       │    │
│  │ ✅ Execution documented     │    │
│  │ ✅ SOAP notes completed     │    │
│  │ ✅ Follow-up scheduled      │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─ NEXT STEPS ───────────────┐    │
│  │ • Record saved to EHR       │    │
│  │ • Treatment plan updated    │    │
│  │ • Invoice generated         │    │
│  │ • Appointment scheduled     │    │
│  │ • 2 procedures remaining    │    │
│  └─────────────────────────────┘    │
│                                     │
│  [Save & Complete Treatment]        │
└─────────────────────────────────────┘
          │
          ▼
    ┌─────────────────────────────┐
    │  TREATMENT COMPLETED        │
    │  ├─ Status: Planned → Done  │
    │  ├─ Invoice: Rp 750,000    │
    │  ├─ Next appt: Aug 25      │
    │  └─ Return to Patient Profile│
    └─────────────────────────────┘
```

---

## Decision Tree: Which Pathway to Use?

```
                    Patient Arrives
                          │
                          ▼
              ┌───────────────────────┐
              │ Is this a scheduled   │
              │ treatment appointment?│
              └───────────┬───────────┘
                          │
          ┌───────────────┴───────────────┐
          │                               │
         YES                             NO
          │                               │
          ▼                               ▼
    ┌─────────────┐              ┌─────────────┐
    │ Does patient│              │ Is this for │
    │ have active │              │ diagnosis?  │
    │ treatment   │              └──────┬──────┘
    │ plan?       │                     │
    └──────┬──────┘              ┌──────┴──────┐
           │                    YES            NO
           │                     │              │
          YES                    ▼              ▼
           │              ┌──────────┐    ┌──────────┐
           │              │PATHWAY A │    │PATHWAY A │
           ▼              │NEW EXAM  │    │NEW EXAM  │
    ┌──────────┐         └──────────┘    └──────────┘
    │PATHWAY B │
    │TREATMENT │         New patient,    Emergency or
    │EXECUTION │         comprehensive   complex case
    └──────────┘         exam, annual
                         checkup
    Returning for
    scheduled
    procedure
```

---

## Color Coding Reference

```
┌─────────────────────────────────────────────┐
│          SYSTEM COLOR CODING                │
├─────────────────────────────────────────────┤
│  🟢 GREEN    Pathway A / New Exam           │
│  🟣 PURPLE   Pathway B / Treatment Exec     │
│  🔵 BLUE     Clinical Findings              │
│  🔷 TEAL     Odontogram / Dental Chart      │
│  🟡 AMBER    Warnings / Alerts              │
│  🔴 RED      Critical (Allergies, Errors)   │
│  ⚫ GRAY     Inactive / Completed           │
└─────────────────────────────────────────────┘
```

---

## Quick Reference Card

```
╔═══════════════════════════════════════════════════════════════╗
║              CLINICAL PATHWAY QUICK REFERENCE                 ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  🩺 PATHWAY A - NEW EXAM (6 steps, ~45-60 min)               ║
║  ├─ Use for: New patients, comprehensive exams, diagnostics  ║
║  ├─ Creates: Full treatment plan, SOAP, prescriptions        ║
║  └─ Icon: Green card with stethoscope                        ║
║                                                               ║
║  📋 PATHWAY B - TREATMENT EXECUTION (5 steps, ~30-45 min)    ║
║  ├─ Use for: Scheduled procedures, returning patients        ║
║  ├─ Updates: Treatment plan status, focused SOAP             ║
║  └─ Icon: Purple card with clipboard-check                   ║
║                                                               ║
║  ⭐ CRITICAL RULE: Update odontogram in BOTH pathways!       ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## Integration Points

```
PATHWAY A (New Exam)           PATHWAY B (Treatment Exec)
       │                              │
       ├─→ Creates Treatment Plan ────┤ (Reads from here)
       │                              │
       ├─→ Updates Odontogram ←───────┤ (Both write here)
       │                              │
       ├─→ Generates Billing ←────────┤ (Both generate)
       │                              │
       └─→ Schedules Appointments ←───┘ (Both schedule)
```

---

*This workflow ensures clinical efficiency while maintaining complete medical documentation standards*
