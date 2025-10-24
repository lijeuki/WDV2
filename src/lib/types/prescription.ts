// =====================================================
// Prescription Management Types
// =====================================================

export interface Medication {
  id: string;
  name: string;
  genericName?: string;
  brandNames?: string[];
  category: MedicationCategory;
  form: 'tablet' | 'capsule' | 'syrup' | 'suspension' | 'gel' | 'ointment' | 'mouthwash';
  strengths: string[]; // e.g., ['250mg', '500mg', '1000mg']
  usualDosage: string;
  maxDosage?: string;
  indications: string[];
  contraindications?: string[];
  sideEffects?: string[];
  interactions?: string[];
}

export type MedicationCategory =
  | 'antibiotic'
  | 'analgesic'
  | 'anti-inflammatory'
  | 'anesthetic'
  | 'antiseptic'
  | 'antifungal'
  | 'corticosteroid'
  | 'muscle-relaxant'
  | 'other';

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  visitId?: string;
  soapNotesId?: string;
  medication: {
    medicationId: string;
    medicationName: string;
    genericName?: string;
    strength: string;
    form: string;
  };
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  refills: number;
  instructions: string;
  specialInstructions?: string;
  reason: string;
  status: 'pending' | 'approved' | 'dispensed' | 'completed' | 'cancelled';
  prescribedDate: string;
  startDate?: string;
  endDate?: string;
  pharmacyNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface DrugInteraction {
  medication1: string;
  medication2: string;
  severity: 'minor' | 'moderate' | 'major' | 'contraindicated';
  description: string;
  recommendation: string;
}

export interface PrescriptionTemplate {
  id: string;
  name: string;
  category: string;
  medications: Array<{
    medicationId: string;
    medicationName: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }>;
}

// =====================================================
// Common Dental Medications Database
// =====================================================

