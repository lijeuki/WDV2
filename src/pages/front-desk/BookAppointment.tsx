import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppointmentBookingCalendar } from '@/components/organisms/AppointmentBookingCalendar';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Mock doctor data - replace with actual API call
const mockDoctors = [
  {
    id: 'DR-001',
    name: 'Dr. Sarah Johnson',
    specialization: 'General Dentistry',
    availability: {
      dayOfWeek: [1, 2, 3, 4, 5], // Monday to Friday
      startTime: '09:00',
      endTime: '17:00',
      slotDuration: 30,
      blockedDates: [
        new Date(2025, 9, 25), // October 25, 2025
        new Date(2025, 9, 26), // October 26, 2025
      ]
    }
  },
  {
    id: 'DR-002',
    name: 'Dr. Michael Chen',
    specialization: 'Orthodontics',
    availability: {
      dayOfWeek: [1, 3, 5], // Monday, Wednesday, Friday
      startTime: '10:00',
      endTime: '18:00',
      slotDuration: 45,
      blockedDates: []
    }
  },
  {
    id: 'DR-003',
    name: 'Dr. Emily Rodriguez',
    specialization: 'Pediatric Dentistry',
    availability: {
      dayOfWeek: [2, 4, 6], // Tuesday, Thursday, Saturday
      startTime: '08:00',
      endTime: '16:00',
      slotDuration: 30,
      blockedDates: []
    }
  },
  {
    id: 'DR-004',
    name: 'Dr. James Wilson',
    specialization: 'Endodontics',
    availability: {
      dayOfWeek: [1, 2, 3, 4, 5], // Monday to Friday
      startTime: '11:00',
      endTime: '19:00',
      slotDuration: 60,
      blockedDates: [
        new Date(2025, 9, 28), // October 28, 2025
      ]
    }
  }
];

export function BookAppointment() {
  const navigate = useNavigate();
  const [isBooking, setIsBooking] = useState(false);

  const handleBookAppointment = async (doctorId: string, date: Date, time: string) => {
    setIsBooking(true);

    // Simulate API call
    try {
      const appointmentData = {
        doctorId,
        date: date.toISOString(),
        time,
        patientId: 'current-patient-id', // Replace with actual patient ID
        status: 'scheduled',
        createdAt: new Date().toISOString()
      };

      console.log('Booking appointment:', appointmentData);

      // TODO: Save to database
      // await supabase.from('appointments').insert(appointmentData);

      // Show success message
      const doctor = mockDoctors.find(d => d.id === doctorId);
      alert(
        `✅ Appointment Booked Successfully!\n\n` +
        `Doctor: ${doctor?.name}\n` +
        `Date: ${date.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}\n` +
        `Time: ${time}\n\n` +
        `A confirmation will be sent to the patient.`
      );

      // Navigate back to appointments list
      navigate('/front-desk/appointments');
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/front-desk/appointments')}
            >
              <ArrowLeft className="size-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Book New Appointment</h1>
              <p className="text-sm text-gray-600">Select doctor, date, and time slot</p>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Booking */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <AppointmentBookingCalendar
          doctors={mockDoctors}
          onBookAppointment={handleBookAppointment}
        />

        {/* Instructions */}
        <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">Booking Instructions</h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>First, select the doctor based on patient needs and specialization</li>
            <li>Available dates will be shown based on doctor's schedule</li>
            <li>Days when doctor is not working will be disabled</li>
            <li>Time slots are generated based on doctor's working hours</li>
            <li>Slot duration varies by doctor and procedure type</li>
            <li>Confirm all details before booking</li>
          </ul>
        </div>

        {/* Doctor Availability Summary */}
        <div className="mt-6">
          <h3 className="font-semibold text-gray-900 mb-3">Doctor Availability Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockDoctors.map(doctor => (
              <div key={doctor.id} className="p-4 bg-white rounded-lg border">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{doctor.name}</h4>
                    <p className="text-sm text-gray-600">{doctor.specialization}</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    {doctor.availability.slotDuration} min slots
                  </span>
                </div>
                <div className="text-sm text-gray-700">
                  <p>
                    <span className="font-medium">Hours:</span>{' '}
                    {doctor.availability.startTime} - {doctor.availability.endTime}
                  </p>
                  <p className="mt-1">
                    <span className="font-medium">Days:</span>{' '}
                    {doctor.availability.dayOfWeek.map(d => 
                      ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]
                    ).join(', ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
