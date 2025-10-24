# Treatment Pathways Guide - Dual Clinical Workflow System

## Overview

The EHR system now supports **two distinct clinical workflows** designed to optimize doctor efficiency based on the type of patient visit:

### **Pathway A: New Exam** (Full Diagnostic Visit)
For new patients, comprehensive examinations, diagnostic visits, or emergency cases

### **Pathway B: Treatment Execution** (Scheduled Procedure Visit)
For returning patients with scheduled procedures from existing treatment plans

---

## Critical Design Principle

### 🦷 **Odontogram Must Be Updated Every Visit**

Regardless of which pathway is used, the **odontogram (dental chart) must be checked and updated** in every patient visit. This ensures:

- Clinical records are always current
- Treatment progression is accurately tracked
- Legal/medical documentation is complete
- No gaps in patient dental history

---

## Pathway A: New Exam (Full Diagnostic)

### When to Use
- New patient first visit
- Annual comprehensive exam
- Emergency walk-ins with new complaints
- Complex diagnostic cases
- Patient hasn't been seen in >6 months

### 6-Step Workflow

#### Step 1: Pre-Examination Review
- Review medical alerts (allergies, conditions)
- Check patient demographics
- Review medical history
- Review dental history
- Record chief complaint

#### Step 2: Clinical Examination ⭐ **Odontogram Update**
- Interactive dental chart (FDI notation)
- Click teeth to record findings
- Mark conditions, caries, restorations
- Document per-tooth notes
- Surface-level recording (Mesial, Distal, Occlusal, etc.)

#### Step 3: Treatment Plan Creation
- Auto-generate treatment plan from findings
- Add procedures per tooth
- Set priorities (High/Medium/Low)
- Estimate costs and duration
- Add clinical notes

#### Step 4: SOAP Notes
- **S** (Subjective): Patient's reported symptoms
- **O** (Objective): Doctor's clinical observations
- **A** (Assessment): Diagnosis with ICD-10 codes
- **P** (Plan): Treatment recommendations & follow-up

#### Step 5: Prescriptions
- Add medications if needed
- Automatic safety checks:
  - Drug interactions
  - Allergy conflicts
  - Medication duplication
- E-prescribe to pharmacy

#### Step 6: Complete Examination
- Review checklist
- Schedule follow-up appointment
- Finalize and save all records
- Auto-generate billing codes

### Visual Indicator
- **Green card** with stethoscope icon
- Label: "New Exam - Full diagnostic"

---

## Pathway B: Treatment Execution (Scheduled Procedure)

### When to Use
- Patient returning for scheduled treatment
- Procedure already planned from previous visit
- Follow-up treatment appointments
- Multi-visit procedures (2nd or 3rd visit)

### 5-Step Streamlined Workflow

#### Step 1: Select Procedure
- View scheduled procedures from treatment plan
- Shows today's appointments
- Displays procedure details:
  - Tooth number & surfaces
  - Procedure name
  - Estimated duration & cost
  - CDT and diagnosis codes
  - Previous clinical notes
- Priority indicators (High/Medium/Low)
- Select procedure to execute

#### Step 2: Update Odontogram ⭐ **Mandatory Check**
- Review current dental chart
- **Add new findings** if any changes since last visit
- Update status of treated teeth
- Confirm checkbox: "I have reviewed and updated the odontogram"
- Cannot proceed without confirmation

#### Step 3: Execute Procedure
Document the actual procedure performed:

**Time Tracking:**
- Start time
- End time
- Actual duration

**Anesthesia:**
- Type (Lidocaine, Articaine, Mepivacaine, Topical, None)
- Amount (ml/carpules)

**Materials Used:**
- List all materials (composite brand/shade, bonding agents, etc.)

**Patient Response:**
- Excellent / Good / Moderate / Poor / Adverse reaction

**Complications:**
- Document any issues (optional if none)

#### Step 4: Clinical Notes (Focused SOAP)
Brief SOAP notes specific to today's procedure:

- **S**: Patient's feedback on procedure
- **O**: What was done (procedure details)
- **A**: Outcome assessment
- **P**: Post-procedure instructions & next steps

**Follow-up Planning:**
- Check if follow-up needed
- Schedule next appointment
- Add follow-up notes

#### Step 5: Complete & Review
- Summary of procedure performed
- Documentation checklist:
  - ✓ Procedure selected
  - ✓ Odontogram updated
  - ✓ Execution details recorded
  - ✓ SOAP notes completed
  - ✓ Follow-up scheduled (if needed)
- Auto-update treatment plan status
- Auto-generate invoice
- Save and finalize

### Visual Indicator
- **Purple card** with clipboard-check icon
- Label: "Execute Treatment - From plan (3 pending)"
- Shows count of pending procedures

---

## Entry Points to Workflows

### From Dashboard
1. Click on today's appointment card
2. Navigate to Patient Profile
3. Choose pathway based on visit type

### From Patients Menu
1. Search/browse for patient
2. Open Patient Profile
3. Choose pathway based on visit type

### From Patient Profile
Two prominent action cards:

