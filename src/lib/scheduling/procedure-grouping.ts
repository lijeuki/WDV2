/**
 * Intelligent Procedure Grouping Logic
 * Groups treatment procedures into logical visits based on clinical sequencing and constraints
 */

import { TreatmentProcedure } from '@/lib/types/dental';

export interface VisitGroup {
  id: string;
  visitNumber: number;
  procedures: TreatmentProcedure[];
  totalDuration: number;
  totalCost: number;
  clinicalSequence: number;
  requiresPriorVisit?: string; // ID of visit that must be completed first
  notes: string;
  appointmentId?: string;
  appointmentDate?: string;
  appointmentTime?: string;
}

export interface GroupingConstraints {
  maxDurationPerVisit: number; // minutes
  maxProceduresPerVisit: number;
  allowMultipleQuadrants: boolean;
  preferAdjacentTeeth: boolean;
}

const DEFAULT_CONSTRAINTS: GroupingConstraints = {
  maxDurationPerVisit: 180, // 3 hours
  maxProceduresPerVisit: 4,
  allowMultipleQuadrants: true,
  preferAdjacentTeeth: true,
};

/**
 * Clinical sequencing rules - procedures that must be done in specific order
 * Note: Used for reference, actual logic implemented in requiresSequencing()
 */
// const SEQUENCING_RULES = {
//   beforeCrown: ['root-canal', 'core-buildup'],
//   beforeImplant: ['extraction', 'bone-graft'],
//   beforeBridge: ['root-canal', 'core-buildup'],
//   beforeRestorative: ['cleaning', 'scaling-root-planing', 'periodontal-treatment'],
//   emergency: ['extraction-emergency', 'abscess-drainage', 'emergency-endo'],
// };

/**
 * Procedure codes mapped to categories
 */
const PROCEDURE_CATEGORIES = {
  emergency: ['D7140-emergency', 'D0140'],
  extraction: ['D7140', 'D7210', 'D7240'],
  rootCanal: ['D3310', 'D3320', 'D3330'],
  crown: ['D2740', 'D2750', 'D2751'],
  implant: ['D6010', 'D6056', 'D6057'],
  cleaning: ['D1110', 'D1120'],
  periodontal: ['D4341', 'D4342'],
  filling: ['D2140', 'D2150', 'D2160', 'D2330', 'D2335'],
};

/**
 * Get procedure category from code
 */
function getProcedureCategory(procedureCode: string): string {
  for (const [category, codes] of Object.entries(PROCEDURE_CATEGORIES)) {
    if (codes.includes(procedureCode)) {
      return category;
    }
  }
  return 'other';
}

/**
 * Calculate clinical sequence order (lower = earlier)
 */
function getSequenceOrder(procedureCode: string): number {
  const category = getProcedureCategory(procedureCode);
  
  const sequenceMap: Record<string, number> = {
    emergency: 1,
    cleaning: 2,
    periodontal: 2,
    extraction: 3,
    rootCanal: 4,
    filling: 5,
    crown: 6,
    implant: 7,
    other: 5,
  };
  
  return sequenceMap[category] || 5;
}

/**
 * Check if two procedures require sequencing (one must come before the other)
 */
function requiresSequencing(proc1Code: string, proc2Code: string): boolean {
  const cat1 = getProcedureCategory(proc1Code);
  const cat2 = getProcedureCategory(proc2Code);
  
  // Root canal must come before crown on same tooth
  if (cat1 === 'rootCanal' && cat2 === 'crown') return true;
  if (cat1 === 'extraction' && cat2 === 'implant') return true;
  if (cat1 === 'periodontal' && cat2 === 'filling') return true;
  
  return false;
}

/**
 * Get teeth in same quadrant
 */
function getQuadrant(toothNumber: number): number {
  if (toothNumber >= 11 && toothNumber <= 18) return 1; // Upper right
  if (toothNumber >= 21 && toothNumber <= 28) return 2; // Upper left
  if (toothNumber >= 31 && toothNumber <= 38) return 3; // Lower left
  if (toothNumber >= 41 && toothNumber <= 48) return 4; // Lower right
  return 0;
}

/**
 * Check if teeth are adjacent
 * Note: Available for future use in enhanced grouping logic
 */
// function areAdjacent(tooth1: number, tooth2: number): boolean {
//   return Math.abs(tooth1 - tooth2) === 1;
// }

/**
 * Group procedures into logical visits
 */
