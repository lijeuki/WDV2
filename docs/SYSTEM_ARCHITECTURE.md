# Dental EHR System Architecture
## Complete Business Process Integration

---

## 🏛️ High-Level Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                               │
│                     (User Interfaces - React)                          │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │   CLINICAL   │  │   BUSINESS   │  │   PATIENT    │               │
│  │  INTERFACES  │  │  INTERFACES  │  │    PORTAL    │               │
│  └──────────────┘  └──────────────┘  └──────────────┘               │
│         │                  │                  │                        │
│         └──────────────────┴──────────────────┘                        │
│                            │                                           │
└────────────────────────────┼───────────────────────────────────────────┘
                             ↓
┌────────────────────────────────────────────────────────────────────────┐
│                      BUSINESS LOGIC LAYER                              │
│                   (Workflow Orchestration)                            │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐│
│  │  Clinical   │  │ Scheduling  │  │  Financial  │  │Communication││
│  │  Workflow   │  │   Engine    │  │   Engine    │  │   Engine    ││
│  │   Engine    │  └─────────────┘  └─────────────┘  └─────────────┘│
│  └─────────────┘                                                      │
│         │                                                             │
└─────────┼─────────────────────────────────────────────────────────────┘
          ↓
┌────────────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                                      │
│                   (State Management & Storage)                        │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ Patient  │  │Treatment │  │ Billing  │  │Analytics │             │
│  │   Data   │  │   Plans  │  │   Data   │  │   Data   │             │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘             │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Core System Components

### 1. Clinical Interfaces (Currently Implemented ✅)

```
┌──────────────────────────────────────────────────────┐
│              CLINICAL INTERFACES                      │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ✅ Dashboard.tsx                                    │
│     └─ Overview, daily schedule, alerts             │
│                                                      │
│  ✅ PatientProfile.tsx                               │
│     └─ Patient history, demographics, visits        │
│                                                      │
│  ✅ ExamWorkflow.tsx                                 │
│     ├─ Pre-exam review                              │
│     ├─ Clinical examination (InteractiveOdontogram) │
│     ├─ Treatment plan creation                      │
│     ├─ SOAP notes                                   │
│     ├─ Prescriptions                                │
│     └─ Completion                                   │
│                                                      │
│  ✅ DentalCharting.tsx                               │
│     └─ Standalone odontogram view                   │
│                                                      │
│  ✅ TreatmentPlans.tsx                               │
│     └─ View all treatment plans                     │
│                                                      │
│  ✅ Appointments.tsx                                 │
│     └─ Schedule management                          │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### 2. Business Interfaces (TO BE IMPLEMENTED 🔨)

```
┌──────────────────────────────────────────────────────┐
│              BUSINESS INTERFACES                      │
├──────────────────────────────────────────────────────┤
│                                                      │
│  🔨 PostExamCheckout.tsx                             │
│     ├─ Treatment plan review                        │
│     ├─ Cost estimation                              │
│     ├─ Payment collection                           │
│     ├─ Next appointment scheduling                  │
│     └─ Document generation                          │
│                                                      │
│  🔨 TreatmentCoordinatorDashboard.tsx                │
│     ├─ Pending reviews queue                        │
│     ├─ Treatment presentation tools                 │
│     ├─ Acceptance tracking                          │
│     └─ Follow-up management                         │
│                                                      │
│  🔨 FinancialDashboard.tsx                           │
│     ├─ Revenue tracking                             │
│     ├─ AR aging                                     │
│     ├─ Insurance verification                       │
│     └─ Payment plans                                │
│                                                      │
│  🔨 SchedulingWorkbench.tsx                          │
│     ├─ Treatment plan → appointment conversion      │
│     ├─ Multi-visit series builder                   │
│     ├─ Resource allocation                          │
│     └─ Waitlist management                          │
│                                                      │
│  🔨 Analytics.tsx                                    │
│     ├─ Clinical quality metrics                     │
│     ├─ Financial performance                        │
│     ├─ Operational efficiency                       │
│     └─ Custom reports                               │
│                                                      │
│  🔨 CommunicationCenter.tsx                          │
│     ├─ Automated campaigns                          │
│     ├─ Manual messaging                             │
│     ├─ Communication log                            │
│     └─ Templates management                         │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### 3. Patient Portal (FUTURE 🔮)