export const DENTAL_MEDICATIONS: Medication[] = [
  // Antibiotics
  {
    id: 'amox-500',
    name: 'Amoxicillin',
    genericName: 'Amoxicillin',
    brandNames: ['Amoxil', 'Trimox'],
    category: 'antibiotic',
    form: 'capsule',
    strengths: ['250mg', '500mg'],
    usualDosage: '500mg every 8 hours',
    maxDosage: '3000mg per day',
    indications: ['Dental abscess', 'Periapical infection', 'Periodontal infection'],
    contraindications: ['Penicillin allergy'],
    sideEffects: ['Nausea', 'Diarrhea', 'Rash'],
    interactions: ['Oral contraceptives', 'Methotrexate'],
  },
  {
    id: 'azith-500',
    name: 'Azithromycin',
    genericName: 'Azithromycin',
    brandNames: ['Zithromax', 'Z-Pak'],
    category: 'antibiotic',
    form: 'tablet',
    strengths: ['250mg', '500mg'],
    usualDosage: '500mg on day 1, then 250mg daily for 4 days',
    indications: ['Dental infections (penicillin-allergic patients)'],
    contraindications: ['QT prolongation', 'Liver disease'],
    sideEffects: ['GI upset', 'Headache'],
    interactions: ['Warfarin', 'Digoxin'],
  },
  {
    id: 'clinda-300',
    name: 'Clindamycin',
    genericName: 'Clindamycin',
    brandNames: ['Cleocin'],
    category: 'antibiotic',
    form: 'capsule',
    strengths: ['150mg', '300mg'],
    usualDosage: '300mg every 6 hours',
    indications: ['Severe dental infections', 'Penicillin-allergic patients'],
    contraindications: ['C. difficile history'],
    sideEffects: ['Diarrhea', 'Colitis', 'Nausea'],
    interactions: ['Erythromycin'],
  },
  {
    id: 'metro-500',
    name: 'Metronidazole',
    genericName: 'Metronidazole',
    brandNames: ['Flagyl'],
    category: 'antibiotic',
    form: 'tablet',
    strengths: ['250mg', '500mg'],
    usualDosage: '500mg every 8 hours',
    indications: ['Anaerobic infections', 'Periodontal disease'],
    contraindications: ['First trimester pregnancy', 'Alcohol use'],
    sideEffects: ['Metallic taste', 'Nausea', 'Dark urine'],
    interactions: ['Alcohol (disulfiram reaction)', 'Warfarin'],
  },

  // Analgesics
  {
    id: 'ibu-600',
    name: 'Ibuprofen',
    genericName: 'Ibuprofen',
    brandNames: ['Advil', 'Motrin'],
    category: 'analgesic',
    form: 'tablet',
    strengths: ['400mg', '600mg', '800mg'],
    usualDosage: '400-600mg every 6-8 hours',
    maxDosage: '3200mg per day',
    indications: ['Dental pain', 'Post-operative pain', 'Inflammation'],
    contraindications: ['GI ulcers', 'Severe kidney disease', 'Aspirin allergy'],
    sideEffects: ['GI upset', 'Bleeding', 'Renal impairment'],
    interactions: ['Warfarin', 'ACE inhibitors', 'Aspirin'],
  },
  {
    id: 'aceta-500',
    name: 'Acetaminophen',
    genericName: 'Acetaminophen',
    brandNames: ['Tylenol'],
    category: 'analgesic',
    form: 'tablet',
    strengths: ['325mg', '500mg', '650mg'],
    usualDosage: '500-650mg every 4-6 hours',
    maxDosage: '4000mg per day',
    indications: ['Mild to moderate dental pain'],
    contraindications: ['Severe liver disease'],
    sideEffects: ['Hepatotoxicity (overdose)', 'Rash'],
    interactions: ['Warfarin', 'Alcohol'],
  },
  {
    id: 'aceta-codeine',
    name: 'Acetaminophen with Codeine',
    genericName: 'Acetaminophen/Codeine',
    brandNames: ['Tylenol #3'],
    category: 'analgesic',
    form: 'tablet',
    strengths: ['300mg/30mg'],
    usualDosage: '1-2 tablets every 4-6 hours',
    maxDosage: '12 tablets per day',
    indications: ['Moderate to severe dental pain'],
    contraindications: ['Respiratory depression', 'Codeine allergy'],
    sideEffects: ['Drowsiness', 'Constipation', 'Nausea'],
    interactions: ['CNS depressants', 'MAO inhibitors'],
  },

  // Anti-inflammatory
  {
    id: 'naproxen-500',
    name: 'Naproxen',
    genericName: 'Naproxen',
    brandNames: ['Aleve', 'Naprosyn'],
    category: 'anti-inflammatory',
    form: 'tablet',
    strengths: ['250mg', '500mg'],
    usualDosage: '500mg twice daily',
    maxDosage: '1500mg per day',
    indications: ['Dental inflammation', 'TMJ pain'],
    contraindications: ['GI ulcers', 'Kidney disease'],
    sideEffects: ['GI upset', 'Bleeding', 'Headache'],
    interactions: ['Warfarin', 'ACE inhibitors'],
  },
  {
    id: 'dexa-0.5',
    name: 'Dexamethasone',
    genericName: 'Dexamethasone',
    brandNames: ['Decadron'],
    category: 'corticosteroid',
    form: 'tablet',
    strengths: ['0.5mg', '0.75mg', '4mg'],
    usualDosage: '4mg before procedure, then taper',
    indications: ['Post-surgical swelling', 'Severe inflammation'],
    contraindications: ['Uncontrolled diabetes', 'Active infection'],
    sideEffects: ['Increased blood sugar', 'Insomnia', 'GI upset'],
    interactions: ['NSAIDs', 'Warfarin'],
  },

  // Antiseptic Mouthwash
  {
    id: 'chlorhex-012',
    name: 'Chlorhexidine Gluconate',
    genericName: 'Chlorhexidine',
    brandNames: ['Peridex', 'PerioGard'],
    category: 'antiseptic',
    form: 'mouthwash',
    strengths: ['0.12%'],
    usualDosage: '15ml twice daily for 30 seconds',
    indications: ['Gingivitis', 'Post-surgical care', 'Periodontal disease'],
    contraindications: ['Chlorhexidine allergy'],
    sideEffects: ['Tooth staining', 'Altered taste', 'Tartar buildup'],
    interactions: [],
  },

  // Antifungal
  {
    id: 'nystatin',
    name: 'Nystatin',
    genericName: 'Nystatin',
    brandNames: ['Mycostatin'],
    category: 'antifungal',
    form: 'suspension',
    strengths: ['100,000 units/ml'],
    usualDosage: '4-6ml swish and swallow 4 times daily',
    indications: ['Oral candidiasis (thrush)'],
    contraindications: ['Nystatin allergy'],
    sideEffects: ['Nausea', 'Diarrhea', 'Mouth irritation'],
    interactions: [],
  },
];

// =====================================================
// Prescription Templates
// =====================================================

