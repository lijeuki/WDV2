# Quick Start: Interactive Dental Charting in Clinical Exam

## 🎯 For Dentists & Clinical Staff

This guide shows you how to use the new Interactive Odontogram in the Clinical Examination Workflow.

---

## 🚀 Getting Started

### Access the Interactive Charting

1. **Open Patient Profile** → Click **"Start Exam"** or **"New Exam"**
2. **Pre-Exam Review** (Step 1) → Review medical history, allergies, previous treatments
3. **Click "Next Step"** → Navigate to **Clinical Examination (Step 2)**

You'll now see the Interactive Odontogram interface:

```
┌─────────────────────────────────────────────────────────────────────┐
│  Clinical Examination & Dental Charting                             │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                      │
│  ℹ️  Interactive Charting: Select a symbol from the palette, then   │
│     click on tooth surfaces to chart findings.                      │
│                                                                      │
│  ┌──────────────────────┐  ┌─────────────────┐                     │
│  │  ODONTOGRAM          │  │ SYMBOL PALETTE  │                     │
│  │  [Dental Chart]      │  │ 🔍 Search...    │                     │
│  │                      │  │                 │                     │
│  │  Upper Right Quadrant│  │ ▼ Findings      │                     │
│  │  18 17 16 15...      │  │   ○ Caries      │                     │
│  │  [Tooth diagrams]    │  │   ○ Fractured   │                     │
│  │                      │  │   ○ Non-Vital   │                     │
│  │  Lower Left Quadrant │  │                 │                     │
│  │  31 32 33 34...      │  │ ▼ Restorations  │                     │
│  │  [Tooth diagrams]    │  │   ○ Composite   │                     │
│  └──────────────────────┘  │   ○ Crown       │                     │
│                            └─────────────────┘                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📝 Step-by-Step Charting Guide

### Example 1: Charting a Cavity (Caries)

**Scenario:** Patient has a cavity on tooth #16 (upper right first molar), occlusal and mesial surfaces.

#### Step 1: Select the Symbol
```
1. Look at the Symbol Palette (right side)
2. Find "Findings" category
3. Click on "Caries" (🔴 Karies)
   → Symbol becomes highlighted/selected
```

#### Step 2: Chart the Finding
```
1. Locate tooth #16 on the odontogram (upper right quadrant)
2. Click on the OCCLUSAL surface (top surface marked "O")
   → Surface changes color (red) to indicate caries
3. Click on the MESIAL surface (toward front, marked "M")
   → Surface changes color (red)
4. Optional: Click tooth number "16" to add clinical notes
```

#### Step 3: Review Auto-Suggested Procedure
```
A green card appears below showing:

┌──────────────────────────────────────────────────┐
│ ✅ Prosedur yang Disarankan (1)                  │
│ Berdasarkan temuan pada odontogram               │
├──────────────────────────────────────────────────┤
│ 1. Gigi #16 - Tambalan Komposit                 │
│    Temuan: Karies                                │
│    Permukaan: O, M                               │
│    [Sedang] Rp 750.000                           │
└──────────────────────────────────────────────────┘

System automatically:
✓ Identified the finding as caries
✓ Suggested composite filling procedure
✓ Set priority to Medium
✓ Calculated cost (Rp 750,000)
✓ Recorded affected surfaces (O, M)
```

---

### Example 2: Charting a Fractured Tooth

**Scenario:** Patient has a fractured crown on tooth #26 (upper left first molar).

#### Step 1: Select "Fractured" Symbol
```
1. Symbol Palette → Findings → Click "Fractured" (🟡 Patah)
```

#### Step 2: Chart the Fracture
```
1. Find tooth #26 (upper left quadrant)
2. Since the entire crown is fractured, click the tooth NUMBER "#26"
   → Entire tooth outline changes color
   OR click multiple surfaces if only partial fracture
```

#### Step 3: Review Auto-Suggested Procedure
```
┌──────────────────────────────────────────────────┐
│ 2. Gigi #26 - Mahkota Keramik                   │
│    Temuan: Patah                                 │
│    [Tinggi] Rp 4.500.000                         │
└──────────────────────────────────────────────────┘

System automatically:
✓ Suggested ceramic crown (structural restoration)
✓ Set priority to HIGH (fractured teeth are urgent)
✓ Applied cost (Rp 4.5M)
```

---

### Example 3: Charting Existing Restoration

**Scenario:** Patient already has a composite filling on tooth #46.

#### Step 1: Select "Composite Filling" Symbol
```
1. Symbol Palette → Restorations → Click "Composite" (🔵 Tambalan Komposit)
```

#### Step 2: Chart the Restoration
```
1. Find tooth #46 (lower right quadrant)
2. Click on surfaces that have the filling (e.g., O, D)
   → Surfaces change to blue color