```
┌──────────────────────────────────────────────────────┐
│               PATIENT PORTAL                         │
├──────────────────────────────────────────────────────┤
│                                                      │
│  🔮 PatientDashboard.tsx                             │
│     └─ Upcoming appointments, balances              │
│                                                      │
│  🔮 TreatmentPlanView.tsx                            │
│     └─ View and accept proposed treatments          │
│                                                      │
│  🔮 AppointmentBooking.tsx                           │
│     └─ Self-service scheduling                      │
│                                                      │
│  🔮 BillingPayments.tsx                              │
│     └─ View statements, make payments               │
│                                                      │
│  🔮 EducationLibrary.tsx                             │
│     └─ Procedure information, care instructions     │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## 🔄 Workflow Orchestration Engines

### Clinical Workflow Engine

```typescript
// /lib/engines/clinical-workflow-engine.ts

export class ClinicalWorkflowEngine {
  
  async handleExamCompletion(examData: ExamData) {
    // 1. Save clinical data
    const exam = await this.saveExam(examData);
    
    // 2. Create odontogram snapshot
    const snapshot = await this.createOdontogramSnapshot(
      examData.odontogramData,
      examData.patientId,
      examData.visitId
    );
    
    // 3. Analyze treatment plan complexity
    const analysis = this.analyzeTreatmentPlan(examData.procedures);
    
    // 4. Determine routing
    const routing = this.determinePostExamRouting(analysis);
    
    // 5. Trigger downstream workflows
    await this.triggerWorkflows(exam, routing);
    
    return {
      examId: exam.id,
      nextStep: routing.nextStep,
      assignedTo: routing.assignedTo,
      urgency: routing.urgency
    };
  }
  
  private determinePostExamRouting(analysis: TreatmentAnalysis) {
    // High-value or complex cases → Treatment Coordinator
    if (analysis.totalValue > 5000000 || analysis.complexityScore > 7) {
      return {
        nextStep: 'treatment-coordinator',
        assignedTo: 'TC',
        urgency: 'high',
        reason: 'High-value/complex treatment plan'
      };
    }
    
    // Urgent cases → Immediate scheduling
    if (analysis.hasUrgentProcedures) {
      return {
        nextStep: 'urgent-scheduling',
        assignedTo: 'Front Desk',
        urgency: 'urgent',
        reason: 'Urgent treatment needed'
      };
    }
    
    // Simple cases → Standard checkout
    return {
      nextStep: 'checkout',
      assignedTo: 'Front Desk',
      urgency: 'normal',
      reason: 'Standard treatment plan'
    };
  }
  
  private async triggerWorkflows(exam: Exam, routing: Routing) {
    // Trigger parallel workflows
    await Promise.all([
      this.notifyStaff(routing),
      this.generateDocuments(exam),
      this.updateAnalytics(exam),
      this.scheduleFollowUps(exam)
    ]);
  }
}
```

### Scheduling Engine

```typescript
// /lib/engines/scheduling-engine.ts

export class SchedulingEngine {
  
  async scheduleFromTreatmentPlan(
    treatmentPlan: TreatmentPlan,
    preferences: SchedulingPreferences
  ) {
    // 1. Analyze procedures
    const procedures = this.groupProceduresByVisit(treatmentPlan.procedures);
    
    // 2. Calculate time requirements
    const timeBlocks = this.calculateTimeBlocks(procedures);
    
    // 3. Find available slots
    const availableSlots = await this.findAvailableSlots(
      timeBlocks,
      preferences
    );
    
    // 4. Create appointment series
    const appointments = await this.createAppointmentSeries(
      availableSlots,
      procedures
    );
    
    // 5. Link to treatment plan
    await this.linkAppointmentsToTreatmentPlan(
      appointments,
      treatmentPlan.id
    );
    
    // 6. Update procedure statuses
    await this.updateProcedureStatuses(
      treatmentPlan.procedures,
      'scheduled'
    );
    
    // 7. Trigger confirmations
    await this.sendAppointmentConfirmations(appointments);
    
    return appointments;
  }
  
