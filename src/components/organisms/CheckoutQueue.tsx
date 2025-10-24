import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { DollarSign, FileText, Printer, Calendar, User, Pill } from 'lucide-react';
import { CheckoutPatient, AppointmentNotificationService, PatientStatusUpdate } from '@/lib/types/appointment-status';

interface CheckoutQueueProps {
  frontDeskId?: string;
  frontDeskName?: string;
}

export function CheckoutQueue({}: CheckoutQueueProps) {
  // frontDeskId and frontDeskName parameters available but unused
  const navigate = useNavigate();
  const [checkoutQueue, setCheckoutQueue] = useState<CheckoutPatient[]>([]);

  useEffect(() => {
    // Subscribe to exam completion notifications from Doctor
    const handleStatusUpdate = (update: PatientStatusUpdate) => {
      if (update.newStatus === 'ready-checkout' && update.metadata) {
        // Add patient to checkout queue
        const checkoutPatient: CheckoutPatient = {
          appointmentId: update.appointmentId,
          patientId: update.patientId,
          patientName: update.patientName,
          examId: update.metadata.examId || '',
          completedTime: update.timestamp.toISOString(),
          doctor: update.updatedBy.userName,
          procedures: [],
          prescriptions: update.metadata.prescriptions?.map((p, idx) => ({
            id: `RX${idx + 1}`,
            medication: p,
            dosage: '',
            frequency: '',
            duration: ''
          })) || [],
          totalCost: update.metadata.totalCost || 0,
          patientResponsibility: update.metadata.totalCost || 0,
          followUpRequired: !!update.metadata.followUpDate,
          followUpDate: update.metadata.followUpDate,
          clinicalNotes: update.metadata.notes
        };

        setCheckoutQueue(prev => [...prev, checkoutPatient]);
      } else if (update.newStatus === 'checked-out') {
        // Remove from checkout queue when payment is processed
        setCheckoutQueue(prev => 
          prev.filter(p => p.appointmentId !== update.appointmentId)
        );
      }
    };

    AppointmentNotificationService.subscribe('front-desk', handleStatusUpdate);

    return () => {
      AppointmentNotificationService.unsubscribe('front-desk', handleStatusUpdate);
    };
  }, []);

  const handleProcessCheckout = (patient: CheckoutPatient) => {
    navigate(`/front-desk/checkout/${patient.appointmentId}`, {
      state: { checkoutData: patient }
    });
  };

  const handlePrintPrescription = (patient: CheckoutPatient) => {
    // In real app, generate and print PDF
    console.log('Printing prescription for:', patient.patientName);
    alert(`Prescription printed for ${patient.patientName}\n\n${patient.prescriptions.map(rx => 
      `${rx.medication} - ${rx.dosage}`
    ).join('\n')}`);
  };

  const handleScheduleFollowUp = (patient: CheckoutPatient) => {
    navigate(`/front-desk/appointments/new?patientId=${patient.patientId}&type=follow-up`);
  };

  if (checkoutQueue.length === 0) {
    return (
      <Card className="p-6 text-center">
        <DollarSign className="size-12 mx-auto text-gray-400 mb-3" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Patients in Checkout Queue</h3>
        <p className="text-gray-600 text-sm">
          Completed exams from doctors will appear here for checkout
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">Checkout Queue ({checkoutQueue.length})</h3>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Ready from Doctor
        </Badge>
      </div>

      {checkoutQueue.map((patient) => (
        <Card key={patient.appointmentId} className="p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* Patient Header */}
              <div className="flex items-center gap-3 mb-3">
                <h4 className="font-semibold text-lg text-gray-900">{patient.patientName}</h4>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Exam Complete
                </Badge>
              </div>

              {/* Exam Details */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="size-4" />
                  <span>ID: {patient.patientId}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FileText className="size-4" />
                  <span>Dr. {patient.doctor}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span>Completed: {new Date(patient.completedTime).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
              </div>

              {/* Procedures */}
              {patient.procedures.length > 0 && (
                <div className="mb-3">
                  <h5 className="text-sm font-semibold text-gray-700 mb-2">Procedures ({patient.procedures.length}):</h5>
                  <div className="space-y-1">
                    {patient.procedures.map((proc) => (
                      <div key={proc.id} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                        <span>
                          {proc.name}
                          {proc.toothNumber && <span className="text-gray-500 ml-2">Tooth #{proc.toothNumber}</span>}
                        </span>
                        <span className="font-semibold">
                          ${proc.cost.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Prescriptions */}
              {patient.prescriptions.length > 0 && (
                <div className="mb-3 bg-purple-50 border border-purple-200 rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Pill className="size-4 text-purple-600" />
                      <h5 className="text-sm font-semibold text-purple-900">
                        Prescriptions ({patient.prescriptions.length})
                      </h5>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handlePrintPrescription(patient)}
                      className="text-purple-700 border-purple-300 hover:bg-purple-100"
                    >
                      <Printer className="size-3 mr-1" />
                      Print
                    </Button>
                  </div>
                  <div className="text-xs text-purple-800 space-y-1">
                    {patient.prescriptions.map((rx) => (
                      <div key={rx.id}>• {rx.medication}</div>
                    ))}
                  </div>
                </div>
              )}

              {/* Follow-up Required */}
              {patient.followUpRequired && (
                <div className="bg-amber-50 border border-amber-200 rounded p-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-amber-600" />
                    <span className="text-sm font-semibold text-amber-900">
                      Follow-up Required
                      {patient.followUpDate && `: ${new Date(patient.followUpDate).toLocaleDateString()}`}
                    </span>
                  </div>
                </div>
              )}

              {/* Total Cost */}
              <div className="bg-green-50 border-2 border-green-200 rounded p-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-green-900">Patient Responsibility:</span>
                  <span className="text-2xl font-bold text-green-700">
                    ${patient.patientResponsibility.toLocaleString()}
                  </span>
                </div>
                {patient.insuranceCoverage && (
                  <div className="text-xs text-green-700 mt-1">
                    Insurance covers: ${patient.insuranceCoverage.toLocaleString()}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 ml-4">
              <Button 
                onClick={() => handleProcessCheckout(patient)}
                className="whitespace-nowrap bg-green-600 hover:bg-green-700"
              >
                <DollarSign className="size-4 mr-2" />
                Process Checkout
              </Button>
              
              {patient.followUpRequired && (
                <Button 
                  variant="outline"
                  onClick={() => handleScheduleFollowUp(patient)}
                  className="whitespace-nowrap"
                >
                  <Calendar className="size-4 mr-2" />
                  Schedule Follow-up
                </Button>
              )}
              
              <Button 
                variant="outline"
                onClick={() => navigate(`/front-desk/patients/${patient.patientId}`)}
                className="whitespace-nowrap"
              >
                View Profile
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