```

#### Step 3: No Procedure Suggested
```
✓ Charting recorded for documentation
✗ NO procedure suggested (tooth already restored)

This documents existing treatment without creating duplicate work.
```

---

### Example 4: Charting Missing Tooth

**Scenario:** Tooth #36 was previously extracted.

#### Step 1: Select "Missing (Extracted)" Symbol
```
1. Symbol Palette → Missing → Click "Missing (Extracted)" (⚫ Hilang - Dicabut)
```

#### Step 2: Mark Tooth as Missing
```
1. Find tooth #36 (lower left quadrant)
2. Click the tooth NUMBER "#36"
   → Tooth appears crossed out or grayed
```

#### Step 3: Review Auto-Suggested Procedure
```
┌──────────────────────────────────────────────────┐
│ 3. Gigi #36 - Implan Gigi                       │
│    Temuan: Hilang (Dicabut)                      │
│    [Rendah] Rp 12.000.000                        │
└──────────────────────────────────────────────────┘

System automatically:
✓ Suggested dental implant as replacement option
✓ Set priority to LOW (elective procedure)
✓ Patient can decide to proceed or postpone
```

---

## 🎨 Understanding the Interface

### Tooth Surface Labels
Each tooth shows clickable surface areas:

```
        O = Occlusal (chewing surface)
        ↑
    M ←   → D     M = Mesial (toward front)
        ↓         D = Distal (toward back)
        B/L       B = Buccal (cheek side)
                  L = Lingual (tongue side)
```

### Symbol Categories & Colors

| Category | Color | Examples |
|----------|-------|----------|
| **Findings** | 🔴 Red, 🟡 Amber | Caries, Fractured, Non-Vital, Wear |
| **Restorations** | 🔵 Blue, ⚫ Gray | Composite, Amalgam, Temporary |
| **Prosthetics** | 🟣 Purple, 🟡 Gold | Crown, Bridge, Implant, Veneer |
| **Endodontic** | 🔴 Dark Red | Root Canal, Post & Core |
| **Missing** | ⚫ Black, ⚪ Gray | Extracted, Congenital Missing |
| **Orthodontic** | 🔵 Sky Blue | Bracket, Band |
| **Periodontal** | 🟡 Yellow-Red | Mobility, Furcation |

### Priority Indicators

| Badge | Meaning | Use Case |
|-------|---------|----------|
| 🔴 **Tinggi** (High) | Urgent treatment needed | Fractures, Non-Vital, Severe Caries |
| 🟡 **Sedang** (Medium) | Needed but can be scheduled | Moderate Caries, Retained Root |
| 🔵 **Rendah** (Low) | Elective/Optional | Missing Tooth Replacement, Mild Wear |

---

## ⚙️ Advanced Features

### Adding Clinical Notes to Teeth

1. Click on the **tooth NUMBER** (e.g., "16")
2. A dialog opens with:
   - Current conditions on that tooth
   - Text area for clinical notes
   - Surface selector
   - Image attachment options
3. Type your notes (e.g., "Patient reports sensitivity to cold")
4. Click "Save"
5. Notes automatically included in suggested procedure

### Editing/Removing Charted Conditions

1. Click on the tooth NUMBER
2. View list of conditions on that tooth
3. Click "X" next to condition to remove
4. Click surface again to remove surface marking
5. Removed conditions won't trigger procedures

### Manually Adding Procedures

If auto-suggestion doesn't cover all needs:

1. Scroll down below odontogram
2. Click **"Tambah Perawatan"** button
3. Manual procedure dialog opens
4. Fill in: Tooth number, Procedure, Surfaces, Priority
5. Click "Tambah ke Rencana Perawatan"

---

## 🔄 Complete Workflow Example

### Full Examination Flow

```
STEP 1: PRE-EXAM REVIEW
├─ Review medical alerts (allergies, medications)
├─ Check previous dental history
├─ Note pending procedures from last visit
└─ Enter chief complaint
        ↓
STEP 2: CLINICAL EXAMINATION ★ YOU ARE HERE
├─ Chart findings using Interactive Odontogram
│   ├─ Tooth 16: Caries (O, M) → Auto-suggests Composite Filling
│   ├─ Tooth 26: Fractured → Auto-suggests Ceramic Crown
│   ├─ Tooth 36: Non-Vital → Auto-suggests Root Canal
│   └─ Tooth 46: Existing Composite (documented, no new procedure)
├─ Add general clinical notes
└─ 3 procedures auto-suggested, ready for review
        ↓