  private groupProceduresByVisit(procedures: Procedure[]) {
    // Intelligent grouping logic
    // - Same tooth procedures together
    // - Similar procedures together
    // - Respect clinical sequencing (e.g., RCT before crown)
    // - Consider patient fatigue (max 2-3 hours)
    
    return [
      { visitNumber: 1, procedures: [...], duration: 120 },
      { visitNumber: 2, procedures: [...], duration: 90 },
    ];
  }
}
```

### Financial Engine

```typescript
// /lib/engines/financial-engine.ts

export class FinancialEngine {
  
  async processTreatmentPlanFinancials(treatmentPlan: TreatmentPlan) {
    // 1. Calculate total cost
    const totalCost = this.calculateTotalCost(treatmentPlan.procedures);
    
    // 2. Check insurance coverage
    const insurance = await this.verifyInsuranceBenefits(
      treatmentPlan.patientId
    );
    
    // 3. Calculate patient portion
    const patientPortion = this.calculatePatientPortion(
      totalCost,
      insurance
    );
    
    // 4. Generate payment options
    const paymentOptions = this.generatePaymentOptions(patientPortion);
    
    // 5. Create financial record
    const estimate = await this.createTreatmentEstimate({
      treatmentPlanId: treatmentPlan.id,
      totalCost,
      insuranceCoverage: insurance.coverage,
      patientResponsibility: patientPortion,
      paymentOptions
    });
    
    return estimate;
  }
  
  async processPayment(payment: Payment) {
    // 1. Validate payment
    const validation = await this.validatePayment(payment);
    
    // 2. Process transaction
    const transaction = await this.processTransaction(payment);
    
    // 3. Update account balance
    await this.updateAccountBalance(
      payment.patientId,
      payment.amount
    );
    
    // 4. Generate receipt
    const receipt = await this.generateReceipt(transaction);
    
    // 5. Update treatment plan status
    if (await this.isFullyPaid(payment.treatmentPlanId)) {
      await this.updateTreatmentPlanStatus(
        payment.treatmentPlanId,
        'paid'
      );
    }
    
    return { transaction, receipt };
  }
}
```

### Communication Engine

```typescript
// /lib/engines/communication-engine.ts

export class CommunicationEngine {
  
  async handleExamCompletionCommunications(exam: Exam) {
    // 1. Generate treatment plan PDF
    const pdf = await this.generateTreatmentPlanPDF(exam);
    
    // 2. Send to patient email
    await this.sendEmail({
      to: exam.patient.email,
      subject: 'Your Treatment Plan from ' + exam.clinic.name,
      template: 'treatment-plan-email',
      attachments: [pdf],
      data: {
        patientName: exam.patient.name,
        dentistName: exam.dentist.name,
        visitDate: exam.date,
        procedures: exam.procedures,
        totalCost: exam.totalCost
      }
    });
    
    // 3. Log communication
    await this.logCommunication({
      patientId: exam.patientId,
      type: 'email',
      subject: 'Treatment Plan',
      status: 'sent',
      timestamp: new Date()
    });
  }
  
  async scheduleAutomatedReminders(appointment: Appointment) {
    // 24-hour reminder
    await this.scheduleMessage({
      to: appointment.patient.phone,
      type: 'sms',
      scheduledFor: this.subtract(appointment.date, { hours: 24 }),
      template: 'appointment-reminder-24hr',
      data: {
        patientName: appointment.patient.firstName,
        date: appointment.date,
        time: appointment.time,
        dentist: appointment.dentist.name,
        procedures: appointment.procedures
      }
    });
    
    // 1-hour reminder
    await this.scheduleMessage({
      to: appointment.patient.phone,
      type: 'sms',
      scheduledFor: this.subtract(appointment.date, { hours: 1 }),
      template: 'appointment-reminder-1hr',
      data: {
        patientName: appointment.patient.firstName,
        time: appointment.time
      }
    });
  }
}
```

---

## 📊 Data Models

### Core Entities with Relationships

```typescript
// /lib/models/core-entities.ts

