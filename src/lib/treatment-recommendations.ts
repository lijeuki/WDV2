// Treatment Recommendation Engine
// Auto-generates treatment plans from odontogram findings with clinical reasoning

import { ToothData, DENTAL_SYMBOLS } from './odontogram-types';

export interface TreatmentRecommendation {
  id: string;
  toothNumber: string;
  toothName: string;
  finding: string;
  findingCode: string;
  recommendedProcedure: string;
  procedureCode: string;
  clinicalReasoning: string;
  priority: 'urgent' | 'important' | 'elective';
  estimatedCost: number;
  estimatedDuration: number; // in minutes
  surfaces?: string[];
  prerequisites?: string[];
  alternatives?: string[];
}

// Treatment mapping based on ISO 3950 / FDI symbols
const treatmentProtocols: Record<string, {
  procedure: string;
  code: string;
  reasoning: string;
  priority: 'urgent' | 'important' | 'elective';
  costRange: [number, number];
  duration: number;
  prerequisites?: string[];
  alternatives?: string[];
}> = {
  // Caries / Cavity findings
  'C': {
    procedure: 'Composite Restoration',
    code: 'D2391',
    reasoning: 'Active caries detected. Requires removal of decayed tissue and restoration to prevent progression and restore function.',
    priority: 'important',
    costRange: [150, 300],
    duration: 45,
    alternatives: ['Amalgam Restoration', 'Glass Ionomer Restoration']
  },
  'FR': {
    procedure: 'Tooth Extraction',
    code: 'D7140',
    reasoning: 'Tooth is fractured beyond repair. Extraction recommended to prevent infection and pain.',
    priority: 'urgent',
    costRange: [150, 400],
    duration: 30,
    alternatives: ['Root Canal + Crown (if fracture is repairable)']
  },
  'IM': {
    procedure: 'Impacted Tooth Removal',
    code: 'D7240',
    reasoning: 'Impacted tooth causing pain or risk of cyst formation. Surgical extraction recommended.',
    priority: 'important',
    costRange: [300, 800],
    duration: 60,
    prerequisites: ['Panoramic X-ray', 'Surgical consultation']
  },
  'NV': {
    procedure: 'Tooth Extraction',
    code: 'D7140',
    reasoning: 'Non-vital tooth with necrotic pulp. Requires either extraction or root canal therapy.',
    priority: 'urgent',
    costRange: [150, 400],
    duration: 30,
    alternatives: ['Root Canal Therapy + Crown']
  },
  'RC': {
    procedure: 'Root Canal Therapy',
    code: 'D3310',
    reasoning: 'Root canal already initiated or indicated. Complete endodontic treatment to save tooth.',
    priority: 'urgent',
    costRange: [800, 1500],
    duration: 90,
    prerequisites: ['Vitality test', 'Periapical radiograph']
  },
  'CR': {
    procedure: 'Crown Replacement',
    code: 'D2740',
    reasoning: 'Existing crown is failing or has recurrent decay. New crown needed to protect tooth structure.',
    priority: 'important',
    costRange: [1000, 2000],
    duration: 120,
    prerequisites: ['Root canal if pulp is exposed']
  },
  'AB': {
    procedure: 'Incision and Drainage + Antibiotic Therapy',
    code: 'D7510',
    reasoning: 'Abscess present - acute infection requiring immediate drainage and antibiotic coverage.',
    priority: 'urgent',
    costRange: [200, 500],
    duration: 30,
    prerequisites: ['Pain assessment', 'Antibiotic prescription']
  },
  'AM': {
    procedure: 'Amalgam Restoration Replacement',
    code: 'D2160',
    reasoning: 'Old amalgam restoration shows signs of wear or recurrent decay. Replacement recommended.',
    priority: 'elective',
    costRange: [150, 250],
    duration: 45
  },
  'BR': {
    procedure: 'Bridge Replacement',
    code: 'D6740',
    reasoning: 'Existing bridge is failing. New fixed partial denture needed to restore function.',
    priority: 'important',
    costRange: [2500, 5000],
    duration: 180,
    prerequisites: ['Assessment of abutment teeth']
  },
  'M': {
    procedure: 'Prosthodontic Consultation',
    code: 'D9310',
    reasoning: 'Missing tooth. Options include implant, bridge, or partial denture to restore function and aesthetics.',
    priority: 'elective',
    costRange: [100, 200],
    duration: 30,
    alternatives: ['Dental Implant', 'Fixed Bridge', 'Removable Partial Denture']
  }
};

// Tooth naming helper
const getToothName = (toothNumber: string): string => {
  const toothNum = parseInt(toothNumber);
  
  // Permanent teeth
  if (toothNum >= 11 && toothNum <= 18) return 'Upper Right Tooth';
  if (toothNum >= 21 && toothNum <= 28) return 'Upper Left Tooth';
  if (toothNum >= 31 && toothNum <= 38) return 'Lower Left Tooth';
  if (toothNum >= 41 && toothNum <= 48) return 'Lower Right Tooth';
  
  // Primary teeth
  if (toothNum >= 51 && toothNum <= 55) return 'Upper Right Primary Tooth';
  if (toothNum >= 61 && toothNum <= 65) return 'Upper Left Primary Tooth';
  if (toothNum >= 71 && toothNum <= 75) return 'Lower Left Primary Tooth';
  if (toothNum >= 81 && toothNum <= 85) return 'Lower Right Primary Tooth';
  
  return 'Tooth';
};