STEP 3: TREATMENT PLAN MANAGEMENT
├─ Review auto-suggested procedures
├─ Modify priorities if needed
├─ Add pending procedures from previous visits
├─ Discuss costs with patient
└─ Mark procedures as Planned/Scheduled/Pending
        ↓
STEP 4: SOAP NOTES
├─ Complete Subjective, Objective, Assessment, Plan
├─ Add diagnosis codes
└─ Document treatment discussion
        ↓
STEP 5: PRESCRIPTIONS
├─ Add medications if needed
└─ Check drug interactions
        ↓
STEP 6: COMPLETE
├─ Schedule follow-up appointment
├─ Save examination record
└─ Odontogram snapshot saved to patient history
```

---

## 💡 Pro Tips

### 1. **Search Symbols Quickly**
Type in the search box at top of Symbol Palette:
- Type "caries" → instantly filters to caries-related symbols
- Type "crown" → shows all crown types
- Type "missing" → shows missing tooth options

### 2. **Chart in Logical Order**
Start from upper right (18) → move across → down to lower teeth
Follow the quadrant order: UR → UL → LL → LR

### 3. **Double-Check Auto-Suggested Procedures**
- Review cost estimates
- Verify surfaces are correct
- Adjust priority based on patient discussion
- Remove procedures patient declines

### 4. **Use Clinical Notes Generously**
- "Patient prefers metal-free restoration"
- "Tooth sensitive to percussion"
- "Discussed cost, patient will decide next visit"

### 5. **Document Existing Work**
Always chart existing restorations, crowns, implants
- Provides complete record
- Helps identify old work that may need replacement
- No duplicate procedures created

---

## ❓ Common Questions

### Q: What if I chart the wrong tooth?
**A:** Click the tooth number, view conditions, click "X" to remove. Or click the surface again to deselect.

### Q: Can I add a procedure without charting on odontogram?
**A:** Yes! Click "Tambah Perawatan" button for manual entry.

### Q: What if the auto-suggested procedure is wrong?
**A:** You can:
1. Remove it (click "X" on the procedure card)
2. Manually add the correct procedure
3. Or proceed to Treatment Plan step and modify there

### Q: How do I chart multiple conditions on one tooth?
**A:** Select first symbol → chart surfaces → select second symbol → chart different surfaces. All conditions recorded on same tooth.

### Q: Does charting replace entering SOAP notes?
**A:** No. Odontogram is for visual charting. You still complete SOAP notes in Step 4 for full clinical documentation.

### Q: Can I see previous odontograms?
**A:** Yes, in the patient profile, visit history shows previous odontogram snapshots.

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Symbol not selecting | Click directly on symbol name/icon in palette |
| Tooth surface not changing color | Ensure symbol is selected first (highlighted in palette) |
| No procedure auto-suggested | Some symbols (like existing restorations) don't trigger procedures. This is expected. |
| Duplicate procedures appearing | System should prevent this. If it happens, manually remove duplicates. |
| Can't see entire odontogram | Zoom out browser (Ctrl + -) or scroll within the odontogram area |

---

## 📚 Related Documentation

- **Full System Guide**: `/ODONTOGRAM_SYSTEM_GUIDE.md`
- **Technical Details**: `/ODONTOGRAM_INTEGRATION_GUIDE.md`
- **FDI Notation**: `/FDI_NOTATION_GUIDE.md`
- **Symbol Reference**: Built into Symbol Palette with hover tooltips

---

## ✅ Checklist: First Time Using

Before your first patient:
- [ ] Familiarize yourself with Symbol Palette categories
- [ ] Practice selecting symbols and clicking tooth surfaces
- [ ] Review FDI tooth numbering (upper right = 11-18, etc.)
- [ ] Understand surface abbreviations (O, M, D, B, L)
- [ ] Test adding clinical notes to a tooth
- [ ] Review auto-suggested procedures and verify they're appropriate
- [ ] Practice manual procedure addition as backup

After first patient:
- [ ] Review time spent vs. old charting method
- [ ] Check completeness of documentation
- [ ] Verify all procedures captured
- [ ] Collect feedback from patient (show them their odontogram!)

---

**Happy Charting! 🦷**

For questions or feature requests, contact your EHR system administrator.

---

**Last Updated**: October 17, 2025  
**Version**: 1.0 - Initial Release
