# Odontogram & Doctor Exam Workflow Integration Guide

## What Was Copied from Badental

### 1. **Odontogram Type System** (`src/lib/odontogram-types.ts`)
- Comprehensive dental symbol library (ISO 3950 / FDI compliant)
- 40+ standardized dental symbols covering:
  - Findings (caries, fractures, wear, etc.)
  - Restorations (composite, amalgam, crowns)
  - Prosthetics (implants, bridges, veneers)
  - Endodontic (root canal, post & core)
  - Missing teeth classifications
  - Orthodontic & Periodontal conditions
- FDI tooth numbering system (11-48 for permanent, 51-85 for primary)
- Surface-level tracking (MODBLI - Mesial, Occlusal, Distal, Buccal, Lingual, Incisal)

### 2. **InteractiveOdontogram Component** (`src/components/organisms/InteractiveOdontogram.tsx`)
- **5-Section Anatomical Tooth Display**: Each tooth divided into clickable surfaces
  - Top: Occlusal/Incisal surface
  - Left: Mesial surface
  - Right: Distal surface  
  - Bottom: Lingual/Palatal surface
  - Center: Buccal/Labial surface
- **Visual Features**:
  - SVG-based interactive tooth rendering
  - Hover effects showing which surface is being targeted
  - Color-coded conditions based on symbol library
  - Support for whole-tooth conditions (missing, crown, implant)
- **Modes**: Adult (32 teeth) vs Pediatric (20 teeth) dentition
- **Legend**: Automatic generation of charted conditions with tooth number and surfaces

### 3. **SymbolPalette Component** (`src/components/molecules/SymbolPalette.tsx`)
- Categorized symbol selection interface
- 7 categories with emoji icons:
  - 🔍 Findings
  - 🦷 Restorations
  - 👑 Prosthetics
  - 🩺 Endodontic
  - ❌ Missing
  - 🔗 Orthodontic
  - ⚕️ Periodontal
- Compact and full-size modes
- Shows selected symbol with visual feedback
- Includes symbol codes and bilingual names (English/Indonesian)

## Workflow from Badental's ExamWorkflow

The Badental project implements a **6-step multi-step exam workflow**:

### Step 1: Pre-Exam Review
- Patient information summary
- Medical history & alerts (allergies, medications)
- Previous dental history (read-only)
- **Pending procedures from previous visits** (important!)
- Chief complaint entry

### Step 2: Clinical Examination & Dental Charting
- Interactive odontogram with symbol palette (side-by-side layout)
- **Auto-suggestion of treatment procedures** based on charted findings
- Mapping logic: Caries → Filling, Fracture → Crown, Non-vital → Root Canal
- Surface-level precision charting
- Clinical notes for general observations

### Step 3: Treatment Plan Management
- Review auto-suggested procedures from exam
- Add manual procedures
- **Procedure prioritization** (high, medium, low)
- **Procedure status**:
  - Planned (ready for scheduling)
  - Scheduled (appointment set)
  - **Pending** (patient deferred - tracked for next visit!)
  - Completed
- Cost estimation per procedure
- Patient discussion notes

### Step 4: SOAP Notes
- Subjective, Objective, Assessment, Plan
- Auto-population from exam data
- Template support

### Step 5: Prescriptions
- Quick medication templates
- Common drug library
- Dosage and instructions

### Step 6: Complete & Review
- Summary of all steps
- Alert for pending procedures (will show in next visit)
- Follow-up scheduling

## How to Integrate into Revamp's Doctor Menu

### Option 1: Update Existing SmartExam.tsx

Replace the current `SmartExam.tsx` with the new components:

```tsx
import { InteractiveOdontogram } from '@/components/organisms/InteractiveOdontogram';
import { SymbolPalette } from '@/components/molecules/SymbolPalette';
import { useState } from 'react';
import { DentalSymbol, ToothData } from '@/lib/odontogram-types';

export default function SmartExam() {
  const [selectedSymbol, setSelectedSymbol] = useState<DentalSymbol | null>(null);
  const [odontogramData, setOdontogramData] = useState<Record<string, ToothData>>({});

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Symbol Palette - Left Sidebar */}
      <div className="lg:col-span-1">
        <SymbolPalette
          onSymbolSelect={setSelectedSymbol}
          selectedSymbolId={selectedSymbol?.id}
          compact={true}
        />
      </div>

      {/* Odontogram - Main Area */}
      <div className="lg:col-span-3">
        <InteractiveOdontogram
          initialData={odontogramData}
          onDataChange={setOdontogramData}
          selectedSymbol={selectedSymbol}
          readOnly={false}
        />
      </div>
    </div>
  );
}
```