// Generate treatment recommendations from odontogram data
export function generateTreatmentRecommendations(
  teethData: Record<string, ToothData>
): TreatmentRecommendation[] {
  const recommendations: TreatmentRecommendation[] = [];
  let idCounter = 1;

  Object.entries(teethData).forEach(([toothNumber, toothData]) => {
    if (!toothData.conditions || toothData.conditions.length === 0) return;

    toothData.conditions.forEach((condition) => {
      const symbol = DENTAL_SYMBOLS[condition.symbolId];
      if (!symbol) return;

      const protocol = treatmentProtocols[symbol.code];
      if (!protocol) {
        // No specific treatment protocol, skip or create generic recommendation
        return;
      }

      // Calculate estimated cost (randomize within range for realism)
      const costMin = protocol.costRange[0];
      const costMax = protocol.costRange[1];
      const estimatedCost = Math.floor(costMin + (Math.random() * (costMax - costMin)));

      const surfaces = Array.isArray(condition.surfaces) 
        ? condition.surfaces 
        : condition.surfaces === 'whole' 
          ? ['whole tooth'] 
          : [];

      const recommendation: TreatmentRecommendation = {
        id: `TR${idCounter++}`,
        toothNumber,
        toothName: `${getToothName(toothNumber)} #${toothNumber}`,
        finding: symbol.name,
        findingCode: symbol.code,
        recommendedProcedure: protocol.procedure,
        procedureCode: protocol.code,
        clinicalReasoning: protocol.reasoning,
        priority: protocol.priority,
        estimatedCost,
        estimatedDuration: protocol.duration,
        surfaces,
        prerequisites: protocol.prerequisites,
        alternatives: protocol.alternatives
      };

      // Enhance reasoning with surface-specific information
      if (surfaces.length > 0 && surfaces[0] !== 'whole tooth') {
        recommendation.clinicalReasoning += ` Affected surfaces: ${surfaces.join(', ')}.`;
      }

      recommendations.push(recommendation);
    });
  });

  // Sort by priority: urgent → important → elective
  const priorityOrder = { urgent: 0, important: 1, elective: 2 };
  recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return recommendations;
}

// Calculate total treatment plan cost
export function calculateTotalCost(recommendations: TreatmentRecommendation[]): number {
  return recommendations.reduce((total, rec) => total + rec.estimatedCost, 0);
}

// Calculate total treatment duration
export function calculateTotalDuration(recommendations: TreatmentRecommendation[]): number {
  return recommendations.reduce((total, rec) => total + rec.estimatedDuration, 0);
}

// Group recommendations by priority
export function groupByPriority(recommendations: TreatmentRecommendation[]): {
  urgent: TreatmentRecommendation[];
  important: TreatmentRecommendation[];
  elective: TreatmentRecommendation[];
} {
  return {
    urgent: recommendations.filter(r => r.priority === 'urgent'),
    important: recommendations.filter(r => r.priority === 'important'),
    elective: recommendations.filter(r => r.priority === 'elective')
  };
}

// Get clinical summary for treatment plan presentation
export function generateClinicalSummary(recommendations: TreatmentRecommendation[]): string {
  const grouped = groupByPriority(recommendations);
  
  let summary = 'Clinical Assessment Summary:\n\n';
  
  if (grouped.urgent.length > 0) {
    summary += `URGENT FINDINGS (${grouped.urgent.length}):\n`;
    grouped.urgent.forEach(rec => {
      summary += `- ${rec.toothName}: ${rec.finding} → ${rec.recommendedProcedure}\n`;
    });
    summary += '\n';
  }
  
  if (grouped.important.length > 0) {
    summary += `IMPORTANT FINDINGS (${grouped.important.length}):\n`;
    grouped.important.forEach(rec => {
      summary += `- ${rec.toothName}: ${rec.finding} → ${rec.recommendedProcedure}\n`;
    });
    summary += '\n';
  }
  
  if (grouped.elective.length > 0) {
    summary += `ELECTIVE TREATMENTS (${grouped.elective.length}):\n`;
    grouped.elective.forEach(rec => {
      summary += `- ${rec.toothName}: ${rec.finding} → ${rec.recommendedProcedure}\n`;
    });
    summary += '\n';
  }
  
  const totalCost = calculateTotalCost(recommendations);
  const totalDuration = calculateTotalDuration(recommendations);
  
  summary += `\nTotal Estimated Cost: $${totalCost.toLocaleString()}\n`;
  summary += `Total Estimated Time: ${totalDuration} minutes (${Math.ceil(totalDuration / 60)} hours)\n`;
  
  return summary;
}
