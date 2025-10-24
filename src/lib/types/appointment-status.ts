// Shared appointment status types for Doctor ↔ Front Desk integration

export type AppointmentStatus = 
  | 'scheduled'      // Front Desk: Appointment booked
  | 'checked-in'     // Front Desk: Patient arrived and checked in → Shows in Doctor's "Waiting" list
  | 'in-progress'    // Doctor: Exam started
  | 'completed'      // Doctor: Exam finished → Ready for Front Desk checkout
  | 'ready-checkout' // Doctor: Sent to Front Desk → Shows in Front Desk "Checkout Queue"
  | 'checked-out'    // Front Desk: Payment processed, invoice generated
  | 'cancelled'      // Either: Appointment cancelled
  | 'no-show';       // Front Desk: Patient didn't arrive

export interface PatientStatusUpdate {
  appointmentId: string;
  patientId: string;
  patientName: string;
  previousStatus: AppointmentStatus;
  newStatus: AppointmentStatus;
  timestamp: Date;
  updatedBy: {
    role: 'doctor' | 'front-desk';
    userId: string;
    userName: string;
  };
  metadata?: {
    // For completed exams
    examId?: string;
    procedures?: string[];
    prescriptions?: string[];
    totalCost?: number;
    notes?: string;
    
    // For scheduling
    followUpDate?: string;
    followUpType?: string;
  };
}

export interface WaitingPatient {
  appointmentId: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  checkInTime: string;
  appointmentTime: string;
  type: 'checkup' | 'treatment' | 'consultation' | 'emergency';
  chiefComplaint?: string;
  insuranceStatus?: 'verified' | 'pending' | 'none';
  criticalAlerts?: string[];
  roomNumber?: string;
}

export interface CheckoutPatient {
  appointmentId: string;
  patientId: string;
  patientName: string;
  examId: string;
  completedTime: string;
  doctor: string;
  procedures: Array<{
    id: string;
    name: string;
    toothNumber?: string;
    cost: number;
  }>;
  prescriptions: Array<{
    id: string;
    medication: string;
    dosage: string;
    frequency: string;
    duration: string;
  }>;
  totalCost: number;
  insuranceCoverage?: number;
  patientResponsibility: number;
  followUpRequired: boolean;
  followUpDate?: string;
  clinicalNotes?: string;
}

// Mock notification system - in real app, use WebSockets or Supabase Realtime
export class AppointmentNotificationService {
  private static listeners: Map<string, ((update: PatientStatusUpdate) => void)[]> = new Map();

  static subscribe(role: 'doctor' | 'front-desk', callback: (update: PatientStatusUpdate) => void) {
    if (!this.listeners.has(role)) {
      this.listeners.set(role, []);
    }
    this.listeners.get(role)!.push(callback);
  }

  static unsubscribe(role: 'doctor' | 'front-desk', callback: (update: PatientStatusUpdate) => void) {
    const callbacks = this.listeners.get(role);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  static notify(update: PatientStatusUpdate) {
    // Notify the opposite role
    const targetRole = update.updatedBy.role === 'doctor' ? 'front-desk' : 'doctor';
    const callbacks = this.listeners.get(targetRole);
    
    if (callbacks) {
      callbacks.forEach(callback => callback(update));
    }

    // In real app, also save to database
    console.log('Status Update:', update);
  }
}
