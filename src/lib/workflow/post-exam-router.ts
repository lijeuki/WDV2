/**
 * Post-Exam Routing Logic
 * Determines where to route patient after exam completion based on findings
 */

import { ExamData, TreatmentPlan } from '../types/dental';

export interface PostExamRouting {
  nextStep: 'checkout' | 'treatment-coordinator' | 'urgent-scheduling' | 'front-desk';
  assignedTo: 'Front Desk' | 'Treatment Coordinator' | 'Doctor';
  urgency: 'routine' | 'high' | 'urgent';
  reason: string;
  suggestedActions: string[];
  navigationPath: string;
}

export interface TreatmentAnalysis {
  totalValue: number;
  procedureCount: number;
  hasUrgentFindings: boolean;
  complexityScore: number;
  urgentProcedures: string[];
  highValueProcedures: string[];
}

/**
 * Analyze treatment plan to determine routing
 */
export function analyzeTreatmentPlan(
  treatmentPlan?: TreatmentPlan
): TreatmentAnalysis {
  if (!treatmentPlan || !treatmentPlan.procedures) {
    return {
      totalValue: 0,
      procedureCount: 0,
      hasUrgentFindings: false,
      complexityScore: 0,
      urgentProcedures: [],
      highValueProcedures: []
    };
  }

  const totalValue = treatmentPlan.procedures.reduce(
    (sum, p) => sum + (p.estimatedCost || 0), 
    0
  );
  
  const procedureCount = treatmentPlan.procedures.length;
  
  // Check for urgent procedures
  const urgentCodes = [
    'D3310', 'D3320', 'D3330', // Root canals
    'D7140', 'D7210', 'D7240', // Extractions
    'D0140' // Emergency exam
  ];
  
  const urgentProcedures = treatmentPlan.procedures
    .filter(p => 
      urgentCodes.includes(p.procedureCode) || 
      p.priority === 'urgent'
    )
    .map(p => p.procedureName);
  
  const hasUrgentFindings = urgentProcedures.length > 0;
  
  // High value procedures (>= 5M IDR)
  const highValueProcedures = treatmentPlan.procedures
    .filter(p => (p.estimatedCost || 0) >= 5000000)
    .map(p => p.procedureName);
  
  // Calculate complexity score
  let complexityScore = 0;
  if (procedureCount > 3) complexityScore += 2;
  if (totalValue > 10000000) complexityScore += 3;
  if (hasUrgentFindings) complexityScore += 2;
  if (highValueProcedures.length > 0) complexityScore += 2;
  
  return {
    totalValue,
    procedureCount,
    hasUrgentFindings,
    complexityScore,
    urgentProcedures,
    highValueProcedures
  };
}

/**
 * Determine optimal routing after exam completion
 */
export function determinePostExamRouting(
  _examData: ExamData,
  treatmentPlan?: TreatmentPlan,
  patientId?: string
): PostExamRouting {
  const analysis = analyzeTreatmentPlan(treatmentPlan);
  
  // URGENT: Pain, infection, emergency
  if (analysis.hasUrgentFindings) {
    return {
      nextStep: 'urgent-scheduling',
      assignedTo: 'Front Desk',
      urgency: 'urgent',
      reason: 'Patient has urgent clinical needs requiring immediate scheduling',
      suggestedActions: [
        'Schedule within 24-48 hours',
        'Call patient today to confirm',
        'Prioritize in appointment queue',
        'Consider same-day scheduling if available'
      ],
      navigationPath: `/checkout/${patientId}`
    };
  }
  
  // HIGH-VALUE: Complex or expensive treatment (>5M IDR or >3 procedures)
  if (analysis.totalValue > 5000000 || analysis.procedureCount > 3) {
    return {
      nextStep: 'treatment-coordinator',
      assignedTo: 'Treatment Coordinator',
      urgency: 'high',
      reason: 'High-value treatment plan requires consultation and patient education',
      suggestedActions: [
        'Review treatment plan with patient in detail',
        'Discuss payment options and insurance coverage',
        'Provide treatment alternatives if available',
        'Schedule first appointment after acceptance',
        'Verify insurance benefits before scheduling'
      ],
      navigationPath: `/checkout/${patientId}`
    };
  }
  
  // ROUTINE: Simple treatment (< 3 procedures, < 5M IDR)
  return {
    nextStep: 'checkout',
    assignedTo: 'Front Desk',
    urgency: 'routine',
    reason: 'Standard treatment plan can proceed to checkout',
    suggestedActions: [
      'Process payment for today\'s exam',
      'Schedule next appointment',
      'Print treatment summary',
      'Collect any required deposits',
      'Provide post-exam instructions'
    ],
    navigationPath: `/checkout/${patientId}`
  };
}

/**
 * Generate notification message for staff
 */
export function generateRoutingNotification(routing: PostExamRouting, patientName: string): string {
  const urgencyEmoji = {
    urgent: '🚨',
    high: '⚠️',
    routine: '✅'
  };
  
  return `${urgencyEmoji[routing.urgency]} ${routing.assignedTo}: ${patientName} - ${routing.reason}`;
}

/**
 * Calculate estimated checkout time based on routing
 */
export function estimateCheckoutDuration(routing: PostExamRouting): number {
  switch (routing.nextStep) {
    case 'urgent-scheduling':
      return 3; // 3 minutes - quick scheduling
    case 'treatment-coordinator':
      return 15; // 15 minutes - detailed consultation
    case 'checkout':
    case 'front-desk':
      return 5; // 5 minutes - standard checkout
    default:
      return 5;
  }
}
