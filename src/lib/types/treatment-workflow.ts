// Treatment-Centric Workflow Types (Based on New_DentalFlowv2.md)

export type TreatmentStatus = 
  | 'created'
  | 'presented_to_patient'
  | 'approved_immediate'
  | 'approved_scheduled'
  | 'prepped'
  | 'anesthesia_applied'
  | 'in_progress'
  | 'completed'
  | 'archived'
  | 'deferred'
  | 'on_hold'
  | 'cancelled'
  | 'referred';

export type TreatmentDecision = 'immediate' | 'schedule' | 'defer';

export interface AnesthesiaRecord {
  type: 'local' | 'iv_sedation' | 'nitrous_oxide' | 'general' | 'topical';
  agentName: string;
  totalDoseMg: number;
  concentration: string;
  injectionSites?: ('buccal' | 'lingual' | 'palatal' | 'infiltration' | 'block')[];
  numberOfInjections?: number;
  injectionTime: string;
  onsetTimeMinutes: number;
  vitalsBeforeAnesthesia: {
    bloodPressure: string;
    heartRate: number;
    oxygenSaturation: number;
  };
  vitalsAfterAnesthesia: {
    bloodPressure: string;
    heartRate: number;
    oxygenSaturation: number;
  };
  patientTolerance?: string;
  complications?: string[];
  documentedBy: string;
  documentedAt: Date;
}

export interface ProceduralNotes {
  treatmentItemId: string;
  startTime: Date;
  endTime?: Date;
  actualDurationMinutes?: number;
  deviationFromPlan?: string;
  materialsUsed: Array<{
    material: string;
    shade?: string;
    batchNumber?: string;
    manufacturer?: string;
  }>;
  toothSurfacesTreated: string[];
  stepByStepNotes: string;
  operativeAssistant?: string;
  complications?: Array<{
    type: string;
    details: string;
    actionTaken: string;
  }>;
  photoReferences?: string[];
  intraoperativeVitals?: string;
  proceduralQualityNote?: string;
  documentedBy: string;
}

export interface PostTreatmentDocumentation {
  completionStatus: 'completed_successfully' | 'completed_with_issues' | 'incomplete_rescheduled';
  postOpVitals?: {
    bloodPressure: string;
    heartRate: number;
    oxygenSaturation: number;
  };
  anesthesiaReversal?: string;
  postOpInstructions: string;
  painManagementPlan: string;
  dietaryRestrictions?: string;
  activityRestrictions?: string;
  medicationsPrescribed?: string[];
  followUpNeeded: 'none' | 'review_1week' | 'review_2weeks' | 'review_3months' | 'custom';
  followUpDate?: string;
  followUpScheduled: boolean;
  patientAcknowledgment: boolean;
  patientSignature?: string;
  patientSignatureDate?: Date;
}

export interface TreatmentCompletionSummary {
  planItemId: string;
  treatmentActuallyPerformed: string;
  cptCodes: string[];
  diagnosisCodes: string[];
  procedureTimeActual: number;
  insuranceSubmissionStatus: 'ready' | 'pre_auth_pending' | 'patient_responsible';
  chargeAmount: number;
  patientResponsibility: number;
  paymentReceived?: number;
  paymentStatus: 'paid' | 'deferred' | 'payment_plan';
  finalApprovalSignature: string;
  finalApprovalDate: Date;
  treatmentArchived: boolean;
}

export interface TreatmentAuthorization {
  treatmentPlanItemId: string;
  authorizedTreatment: string;
  authorizedCost: number;
  patientSignature: string;
  signatureDateTime: Date;
  guardianSignature?: string; // If patient is minor
  consentToAnesthesia: boolean;
  consentToBloodbornePathogen: boolean;
  insurancePreAuth?: 'approved' | 'pending' | 'not_required';
}

export interface TreatmentWorkflowState {
  examId: string;
  patientId: string;
  decision: TreatmentDecision | null;
  authorization?: TreatmentAuthorization;
  anesthesia?: AnesthesiaRecord;
  procedural?: ProceduralNotes;
  postTreatment?: PostTreatmentDocumentation;
  completion?: TreatmentCompletionSummary;
  currentStatus: TreatmentStatus;
  createdAt: Date;
  updatedAt: Date;
}