export function groupProceduresIntoVisits(
  procedures: TreatmentProcedure[],
  constraints: Partial<GroupingConstraints> = {}
): VisitGroup[] {
  const finalConstraints = { ...DEFAULT_CONSTRAINTS, ...constraints };
  const visitGroups: VisitGroup[] = [];
  
  // Sort procedures by clinical sequence first
  const sortedProcedures = [...procedures].sort((a, b) => {
    const seqA = getSequenceOrder(a.procedureCode);
    const seqB = getSequenceOrder(b.procedureCode);
    
    if (seqA !== seqB) return seqA - seqB;
    
    // Then by priority
    const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
  
  let currentVisit: TreatmentProcedure[] = [];
  let currentDuration = 0;
  let visitNumber = 1;
  
  for (const procedure of sortedProcedures) {
    const procDuration = procedure.estimatedDuration || 0;
    
    // Check if adding this procedure exceeds constraints
    const wouldExceedDuration = currentDuration + procDuration > finalConstraints.maxDurationPerVisit;
    const wouldExceedCount = currentVisit.length >= finalConstraints.maxProceduresPerVisit;
    
    // Check if procedure can be grouped with current visit
    let canGroup = !wouldExceedDuration && !wouldExceedCount;
    
    // Additional grouping logic
    if (canGroup && currentVisit.length > 0) {
      const lastProc = currentVisit[currentVisit.length - 1];
      
      // Check quadrant constraint
      if (!finalConstraints.allowMultipleQuadrants && procedure.toothNumber && lastProc.toothNumber) {
        const currentQuadrant = getQuadrant(procedure.toothNumber);
        const lastQuadrant = getQuadrant(lastProc.toothNumber);
        if (currentQuadrant !== lastQuadrant) {
          canGroup = false;
        }
      }
      
      // Check if sequencing required (e.g., root canal before crown)
      if (requiresSequencing(lastProc.procedureCode, procedure.procedureCode)) {
        canGroup = false; // Must be in different visits
      }
    }
    
    // Emergency procedures always get their own visit
    if (getProcedureCategory(procedure.procedureCode) === 'emergency') {
      if (currentVisit.length > 0) {
        // Save current visit
        visitGroups.push(createVisitGroup(visitNumber++, currentVisit));
        currentVisit = [];
        currentDuration = 0;
      }
    }
    
    if (canGroup) {
      currentVisit.push(procedure);
      currentDuration += procDuration;
    } else {
      // Start new visit
      if (currentVisit.length > 0) {
        visitGroups.push(createVisitGroup(visitNumber++, currentVisit));
      }
      currentVisit = [procedure];
      currentDuration = procDuration;
    }
  }
  
  // Add remaining procedures
  if (currentVisit.length > 0) {
    visitGroups.push(createVisitGroup(visitNumber, currentVisit));
  }
  
  // Add sequencing dependencies
  addSequencingDependencies(visitGroups);
  
  return visitGroups;
}

/**
 * Create a visit group from procedures
 */
function createVisitGroup(visitNumber: number, procedures: TreatmentProcedure[]): VisitGroup {
  const totalDuration = procedures.reduce((sum, p) => sum + (p.estimatedDuration || 0), 0);
  const totalCost = procedures.reduce((sum, p) => sum + (p.estimatedCost || 0), 0);
  
  // Generate notes based on procedures
  const categories = new Set(procedures.map(p => getProcedureCategory(p.procedureCode)));
  const notes = generateVisitNotes(categories, procedures);
  
  return {
    id: `visit-${visitNumber}`,
    visitNumber,
    procedures,
    totalDuration,
    totalCost,
    clinicalSequence: visitNumber,
    notes,
  };
}

/**
 * Generate descriptive notes for a visit
 */
function generateVisitNotes(categories: Set<string>, procedures: TreatmentProcedure[]): string {
  const notes: string[] = [];
  
  if (categories.has('emergency')) {
    notes.push('⚠️ Emergency treatment');
  }
  
  if (categories.has('cleaning') || categories.has('periodontal')) {
    notes.push('🦷 Cleaning/Periodontal treatment recommended before restorative work');
  }
  
  if (categories.has('rootCanal')) {
    notes.push('🔧 Root canal treatment - crown will be scheduled in subsequent visit');
  }
  
  if (categories.has('extraction')) {
    notes.push('🦷 Extraction - healing time required before implant placement');
  }
  
  if (categories.has('implant')) {
    notes.push('🔩 Implant placement - integration period required');
  }
  
  // Check for same-tooth procedures
  const toothNumbers = procedures.map(p => p.toothNumber).filter(Boolean);
  const uniqueTeeth = new Set(toothNumbers);
  if (uniqueTeeth.size > 1) {
    notes.push(`📍 Multiple teeth: ${Array.from(uniqueTeeth).join(', ')}`);
  }
  
  return notes.join(' • ') || 'Standard treatment visit';
}

/**
 * Add sequencing dependencies between visits
 */
function addSequencingDependencies(visitGroups: VisitGroup[]): void {
  for (let i = 1; i < visitGroups.length; i++) {
    const currentVisit = visitGroups[i];
    const previousVisit = visitGroups[i - 1];
    
    // Check if any procedure in current visit requires previous visit completion
    for (const currentProc of currentVisit.procedures) {
      for (const prevProc of previousVisit.procedures) {
        if (requiresSequencing(prevProc.procedureCode, currentProc.procedureCode)) {
          currentVisit.requiresPriorVisit = previousVisit.id;
          break;
        }
      }
      if (currentVisit.requiresPriorVisit) break;
    }
  }
}

/**
 * Get recommended healing time between visits (in days)
 */
export function getHealingTimeBetweenVisits(
  completedVisit: VisitGroup,
  nextVisit: VisitGroup
): number {
  const completedCategories = completedVisit.procedures.map(p => 
    getProcedureCategory(p.procedureCode)
  );
  
  // Extraction → Implant: 3-6 months
  if (completedCategories.includes('extraction') && 
      nextVisit.procedures.some(p => getProcedureCategory(p.procedureCode) === 'implant')) {
    return 90; // 3 months minimum
  }
  
  // Root canal → Crown: 1-2 weeks
  if (completedCategories.includes('rootCanal') && 
      nextVisit.procedures.some(p => getProcedureCategory(p.procedureCode) === 'crown')) {
    return 7; // 1 week minimum
  }
  
  // Periodontal → Restorative: 1-2 weeks
  if (completedCategories.includes('periodontal') && 
      nextVisit.procedures.some(p => getProcedureCategory(p.procedureCode) === 'filling')) {
    return 7; // 1 week minimum
  }
  
  // Emergency → Follow-up: 2-3 days
  if (completedCategories.includes('emergency')) {
    return 2;
  }
  
  // Default: 1 week between visits
  return 7;
}

/**
 * Validate if a visit group is schedulable (all dependencies met)
 */
export function isVisitSchedulable(
  visit: VisitGroup,
  allVisits: VisitGroup[]
): { schedulable: boolean; reason?: string } {
  // Check if requires prior visit
  if (visit.requiresPriorVisit) {
    const priorVisit = allVisits.find(v => v.id === visit.requiresPriorVisit);
    
    if (!priorVisit?.appointmentId) {
      return {
        schedulable: false,
        reason: `Visit ${priorVisit?.visitNumber} must be scheduled first`,
      };
    }
    
    if (!priorVisit.appointmentDate) {
      return {
        schedulable: false,
        reason: `Visit ${priorVisit?.visitNumber} must be completed first`,
      };
    }
  }
  
  return { schedulable: true };
}

/**
 * Get suggested appointment date for a visit
 */
export function getSuggestedAppointmentDate(
  visit: VisitGroup,
  allVisits: VisitGroup[]
): Date {
  const today = new Date();
  
  // If no dependencies, can schedule ASAP
  if (!visit.requiresPriorVisit) {
    // Emergency: tomorrow
    const hasEmergency = visit.procedures.some(
      p => getProcedureCategory(p.procedureCode) === 'emergency'
    );
    if (hasEmergency) {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow;
    }
    
    // Normal: 3-7 days out
    const suggested = new Date(today);
    suggested.setDate(suggested.getDate() + 3);
    return suggested;
  }
  
  // If has dependencies, calculate based on prior visit
  const priorVisit = allVisits.find(v => v.id === visit.requiresPriorVisit);
  if (priorVisit?.appointmentDate) {
    const priorDate = new Date(priorVisit.appointmentDate);
    const healingDays = getHealingTimeBetweenVisits(priorVisit, visit);
    
    const suggested = new Date(priorDate);
    suggested.setDate(suggested.getDate() + healingDays);
    return suggested;
  }
  
  // Fallback: 1 week from today
  const fallback = new Date(today);
  fallback.setDate(fallback.getDate() + 7);
  return fallback;
}
