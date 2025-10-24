/**
 * Check-In Workflow Component
 * Handles patient arrival, check-in process, and queue management
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  User,
  Calendar,
  Phone,
  Mail,
  ArrowRight,
  X
} from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  hasAppointment: boolean;
  appointmentTime?: string;
  appointmentType?: string;
  doctorName?: string;
  insuranceVerified?: boolean;
  lastVisit?: string;
}

interface CheckInStatus {
  patientId: string;
  checkInTime: string;
  waitingRoomNumber?: string;
  status: 'waiting' | 'with-doctor' | 'completed';
  notes?: string;
}

// Mock data - in real app, fetch from Supabase
const mockPatients: Patient[] = [
  {
    id: 'patient-1',
    name: 'Ahmad Rizki',
    phone: '0812-3456-7890',
    email: 'ahmad@example.com',
    dateOfBirth: '1985-05-15',
    hasAppointment: true,
    appointmentTime: '09:00',
    appointmentType: 'Cleaning',
    doctorName: 'Dr. Smith',
    insuranceVerified: true,
    lastVisit: '2025-09-15'
  },
  {
    id: 'patient-2',
    name: 'Siti Nurhaliza',
    phone: '0813-9876-5432',
    email: 'siti@example.com',
    dateOfBirth: '1990-03-20',
    hasAppointment: true,
    appointmentTime: '09:30',
    appointmentType: 'Follow-up',
    doctorName: 'Dr. Smith',
    insuranceVerified: false,
    lastVisit: '2025-10-01'
  },
  {
    id: 'patient-3',
    name: 'Budi Santoso',
    phone: '0821-1111-2222',
    email: 'budi@example.com',
    dateOfBirth: '1978-11-10',
    hasAppointment: false,
    lastVisit: '2025-08-20'
  }
];

export default function CheckIn() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [checkInQueue, setCheckInQueue] = useState<CheckInStatus[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Filter patients based on search
  const filteredPatients = mockPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.phone.includes(searchQuery) ||
    patient.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get today's appointments
  const todayAppointments = mockPatients.filter(p => p.hasAppointment);

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
  };

  const handleCheckIn = () => {
    if (!selectedPatient) return;

    const checkInStatus: CheckInStatus = {
      patientId: selectedPatient.id,
      checkInTime: new Date().toISOString(),
      waitingRoomNumber: `W${checkInQueue.length + 1}`,
      status: 'waiting',
      notes: selectedPatient.hasAppointment ? 'Scheduled appointment' : 'Walk-in patient'
    };

    setCheckInQueue([...checkInQueue, checkInStatus]);
    setShowConfirmation(true);

    // Auto-hide confirmation after 3 seconds
    setTimeout(() => {
      setShowConfirmation(false);
      setSelectedPatient(null);
      setSearchQuery('');
    }, 3000);
  };

  const getWaitTime = (checkInTime: string): string => {
    const diff = Date.now() - new Date(checkInTime).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    return `${Math.floor(minutes / 60)}h ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Patient Check-In</h1>
          <p className="text-gray-600">Search for patient and process arrival</p>
        </div>

        {/* Success Confirmation */}
        {showConfirmation && selectedPatient && (
          <Card className="p-6 bg-green-50 border-green-500 animate-in fade-in slide-in-from-top">
            <div className="flex items-center gap-4">
              <CheckCircle2 className="size-12 text-green-600" />
              <div>
                <h3 className="text-lg font-semibold text-green-900">
                  ✅ Check-In Successful!
                </h3>
                <p className="text-green-800">
                  {selectedPatient.name} has been checked in. Waiting room number: W{checkInQueue.length}
                </p>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Search & Check-In */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Search Patient</h2>
              
              <div className="relative mb-4">
                <Search className="absolute left-3 top-3 size-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by name, phone, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Search Results */}
              {searchQuery && (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredPatients.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <User className="size-12 mx-auto mb-3 text-gray-300" />
                      <p>No patients found</p>
                      <Button className="mt-3" onClick={() => navigate('/front-desk/new-patient')}>
                        Register New Patient
                      </Button>
                    </div>
                  ) : (
                    filteredPatients.map((patient) => (
                      <button
                        key={patient.id}
                        onClick={() => handleSelectPatient(patient)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          selectedPatient?.id === patient.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{patient.name}</h3>
                              {patient.hasAppointment && (
                                <Badge variant="outline" className="bg-green-50">
                                  <Calendar className="size-3 mr-1" />
                                  {patient.appointmentTime}
                                </Badge>
                              )}
                            </div>
                            <div className="space-y-1 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Phone className="size-3" />
                                {patient.phone}
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail className="size-3" />
                                {patient.email}
                              </div>
                            </div>
                            {patient.hasAppointment && (
                              <div className="mt-2 text-sm">
                                <Badge variant="secondary">{patient.appointmentType}</Badge>
                                <span className="text-gray-600 ml-2">with {patient.doctorName}</span>
                              </div>
                            )}
                          </div>
                          
                          {!patient.insuranceVerified && patient.hasAppointment && (
                            <Badge variant="destructive" className="ml-2">
                              <AlertCircle className="size-3 mr-1" />
                              Insurance Pending
                            </Badge>
                          )}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </Card>

            {/* Selected Patient Details */}
            {selectedPatient && !searchQuery && (
              <Card className="p-6 border-blue-500">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">{selectedPatient.name}</h2>
                    <p className="text-gray-600">Patient ID: {selectedPatient.id}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedPatient(null)}
                  >
                    <X className="size-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="text-sm text-gray-600">Phone</label>
                    <p className="font-medium">{selectedPatient.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Email</label>
                    <p className="font-medium">{selectedPatient.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Date of Birth</label>
                    <p className="font-medium">{selectedPatient.dateOfBirth}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Last Visit</label>
                    <p className="font-medium">{selectedPatient.lastVisit || 'First visit'}</p>
                  </div>
                </div>

                {selectedPatient.hasAppointment ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <h3 className="font-semibold text-green-900 mb-2">Today's Appointment</h3>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-green-700">Time:</span>
                        <p className="font-medium">{selectedPatient.appointmentTime}</p>
                      </div>
                      <div>
                        <span className="text-green-700">Type:</span>
                        <p className="font-medium">{selectedPatient.appointmentType}</p>
                      </div>
                      <div>
                        <span className="text-green-700">Doctor:</span>
                        <p className="font-medium">{selectedPatient.doctorName}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="size-5 text-yellow-600" />
                      <span className="font-semibold text-yellow-900">Walk-in Patient</span>
                    </div>
                    <p className="text-sm text-yellow-800 mt-1">
                      No appointment scheduled. Will be added to walk-in queue.
                    </p>
                  </div>
                )}

                {!selectedPatient.insuranceVerified && selectedPatient.hasAppointment && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center gap-2">
                    <AlertCircle className="size-4 text-red-600" />
                    <span className="text-sm text-red-800">
                      Insurance verification pending. Please verify before check-in.
                    </span>
                  </div>
                )}

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleCheckIn}
                >
                  <CheckCircle2 className="size-5 mr-2" />
                  Check In Patient
                  <ArrowRight className="size-5 ml-2" />
                </Button>
              </Card>
            )}

            {/* Today's Appointments */}
            {!searchQuery && !selectedPatient && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Today's Appointments</h2>
                <div className="space-y-3">
                  {todayAppointments.map((patient) => (
                    <div
                      key={patient.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          checkInQueue.find(c => c.patientId === patient.id)
                            ? 'bg-green-500'
                            : 'bg-gray-300'
                        }`} />
                        <div>
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-sm text-gray-600">{patient.appointmentTime} - {patient.appointmentType}</p>
                        </div>
                      </div>
                      {checkInQueue.find(c => c.patientId === patient.id) ? (
                        <Badge variant="outline" className="bg-green-50">
                          <CheckCircle2 className="size-3 mr-1" />
                          Checked In
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSelectPatient(patient)}
                        >
                          Check In
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - Waiting Queue */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Waiting Queue</h2>
              
              {checkInQueue.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="size-12 mx-auto mb-3 text-gray-300" />
                  <p>No patients waiting</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {checkInQueue.map((checkIn) => {
                    const patient = mockPatients.find(p => p.id === checkIn.patientId);
                    if (!patient) return null;

                    return (
                      <div
                        key={checkIn.patientId}
                        className="p-4 bg-blue-50 border border-blue-200 rounded-lg"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold">{patient.name}</h3>
                            <p className="text-sm text-gray-600">{checkIn.waitingRoomNumber}</p>
                          </div>
                          <Badge variant="outline" className="bg-white">
                            <Clock className="size-3 mr-1" />
                            {getWaitTime(checkIn.checkInTime)}
                          </Badge>
                        </div>
                        {patient.hasAppointment && (
                          <p className="text-sm text-gray-600">
                            {patient.appointmentTime} - {patient.appointmentType}
                          </p>
                        )}
                        <div className="mt-3 flex gap-2">
                          <Button size="sm" className="flex-1">
                            Call Patient
                          </Button>
                          <Button size="sm" variant="outline">
                            Notes
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            {/* Quick Stats */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Today's Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Appointments:</span>
                  <span className="font-semibold">{todayAppointments.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Checked In:</span>
                  <span className="font-semibold text-green-600">{checkInQueue.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Waiting:</span>
                  <span className="font-semibold text-blue-600">
                    {checkInQueue.filter(c => c.status === 'waiting').length}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