interface Patient {
  id: string;
  demographics: PatientDemographics;
  medicalHistory: MedicalHistory;
  dentalHistory: DentalHistory;
  visits: Visit[];
  treatmentPlans: TreatmentPlan[];
  appointments: Appointment[];
  financialAccount: FinancialAccount;
}

interface Visit {
  id: string;
  patientId: string;
  date: Date;
  type: 'exam' | 'treatment' | 'emergency' | 'followup';
  dentistId: string;
  
  // Clinical data
  chiefComplaint: string;
  clinicalExam?: ClinicalExam;
  odontogramSnapshot?: OdontogramSnapshot;
  soapNotes?: SOAPNotes;
  prescriptions: Prescription[];
  
  // Business data
  treatmentPlanId?: string;
  completedProcedures: CompletedProcedure[];
  charges: Charge[];
  
  // Workflow
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  checkoutCompleted: boolean;
  nextVisitScheduled: boolean;
}

interface TreatmentPlan {
  id: string;
  patientId: string;
  visitId: string;
  createdBy: string;
  createdDate: Date;
  
  // Clinical
  diagnosis: Diagnosis[];
  procedures: PlannedProcedure[];
  clinicalNotes: string;
  
  // Financial
  totalCost: number;
  insuranceCoverage: number;
  patientResponsibility: number;
  
  // Workflow
  status: 'pending' | 'presented' | 'accepted' | 'declined' | 'in-progress' | 'completed';
  presentedDate?: Date;
  presentedBy?: string;
  acceptedDate?: Date;
  declineReason?: string;
  
  // Scheduling
  linkedAppointments: string[]; // Appointment IDs
  
  // Analytics
  valueCategory: 'low' | 'medium' | 'high';
  complexityScore: number;
  urgencyLevel: 'routine' | 'soon' | 'urgent';
}

interface PlannedProcedure {
  id: string;
  treatmentPlanId: string;
  
  // Clinical
  toothNumber: string;
  procedureCode: string;
  procedureName: string;
  surfaces: string[];
  diagnosis: string;
  clinicalNotes: string;
  
  // Scheduling
  estimatedDuration: number; // minutes
  visitNumber?: number; // Which visit in a series
  appointmentId?: string; // When scheduled
  
  // Financial
  fee: number;
  insuranceCoverage: number;
  patientPortion: number;
  
  // Workflow
  status: 'planned' | 'scheduled' | 'in-progress' | 'completed' | 'declined' | 'pending';
  priority: 'high' | 'medium' | 'low';
  
  // Completion
  completedDate?: Date;
  completedBy?: string;
  actualDuration?: number;
  complications?: string;
}

interface Appointment {
  id: string;
  patientId: string;
  dentistId: string;
  
  // Scheduling
  date: Date;
  startTime: string;
  duration: number;
  operatoryId: string;
  
  // Link to treatment
  treatmentPlanId?: string;
  plannedProcedures: string[]; // PlannedProcedure IDs
  
  // Status
  status: 'scheduled' | 'confirmed' | 'checked-in' | 'in-progress' | 'completed' | 'no-show' | 'cancelled';
  confirmationSent: boolean;
  remindersSent: number;
  
  // Actual
  actualStartTime?: Date;
  actualEndTime?: Date;
  completedProcedures: string[]; // CompletedProcedure IDs
}

interface FinancialAccount {
  patientId: string;
  
  // Balance
  totalCharges: number;
  totalPayments: number;
  totalAdjustments: number;
  currentBalance: number;
  
  // Insurance
  primaryInsurance?: InsuranceInfo;
  secondaryInsurance?: InsuranceInfo;
  
  // Payment plans
  activePaymentPlans: PaymentPlan[];
  
  // History
  charges: Charge[];
  payments: Payment[];
  statements: Statement[];
  