```
┌──────────────────┐  ┌──────────────────┐
│   🩺 New Exam    │  │ 📋 Execute       │
│   Full diagnostic│  │   Treatment      │
│                  │  │   From plan      │
└──────────────────┘  └──────────────────┘
```

---

## Key Differences Between Pathways

| Feature | Pathway A (New Exam) | Pathway B (Treatment Execution) |
|---------|---------------------|--------------------------------|
| **Duration** | 30-60 min | 15-45 min |
| **Steps** | 6 steps | 5 steps |
| **Odontogram** | Comprehensive update | Quick review + updates |
| **Treatment Plan** | Create new plan | Execute existing plan |
| **SOAP Notes** | Full comprehensive | Focused on procedure |
| **Prescriptions** | Full Rx module | Not usually needed |
| **Primary Use** | Diagnosis | Execution |
| **When** | First visit, annual exam | Scheduled treatments |
| **Color Theme** | Green (diagnostic) | Purple (execution) |

---

## Clinical Best Practices

### For New Exams (Pathway A)
1. ✅ Always complete all 6 steps
2. ✅ Thoroughly document odontogram
3. ✅ Create comprehensive treatment plan
4. ✅ Include all diagnosis codes (ICD-10)
5. ✅ Set realistic priorities and costs

### For Treatment Execution (Pathway B)
1. ✅ Verify correct procedure selected
2. ✅ **Always check odontogram** - don't skip!
3. ✅ Document exact materials used
4. ✅ Record actual time, not estimates
5. ✅ Note any deviations from plan
6. ✅ Update treatment plan status

### Universal Rules
1. 🚨 **Never skip odontogram update** - required every visit
2. 📝 Always complete SOAP notes (legal documentation)
3. ⏰ Record accurate timestamps
4. 💊 Check for allergy alerts before prescribing
5. 📅 Schedule follow-ups when needed

---

## Data Flow & Integration

### After Pathway A (New Exam) Completion:
```
Exam Complete
    ├─→ Patient Record Updated
    ├─→ Treatment Plan Created
    ├─→ Odontogram Saved
    ├─→ SOAP Notes Stored
    ├─→ Prescriptions Sent
    └─→ Billing Codes Generated
```

### After Pathway B (Treatment Execution) Completion:
```
Treatment Complete
    ├─→ Patient Record Updated
    ├─→ Treatment Plan Status Updated (Planned → Completed)
    ├─→ Odontogram Updated
    ├─→ Procedure SOAP Saved
    ├─→ Invoice Generated
    ├─→ Next Appointment Scheduled
    └─→ Remaining Procedures Listed
```

---

## Technical Implementation

### Files Structure
```
/components/pages/
├── ExamWorkflow.tsx          # Pathway A - Full diagnostic exam
├── TreatmentExecution.tsx    # Pathway B - Treatment execution
└── PatientProfile.tsx         # Entry point with both pathways

/App.tsx
├── handleStartExam()                 # Navigate to Pathway A
└── handleStartTreatmentExecution()   # Navigate to Pathway B
```

### State Management
- Patient context maintained across workflows
- Odontogram data persisted
- Treatment plan status synchronized
- Billing auto-updated

---

## User Interface Design

### Color Coding System
- **Green**: New Exam / Diagnostic
- **Purple**: Treatment Execution
- **Blue**: Clinical findings
- **Teal**: Odontogram/Dental chart
- **Amber**: Warnings/Alerts
- **Red**: Critical alerts (allergies, complications)

### Progress Indicators
Both pathways show:
- Step-by-step progress bar
- Current step highlighted
- Completed steps marked green
- Remaining steps grayed

---

## Future Enhancements

### Planned Features
1. **Smart Routing**: Auto-suggest pathway based on appointment type
2. **Voice Dictation**: For SOAP notes and clinical findings
3. **Template Library**: Pre-filled SOAP templates per procedure
4. **Multi-procedure Execution**: Execute multiple treatments in one session
5. **Real-time Updates**: Sync with dental assistant's notes
6. **Photo Documentation**: Attach clinical photos to odontogram
7. **Treatment Plan Modifications**: Adjust plan during execution

---

## FAQs

**Q: What if a patient scheduled for treatment needs a new exam?**
A: Use Pathway A (New Exam). You can always switch pathways from Patient Profile.

**Q: Can I skip the odontogram update if nothing changed?**
A: No. You must at least review it and confirm. This is a clinical and legal requirement.

**Q: What if I find new issues during treatment execution?**
A: Document in SOAP notes, update odontogram, and add to treatment plan for next visit.

**Q: Can I execute multiple procedures in one visit?**
A: Currently one procedure per session. For multiple procedures, complete one, then start another execution workflow.

**Q: What happens to pending procedures after completing one?**
A: They remain in the treatment plan. The "Execute Treatment" card shows updated count.

---

## Support

For questions or issues with the dual-pathway system:
- **Clinical Questions**: Contact clinical workflow team
- **Technical Issues**: Submit IT support ticket
- **Training**: Schedule one-on-one workflow training session

---

*Last Updated: Following implementation of dual-pathway system*
*Version: 1.0*
