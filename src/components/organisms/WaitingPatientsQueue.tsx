import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Clock, User, Phone, AlertCircle, Stethoscope } from 'lucide-react';
import { WaitingPatient, AppointmentNotificationService, PatientStatusUpdate } from '@/lib/types/appointment-status';

interface WaitingPatientsQueueProps {
  doctorId?: string;
  doctorName?: string;
}

export function WaitingPatientsQueue({ doctorId = 'DR001', doctorName = 'Dr. Smith' }: WaitingPatientsQueueProps) {
  const navigate = useNavigate();
  const [waitingPatients, setWaitingPatients] = useState<WaitingPatient[]>([
    // Mock data - will be replaced with real data from Supabase
    {
      appointmentId: 'APT001',
      patientId: 'P001',
      patientName: 'John Doe',
      patientPhone: '(555) 123-4567',
      checkInTime: new Date(Date.now() - 15 * 60000).toISOString(), // 15 mins ago
      appointmentTime: '09:00 AM',
      type: 'checkup',
      chiefComplaint: 'Tooth pain on upper right',
      insuranceStatus: 'verified',
      criticalAlerts: ['Allergies: Penicillin'],
      roomNumber: 'Room 1'
    }
  ]);

  useEffect(() => {
    // Subscribe to patient check-in notifications from Front Desk
    const handleStatusUpdate = (update: PatientStatusUpdate) => {
      if (update.newStatus === 'checked-in') {
        // Add patient to waiting queue
        const newPatient: WaitingPatient = {
          appointmentId: update.appointmentId,
          patientId: update.patientId,
          patientName: update.patientName,
          patientPhone: update.metadata?.notes || '',
          checkInTime: update.timestamp.toISOString(),
          appointmentTime: new Date(update.timestamp).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          type: 'checkup',
          insuranceStatus: 'verified'
        };

        setWaitingPatients(prev => [...prev, newPatient]);
      } else if (update.newStatus === 'in-progress') {
        // Remove from waiting queue when exam starts
        setWaitingPatients(prev => 
          prev.filter(p => p.appointmentId !== update.appointmentId)
        );
      }
    };

    AppointmentNotificationService.subscribe('doctor', handleStatusUpdate);

    return () => {
      AppointmentNotificationService.unsubscribe('doctor', handleStatusUpdate);
    };
  }, []);

  const handleStartExam = (patient: WaitingPatient) => {
    // Update status to in-progress
    const statusUpdate: PatientStatusUpdate = {
      appointmentId: patient.appointmentId,
      patientId: patient.patientId,
      patientName: patient.patientName,
      previousStatus: 'checked-in',
      newStatus: 'in-progress',
      timestamp: new Date(),
      updatedBy: {
        role: 'doctor',
        userId: doctorId,
        userName: doctorName
      }
    };

    AppointmentNotificationService.notify(statusUpdate);

    // Navigate to exam page
    navigate(`/doctor/exam/${patient.patientId}?appointmentId=${patient.appointmentId}`);
  };

  const getWaitingTime = (checkInTime: string) => {
    const minutes = Math.floor((Date.now() - new Date(checkInTime).getTime()) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes === 1) return '1 min';
    return `${minutes} mins`;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      checkup: 'bg-blue-100 text-blue-700',
      treatment: 'bg-purple-100 text-purple-700',
      consultation: 'bg-teal-100 text-teal-700',
      emergency: 'bg-red-100 text-red-700'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  if (waitingPatients.length === 0) {
    return (
      <Card className="p-6 text-center">
        <Clock className="size-12 mx-auto text-gray-400 mb-3" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Patients Waiting</h3>
        <p className="text-gray-600 text-sm">
          Patients who are checked in by Front Desk will appear here
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">Waiting Patients ({waitingPatients.length})</h3>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          Checked In by Front Desk
        </Badge>
      </div>

      {waitingPatients.map((patient) => (
        <Card key={patient.appointmentId} className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="font-semibold text-gray-900">{patient.patientName}</h4>
                <Badge className={getTypeColor(patient.type)}>
                  {patient.type.charAt(0).toUpperCase() + patient.type.slice(1)}
                </Badge>
                {patient.insuranceStatus === 'verified' && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    ✓ Insurance OK
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="size-4" />
                  <span>ID: {patient.patientId}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="size-4" />
                  <span>{patient.patientPhone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="size-4" />
                  <span>Waiting: {getWaitingTime(patient.checkInTime)}</span>
                </div>
                {patient.roomNumber && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <span>📍 {patient.roomNumber}</span>
                  </div>
                )}
              </div>

              {patient.chiefComplaint && (
                <div className="bg-amber-50 border border-amber-200 rounded p-2 mb-2 text-sm">
                  <span className="font-medium text-amber-900">Chief Complaint: </span>
                  <span className="text-amber-800">{patient.chiefComplaint}</span>
                </div>
              )}

              {patient.criticalAlerts && patient.criticalAlerts.length > 0 && (
                <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">
                  <AlertCircle className="size-4 mt-0.5 flex-shrink-0" />
                  <div>
                    {patient.criticalAlerts.map((alert, idx) => (
                      <div key={idx}>{alert}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 ml-4">
              <Button 
                onClick={() => handleStartExam(patient)}
                className="whitespace-nowrap"
              >
                <Stethoscope className="size-4 mr-2" />
                Start Exam
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate(`/doctor/patients/${patient.patientId}`)}
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
