/**
 * Appointments Management Component
 * Full calendar view and appointment management for front desk
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  User,
  Phone,
  Mail,
  Edit,
  Trash2,
  CheckCircle2,
  X
} from 'lucide-react';

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  doctorId: string;
  doctorName: string;
  appointmentDate: string;
  appointmentTime: string;
  duration: number; // minutes
  type: string;
  status: 'scheduled' | 'confirmed' | 'checked-in' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
}

// Mock appointments
const mockAppointments: Appointment[] = [
  {
    id: 'appt-1',
    patientId: 'patient-1',
    patientName: 'Ahmad Rizki',
    patientPhone: '0812-3456-7890',
    patientEmail: 'ahmad@example.com',
    doctorId: 'doctor-1',
    doctorName: 'Dr. Smith',
    appointmentDate: '2025-10-24',
    appointmentTime: '09:00',
    duration: 60,
    type: 'Cleaning',
    status: 'confirmed',
    notes: 'Regular checkup'
  },
  {
    id: 'appt-2',
    patientId: 'patient-2',
    patientName: 'Siti Nurhaliza',
    patientPhone: '0813-9876-5432',
    patientEmail: 'siti@example.com',
    doctorId: 'doctor-1',
    doctorName: 'Dr. Smith',
    appointmentDate: '2025-10-24',
    appointmentTime: '10:30',
    duration: 45,
    type: 'Follow-up',
    status: 'scheduled'
  },
  {
    id: 'appt-3',
    patientId: 'patient-3',
    patientName: 'Budi Santoso',
    patientPhone: '0821-1111-2222',
    patientEmail: 'budi@example.com',
    doctorId: 'doctor-1',
    doctorName: 'Dr. Smith',
    appointmentDate: '2025-10-24',
    appointmentTime: '14:00',
    duration: 90,
    type: 'Root Canal',
    status: 'scheduled'
  },
  {
    id: 'appt-4',
    patientId: 'patient-4',
    patientName: 'Dewi Lestari',
    patientPhone: '0822-3333-4444',
    patientEmail: 'dewi@example.com',
    doctorId: 'doctor-1',
    doctorName: 'Dr. Smith',
    appointmentDate: '2025-10-25',
    appointmentTime: '09:00',
    duration: 60,
    type: 'Extraction',
    status: 'scheduled'
  }
];

export default function Appointments() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDisplayDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const getDayAppointments = (date: Date) => {
    const dateStr = formatDate(date);
    return appointments.filter(apt => apt.appointmentDate === dateStr)
      .sort((a, b) => a.appointmentTime.localeCompare(b.appointmentTime));
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-800',
      confirmed: 'bg-green-100 text-green-800',
      'checked-in': 'bg-purple-100 text-purple-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
      'no-show': 'bg-orange-100 text-orange-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleStatusChange = (appointmentId: string, newStatus: Appointment['status']) => {
    setAppointments(prev =>
      prev.map(apt =>
        apt.id === appointmentId ? { ...apt, status: newStatus } : apt
      )
    );
  };

  const handleCancelAppointment = (appointmentId: string) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      handleStatusChange(appointmentId, 'cancelled');
      setSelectedAppointment(null);
    }
  };

  const todayAppointments = getDayAppointments(selectedDate);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Appointments</h1>
            <p className="text-gray-600">Manage patient appointments and schedule</p>
          </div>
          <Button onClick={() => navigate('/front-desk/appointments/book')}>
            <Plus className="size-4 mr-2" />
            New Appointment
          </Button>
        </div>

        {/* Date Navigator */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => changeDate(-1)}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <div className="text-center min-w-[300px]">
                <h2 className="text-lg font-semibold">{formatDisplayDate(selectedDate)}</h2>
                <p className="text-sm text-gray-600">
                  {todayAppointments.length} appointment{todayAppointments.length !== 1 ? 's' : ''}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => changeDate(1)}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant={viewMode === 'day' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('day')}
              >
                Day
              </Button>
              <Button
                variant={viewMode === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('week')}
              >
                Week
              </Button>
              <Button
                variant={viewMode === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('month')}
              >
                Month
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Schedule */}
          <div className="lg:col-span-2 space-y-4">
            {todayAppointments.length === 0 ? (
              <Card className="p-12 text-center">
                <Calendar className="size-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No appointments scheduled</h3>
                <p className="text-gray-500 mb-4">There are no appointments for this date.</p>
                <Button onClick={() => alert('New appointment form coming soon!')}>
                  <Plus className="size-4 mr-2" />
                  Schedule Appointment
                </Button>
              </Card>
            ) : (
              todayAppointments.map((appointment) => (
                <Card
                  key={appointment.id}
                  className={`p-4 cursor-pointer transition-all ${
                    selectedAppointment?.id === appointment.id
                      ? 'border-blue-500 shadow-md'
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedAppointment(appointment)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <Clock className="size-4 text-gray-500" />
                          <span className="font-semibold">{appointment.appointmentTime}</span>
                          <span className="text-sm text-gray-500">({appointment.duration} min)</span>
                        </div>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </div>

                      <h3 className="text-lg font-semibold mb-1">{appointment.patientName}</h3>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                        <div className="flex items-center gap-2">
                          <Phone className="size-3" />
                          {appointment.patientPhone}
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="size-3" />
                          {appointment.doctorName}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{appointment.type}</Badge>
                        {appointment.notes && (
                          <span className="text-sm text-gray-500">{appointment.notes}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {appointment.status === 'confirmed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(appointment.id, 'checked-in');
                          }}
                        >
                          <CheckCircle2 className="size-4 mr-1" />
                          Check In
                        </Button>
                      )}
                      {appointment.status === 'scheduled' && (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(appointment.id, 'confirmed');
                          }}
                        >
                          Confirm
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Sidebar - Details/Stats */}
          <div className="space-y-6">
            {/* Selected Appointment Details */}
            {selectedAppointment ? (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Appointment Details</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedAppointment(null)}
                  >
                    <X className="size-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600">Patient</label>
                    <p className="font-medium">{selectedAppointment.patientName}</p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">Contact</label>
                    <p className="text-sm">{selectedAppointment.patientPhone}</p>
                    <p className="text-sm">{selectedAppointment.patientEmail}</p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">Time</label>
                    <p className="font-medium">
                      {selectedAppointment.appointmentTime} ({selectedAppointment.duration} min)
                    </p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">Type</label>
                    <p className="font-medium">{selectedAppointment.type}</p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">Doctor</label>
                    <p className="font-medium">{selectedAppointment.doctorName}</p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">Status</label>
                    <div className="mt-1">
                      <Badge className={getStatusColor(selectedAppointment.status)}>
                        {selectedAppointment.status}
                      </Badge>
                    </div>
                  </div>

                  {selectedAppointment.notes && (
                    <div>
                      <label className="text-sm text-gray-600">Notes</label>
                      <p className="text-sm">{selectedAppointment.notes}</p>
                    </div>
                  )}

                  <div className="pt-4 border-t space-y-2">
                    <Button className="w-full" variant="outline">
                      <Edit className="size-4 mr-2" />
                      Edit Appointment
                    </Button>
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => handleCancelAppointment(selectedAppointment.id)}
                    >
                      <Trash2 className="size-4 mr-2" />
                      Cancel Appointment
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Today's Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-semibold">{todayAppointments.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Confirmed:</span>
                    <span className="font-semibold text-green-600">
                      {todayAppointments.filter(a => a.status === 'confirmed').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Checked In:</span>
                    <span className="font-semibold text-purple-600">
                      {todayAppointments.filter(a => a.status === 'checked-in').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Scheduled:</span>
                    <span className="font-semibold text-blue-600">
                      {todayAppointments.filter(a => a.status === 'scheduled').length}
                    </span>
                  </div>
                </div>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="size-4 mr-2" />
                  View Calendar
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="size-4 mr-2" />
                  Send Reminders
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="size-4 mr-2" />
                  Call Patient
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