  // Metrics
  lastPaymentDate?: Date;
  daysSinceLastPayment: number;
  agingBuckets: {
    current: number;
    days30: number;
    days60: number;
    days90: number;
    days90plus: number;
  };
}
```

---

## 🔗 Integration Points

### Internal Integrations

```
┌─────────────────────────────────────────────────────────┐
│             INTERNAL DATA FLOW                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ExamWorkflow ──────────────► Patient Record           │
│       │                              │                  │
│       ├────────────────► Treatment Plan                │
│       │                              │                  │
│       ├────────────────► Odontogram Snapshot           │
│       │                              │                  │
│       └────────────────► Analytics Engine              │
│                                      │                  │
│  Treatment Plan ────────► Scheduling Engine            │
│       │                              │                  │
│       └────────────────► Financial Engine              │
│                                      │                  │
│  Appointment ───────────► Calendar                     │
│       │                              │                  │
│       └────────────────► Communication Engine          │
│                                      │                  │
│  Payment ───────────────► Financial Account            │
│       │                              │                  │
│       └────────────────► Analytics Engine              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### External Integrations (Future)

```
┌─────────────────────────────────────────────────────────┐
│             EXTERNAL INTEGRATIONS                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  🔌 Insurance Verification API                         │
│     └─ Real-time benefits check                        │
│                                                         │
│  🔌 Payment Gateway                                    │
│     └─ Credit card processing                          │
│                                                         │
│  🔌 Email Service (SendGrid/Mailgun)                   │
│     └─ Automated patient communications                │
│                                                         │
│  🔌 SMS Service (Twilio)                               │
│     └─ Appointment reminders                           │
│                                                         │
│  🔌 Imaging Integration (DICOM)                        │
│     └─ Link X-rays to patient records                  │
│                                                         │
│  🔌 Lab Integration                                    │
│     └─ Crown/prosthetic orders                         │
│                                                         │
│  🔌 Accounting Software                                │
│     └─ Financial data sync                             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Implementation Phases

### Phase 1: Foundation (Weeks 1-2)
**Goal**: Clinical data triggers business workflows

```
✅ Already Complete:
  - ExamWorkflow with odontogram
  - Treatment plan creation
  - Patient records
  - Basic scheduling

🔨 To Build:
  - Post-exam routing logic
  - Treatment plan analysis
  - Staff notifications
  - Document generation
```

### Phase 2: Business Workflows (Weeks 3-6)
**Goal**: Smooth handoffs between roles

```
🔨 To Build:
  - PostExamCheckout flow
  - TreatmentCoordinatorDashboard
  - SchedulingWorkbench (treatment plan → appointments)
  - Financial calculation engine
  - Basic analytics
```

### Phase 3: Automation (Weeks 7-10)
**Goal**: Reduce manual work

```
🔨 To Build:
  - Automated communications
  - Payment reminders
  - Recall system
  - Insurance verification
  - Reporting dashboard
```

### Phase 4: Optimization (Weeks 11-14)
**Goal**: Data-driven improvements

```
🔨 To Build:
  - Advanced analytics
  - Predictive insights
  - A/B testing framework
  - Custom reporting
  - Patient portal
```

---

## 📈 Success Metrics by Phase

### Phase 1 Metrics
- Time from exam completion to checkout: <5 minutes
- Treatment plans documented: 100%
- Staff notification reliability: 100%

### Phase 2 Metrics
- Treatment acceptance rate: >75%
- Same-day scheduling rate: >80%
- Checkout completion rate: >95%

### Phase 3 Metrics
- No-show rate: <5%
- Pending treatment conversion: >60%
- Collection rate: >95%

### Phase 4 Metrics
- Patient satisfaction: >4.5/5
- Production per hour: +30% vs. baseline
- Days in AR: <25 days

---

**The Bottom Line**: Every screen, every click, every piece of data should be part of a larger workflow that drives better patient care and practice growth. That's what transforms an EHR from a digital filing cabinet into a practice management powerhouse.

---

**Document Version**: 1.0  
**Last Updated**: October 17, 2025
