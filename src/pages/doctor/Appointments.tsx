import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Phone, FileText } from 'lucide-react';

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  appointmentTime: string;
  appointmentDate: string;
  duration: string;
  type: 'checkup' | 'treatment' | 'consultation' | 'emergency';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
}

const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientId: 'P001',
    patientName: 'John Doe',
    patientPhone: '(555) 123-4567',
    appointmentDate: '2025-10-24',
    appointmentTime: '09:00 AM',
    duration: '30 min',
    type: 'checkup',
    status: 'scheduled',
    notes: 'Regular checkup and cleaning'
  },
  {
    id: '2',
    patientId: 'P002',
    patientName: 'Jane Smith',
    patientPhone: '(555) 234-5678',
    appointmentDate: '2025-10-24',
    appointmentTime: '10:00 AM',
    duration: '60 min',
    type: 'treatment',
    status: 'in-progress',
    notes: 'Root canal treatment - tooth #14'
  },
  {
    id: '3',
    patientId: 'P003',
    patientName: 'Bob Johnson',
    patientPhone: '(555) 345-6789',
    appointmentDate: '2025-10-24',
    appointmentTime: '11:30 AM',
    duration: '45 min',
    type: 'consultation',
    status: 'scheduled',
    notes: 'Discuss treatment plan for crown placement'
  },
  {
    id: '4',
    patientId: 'P004',
    patientName: 'Sarah Williams',
    patientPhone: '(555) 456-7890',
    appointmentDate: '2025-10-24',
    appointmentTime: '02:00 PM',
    duration: '30 min',
    type: 'checkup',
    status: 'scheduled'
  },
  {
    id: '5',
    patientId: 'P005',
    patientName: 'Michael Brown',
    patientPhone: '(555) 567-8901',
    appointmentDate: '2025-10-24',
    appointmentTime: '03:00 PM',
    duration: '90 min',
    type: 'treatment',
    status: 'scheduled',
    notes: 'Multiple fillings - quadrant 2 and 3'
  }
];

export function Appointments() {
  const navigate = useNavigate();
  const [appointments] = useState<Appointment[]>(mockAppointments);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredAppointments = filterStatus === 'all' 
    ? appointments 
    : appointments.filter(apt => apt.status === filterStatus);

  const getStatusColor = (status: string) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-700',
      'in-progress': 'bg-amber-100 text-amber-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      checkup: 'bg-blue-50 text-blue-600 border-blue-200',
      treatment: 'bg-purple-50 text-purple-600 border-purple-200',
      consultation: 'bg-teal-50 text-teal-600 border-teal-200',
      emergency: 'bg-red-50 text-red-600 border-red-200'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-50 text-gray-600 border-gray-200';
  };

  const handleStartExam = (patientId: string, appointmentId: string) => {
    navigate(`/doctor/exam/${patientId}?appointmentId=${appointmentId}`);
  };

  const handleViewPatient = (patientId: string) => {
    navigate(`/doctor/patients/${patientId}`);
  };

  return (
    <DashboardLayout role="doctor">
      <div className="p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Appointments</h1>
          <p className="text-gray-600">Manage your appointment schedule</p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex items-center gap-2">
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('all')}
            size="sm"
          >
            All ({appointments.length})
          </Button>
          <Button
            variant={filterStatus === 'scheduled' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('scheduled')}
            size="sm"
          >
            Scheduled ({appointments.filter(a => a.status === 'scheduled').length})
          </Button>
          <Button
            variant={filterStatus === 'in-progress' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('in-progress')}
            size="sm"
          >
            In Progress ({appointments.filter(a => a.status === 'in-progress').length})
          </Button>
          <Button
            variant={filterStatus === 'completed' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('completed')}
            size="sm"
          >
            Completed ({appointments.filter(a => a.status === 'completed').length})
          </Button>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <Card className="p-12 text-center">
              <Calendar className="size-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No appointments found</h3>
              <p className="text-gray-600">There are no appointments matching your filter.</p>
            </Card>
          ) : (
            filteredAppointments.map((appointment) => (
              <Card key={appointment.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {appointment.patientName}
                      </h3>
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status.replace('-', ' ').toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className={getTypeColor(appointment.type)}>
                        {appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="size-4" />
                        <span>ID: {appointment.patientId}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="size-4" />
                        <span>{appointment.patientPhone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="size-4" />
                        <span>{appointment.appointmentTime} ({appointment.duration})</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="size-4" />
                        <span>{new Date(appointment.appointmentDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {appointment.notes && (
                      <div className="flex items-start gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        <FileText className="size-4 mt-0.5 flex-shrink-0" />
                        <span>{appointment.notes}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    {appointment.status === 'scheduled' && (
                      <Button 
                        onClick={() => handleStartExam(appointment.patientId, appointment.id)}
                        className="whitespace-nowrap"
                      >
                        Start Exam
                      </Button>
                    )}
                    {appointment.status === 'in-progress' && (
                      <Button 
                        onClick={() => handleStartExam(appointment.patientId, appointment.id)}
                        variant="default"
                        className="whitespace-nowrap"
                      >
                        Continue Exam
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      onClick={() => handleViewPatient(appointment.patientId)}
                      className="whitespace-nowrap"
                    >
                      View Patient
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