### Option 2: Create New Enhanced Exam Workflow

Create a new file `src/pages/doctor/EnhancedExamWorkflow.tsx` based on Badental's multi-step approach.

Key features to implement:
1. **Step-by-step progress indicator**
2. **Auto-procedure suggestion** from odontogram findings
3. **Pending treatment tracking** across visits
4. **Navigation**: Previous/Next buttons between steps

### Quick Start Example

Here's a minimal working example:

```tsx
// src/pages/doctor/QuickExam.tsx
import { useState } from 'react';
import { InteractiveOdontogram } from '@/components/organisms/InteractiveOdontogram';
import { SymbolPalette } from '@/components/molecules/SymbolPalette';
import { DentalSymbol, ToothData } from '@/lib/odontogram-types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function QuickExam() {
  const [selectedSymbol, setSelectedSymbol] = useState<DentalSymbol | null>(null);
  const [odontogramData, setOdontogramData] = useState<Record<string, ToothData>>({});

  const handleSave = () => {
    console.log('Exam data:', odontogramData);
    // Save to database
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Clinical Examination</h1>
        <Button onClick={handleSave}>Save Exam</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <SymbolPalette
            onSymbolSelect={setSelectedSymbol}
            selectedSymbolId={selectedSymbol?.id}
            compact={true}
          />
        </div>

        <div className="lg:col-span-3">
          <InteractiveOdontogram
            initialData={odontogramData}
            onDataChange={setOdontogramData}
            selectedSymbol={selectedSymbol}
            readOnly={false}
          />
        </div>
      </div>

      {/* Auto-show procedures based on findings */}
      {Object.keys(odontogramData).length > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Suggested Treatments</h3>
          <p className="text-sm text-muted-foreground">
            {Object.keys(odontogramData).length} teeth charted with conditions
          </p>
        </Card>
      )}
    </div>
  );
}
```

## Key Improvements from Badental

1. **Surface-Level Precision**: Click individual tooth surfaces instead of whole tooth
2. **Visual Feedback**: Hover effects and color-coding
3. **Symbol Library**: Standardized ISO/FDI symbols
4. **Auto-Procedure Mapping**: Findings automatically suggest treatments
5. **Pending Treatment Tracking**: Deferred procedures appear in next visit
6. **Bilingual Support**: English and Indonesian labels
7. **Professional Layout**: Clean, clinical interface

## Navigation Integration

To add to the doctor menu in `DoctorDashboard.tsx`:

```tsx
<Button onClick={() => navigate('/doctor/exam/new')}>
  <Stethoscope className="size-4 mr-2" />
  Start Examination
</Button>
```

## Database Schema Notes

You'll need to store:
- `odontogram_data`: JSON field with `Record<string, ToothData>`
- `pending_treatments`: Table tracking procedures patient deferred
- `visit_snapshots`: Historical odontogram states per visit

## Next Steps

1. ✅ Copy odontogram types → `src/lib/odontogram-types.ts`
2. ✅ Create SymbolPalette → `src/components/molecules/SymbolPalette.tsx`
3. ✅ Create InteractiveOdontogram → `src/components/organisms/InteractiveOdontogram.tsx`
4. ⏳ Update SmartExam.tsx to use new components
5. ⏳ Implement multi-step workflow (optional but recommended)
6. ⏳ Add procedure auto-suggestion logic
7. ⏳ Implement pending treatment tracking
8. ⏳ Test the workflow end-to-end

## Testing Checklist

- [ ] Symbol palette switches categories smoothly
- [ ] Clicking tooth surfaces applies selected symbol
- [ ] Clicking again removes the symbol
- [ ] Legend updates automatically
- [ ] Whole-tooth symbols (missing, crown) work correctly
- [ ] Adult/pediatric dentition toggle works
- [ ] Data persists when navigating away and back
- [ ] Read-only mode disables editing

## Support

For questions or issues, refer to:
- Badental project: `C:\Users\rizkk\Documents\WD\FE\Badental`
- Original files:
  - `src/components/pages/ExamWorkflow.tsx` (full workflow)
  - `src/components/organisms/InteractiveOdontogram.tsx`
  - `src/lib/odontogram-types.ts`
