// =====================================================
// Dental Types - FDI Notation & Clinical Data
// =====================================================

export type ToothNumber = 
  // Upper Right (Quadrant 1)
  | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18
  // Upper Left (Quadrant 2)
  | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28
  // Lower Left (Quadrant 3)
  | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38
  // Lower Right (Quadrant 4)
  | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48;

export type ToothSurface = 'M' | 'O' | 'D' | 'B' | 'L' | 'I'; // Mesial, Occlusal, Distal, Buccal, Lingual, Incisal

export type ToothCondition =
  | 'healthy'
  | 'caries'          // Cavity
  | 'filled'          // Restoration/Filling
  | 'crown'           // Crown
  | 'bridge'          // Bridge
  | 'implant'         // Dental Implant
  | 'missing'         // Missing Tooth
  | 'root-canal'      // Root Canal Treated
  | 'fracture'        // Fractured
  | 'abscess'         // Abscess
  | 'impacted'        // Impacted (wisdom teeth)
  | 'mobile'          // Mobility
  | 'recession'       // Gum Recession
  | 'calculus'        // Tartar/Calculus
  | 'stain'           // Staining
  | 'wear'            // Wear/Attrition
  | 'to-extract';     // Planned for Extraction

export interface ToothSurfaceData {
  surface: ToothSurface;
  condition: ToothCondition;
  severity?: 'mild' | 'moderate' | 'severe';
  notes?: string;
}

export interface ToothData {
  toothNumber: ToothNumber;
  conditions: ToothCondition[];
  surfaces?: ToothSurfaceData[];
  notes?: string;
  requiresTreatment: boolean;
  treatmentPriority?: 'urgent' | 'high' | 'normal' | 'low';
}

export interface OdontogramData {
  teeth: Record<ToothNumber, ToothData>;
  generalNotes?: string;
  examDate?: string;
  examinedBy?: string;
}

export interface ExamData {
  id: string;
  patientId: string;
  doctorId: string;
  examDate: string;
  chiefComplaint: string;
  bloodPressure?: string;
  pulse?: number;
  temperature?: number;
  odontogramData: OdontogramData;
  clinicalNotes?: string;
  diagnosis?: string[];
  status: 'in_progress' | 'completed' | 'pending_review';
}

// Tooth position helpers
export const QUADRANTS = {
  1: [11, 12, 13, 14, 15, 16, 17, 18], // Upper Right
  2: [21, 22, 23, 24, 25, 26, 27, 28], // Upper Left
  3: [31, 32, 33, 34, 35, 36, 37, 38], // Lower Left
  4: [41, 42, 43, 44, 45, 46, 47, 48], // Lower Right
} as const;

export const UPPER_TEETH = [...QUADRANTS[1], ...QUADRANTS[2]];
export const LOWER_TEETH = [...QUADRANTS[3], ...QUADRANTS[4]];
export const ALL_TEETH = [...UPPER_TEETH, ...LOWER_TEETH];

// Tooth type helpers
export const getToothType = (toothNumber: ToothNumber): 'incisor' | 'canine' | 'premolar' | 'molar' => {
  const position = toothNumber % 10;
  if (position <= 2) return 'incisor';
  if (position === 3) return 'canine';
  if (position <= 5) return 'premolar';
  return 'molar';
};

export const getQuadrant = (toothNumber: ToothNumber): 1 | 2 | 3 | 4 => {
  return Math.floor(toothNumber / 10) as 1 | 2 | 3 | 4;
};

// Condition colors for visualization
export const CONDITION_COLORS: Record<ToothCondition, string> = {
  healthy: '#10b981',       // green
  caries: '#ef4444',        // red
  filled: '#3b82f6',        // blue
  crown: '#f59e0b',         // amber
  bridge: '#8b5cf6',        // purple
  implant: '#06b6d4',       // cyan
  missing: '#6b7280',       // gray
  'root-canal': '#ec4899',  // pink
  fracture: '#dc2626',      // dark red
  abscess: '#991b1b',       // darkest red
  impacted: '#fb923c',      // orange
  mobile: '#fbbf24',        // yellow
  recession: '#f87171',     // light red
  calculus: '#78716c',      // stone
  stain: '#a8a29e',         // gray-brown
  wear: '#d6d3d1',          // light gray
  'to-extract': '#450a0a',  // very dark red
};

export const CONDITION_LABELS: Record<ToothCondition, string> = {
  healthy: 'Healthy',
  caries: 'Caries (Cavity)',
  filled: 'Filled',
  crown: 'Crown',
  bridge: 'Bridge',
  implant: 'Implant',
  missing: 'Missing',
  'root-canal': 'Root Canal',
  fracture: 'Fractured',
  abscess: 'Abscess',
  impacted: 'Impacted',
  mobile: 'Mobile',
  recession: 'Gum Recession',
  calculus: 'Calculus',
  stain: 'Stained',
  wear: 'Wear',
  'to-extract': 'To Extract',
};