export const PRESCRIPTION_TEMPLATES: PrescriptionTemplate[] = [
  {
    id: 'tooth-infection',
    name: 'Tooth Infection (Standard)',
    category: 'infection',
    medications: [
      {
        medicationId: 'amox-500',
        medicationName: 'Amoxicillin 500mg',
        dosage: '500mg',
        frequency: 'Every 8 hours',
        duration: '7 days',
        instructions: 'Take with food to reduce stomach upset. Complete entire course.',
      },
      {
        medicationId: 'ibu-600',
        medicationName: 'Ibuprofen 600mg',
        dosage: '600mg',
        frequency: 'Every 6-8 hours as needed',
        duration: '5 days',
        instructions: 'Take with food. Do not exceed 3200mg per day.',
      },
    ],
  },
  {
    id: 'tooth-infection-allergic',
    name: 'Tooth Infection (Penicillin Allergy)',
    category: 'infection',
    medications: [
      {
        medicationId: 'azith-500',
        medicationName: 'Azithromycin 500mg',
        dosage: '500mg day 1, then 250mg',
        frequency: 'Once daily',
        duration: '5 days',
        instructions: 'Take on empty stomach (1 hour before or 2 hours after meals).',
      },
      {
        medicationId: 'ibu-600',
        medicationName: 'Ibuprofen 600mg',
        dosage: '600mg',
        frequency: 'Every 6-8 hours as needed',
        duration: '5 days',
        instructions: 'Take with food.',
      },
    ],
  },
  {
    id: 'post-extraction',
    name: 'Post-Extraction',
    category: 'post-op',
    medications: [
      {
        medicationId: 'ibu-600',
        medicationName: 'Ibuprofen 600mg',
        dosage: '600mg',
        frequency: 'Every 6 hours',
        duration: '3 days',
        instructions: 'Take with food. Start before numbness wears off.',
      },
      {
        medicationId: 'chlorhex-012',
        medicationName: 'Chlorhexidine 0.12%',
        dosage: '15ml',
        frequency: 'Twice daily',
        duration: '7 days',
        instructions: 'Rinse gently for 30 seconds after brushing. Do not eat/drink for 30 minutes after.',
      },
    ],
  },
  {
    id: 'severe-pain',
    name: 'Severe Dental Pain',
    category: 'pain',
    medications: [
      {
        medicationId: 'aceta-codeine',
        medicationName: 'Acetaminophen 300mg/Codeine 30mg',
        dosage: '1-2 tablets',
        frequency: 'Every 4-6 hours as needed',
        duration: '3 days',
        instructions: 'May cause drowsiness. Do not drive or operate machinery. Avoid alcohol.',
      },
      {
        medicationId: 'ibu-600',
        medicationName: 'Ibuprofen 600mg',
        dosage: '600mg',
        frequency: 'Every 8 hours with food',
        duration: '5 days',
        instructions: 'Take alternating with acetaminophen/codeine for better pain control.',
      },
    ],
  },
];

// =====================================================
// Drug Interaction Checker
// =====================================================

export const COMMON_DRUG_INTERACTIONS: DrugInteraction[] = [
  {
    medication1: 'Warfarin',
    medication2: 'Ibuprofen',
    severity: 'major',
    description: 'NSAIDs can increase bleeding risk when combined with warfarin.',
    recommendation: 'Use acetaminophen instead or monitor INR closely.',
  },
  {
    medication1: 'Warfarin',
    medication2: 'Metronidazole',
    severity: 'major',
    description: 'Metronidazole can increase warfarin effect and bleeding risk.',
    recommendation: 'Monitor INR closely and adjust warfarin dose if needed.',
  },
  {
    medication1: 'Metronidazole',
    medication2: 'Alcohol',
    severity: 'contraindicated',
    description: 'Causes disulfiram-like reaction (nausea, vomiting, flushing).',
    recommendation: 'Avoid alcohol during treatment and for 48 hours after last dose.',
  },
  {
    medication1: 'Amoxicillin',
    medication2: 'Oral Contraceptives',
    severity: 'moderate',
    description: 'May decrease effectiveness of oral contraceptives.',
    recommendation: 'Use backup contraception during antibiotic treatment.',
  },
];

export function checkDrugInteractions(
  medications: string[],
  patientMedications: string[]
): DrugInteraction[] {
  const allMeds = [...medications, ...patientMedications];
  const interactions: DrugInteraction[] = [];

  for (let i = 0; i < allMeds.length; i++) {
    for (let j = i + 1; j < allMeds.length; j++) {
      const interaction = COMMON_DRUG_INTERACTIONS.find(
        (inter) =>
          (inter.medication1.toLowerCase() === allMeds[i].toLowerCase() &&
            inter.medication2.toLowerCase() === allMeds[j].toLowerCase()) ||
          (inter.medication1.toLowerCase() === allMeds[j].toLowerCase() &&
            inter.medication2.toLowerCase() === allMeds[i].toLowerCase())
      );

      if (interaction) {
        interactions.push(interaction);
      }
    }
  }

  return interactions;
}
