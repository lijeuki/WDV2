import { useState, useEffect } from 'react';
import { CircleCheckIcon, UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  availability: {
    dayOfWeek: number[]; // 0 = Sunday, 1 = Monday, etc.
    startTime: string;
    endTime: string;
    blockedDates?: Date[];
    slotDuration: number; // in minutes
  };
}

interface AppointmentBookingCalendarProps {
  doctors: Doctor[];
  onBookAppointment?: (doctorId: string, date: Date, time: string) => void;
}

export function AppointmentBookingCalendar({
  doctors,
  onBookAppointment
}: AppointmentBookingCalendarProps) {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);

  // Generate time slots based on selected doctor's schedule
  useEffect(() => {
    if (!selectedDoctor || !date) {
      setTimeSlots([]);
      return;
    }

    const availability = selectedDoctor.availability;
    const dayOfWeek = date.getDay();

    // Check if doctor works on this day
    if (!availability.dayOfWeek.includes(dayOfWeek)) {
      setTimeSlots([]);
      return;
    }

    // Parse start and end times
    const [startHour, startMinute] = availability.startTime.split(':').map(Number);
    const [endHour, endMinute] = availability.endTime.split(':').map(Number);

    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;
    const duration = availability.slotDuration;

    // Generate time slots
    const slots: string[] = [];
    for (let minutes = startTotalMinutes; minutes < endTotalMinutes; minutes += duration) {
      const hour = Math.floor(minutes / 60);
      const minute = minutes % 60;
      slots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
    }

    setTimeSlots(slots);
    setSelectedTime(null); // Reset selected time when date or doctor changes
  }, [selectedDoctor, date]);

  // Filter unavailable dates
  const isDateDisabled = (date: Date) => {
    if (!selectedDoctor) return true;

    const dayOfWeek = date.getDay();
    const availability = selectedDoctor.availability;

    // Check if doctor works on this day of week
    if (!availability.dayOfWeek.includes(dayOfWeek)) {
      return true;
    }

    // Check if date is in blocked dates
    if (availability.blockedDates) {
      return availability.blockedDates.some(
        blocked => 
          blocked.getFullYear() === date.getFullYear() &&
          blocked.getMonth() === date.getMonth() &&
          blocked.getDate() === date.getDate()
      );
    }

    // Disable past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleDoctorSelect = (doctorId: string) => {
    const doctor = doctors.find(d => d.id === doctorId);
    setSelectedDoctor(doctor || null);
    setDate(new Date());
    setSelectedTime(null);
  };

  const handleBookAppointment = () => {
    if (selectedDoctor && date && selectedTime && onBookAppointment) {
      onBookAppointment(selectedDoctor.id, date, selectedTime);
    }
  };

  return (
    <div>
      <Card className="gap-0 p-0">
        <CardHeader className="flex h-max justify-center border-b !p-4">
          <CardTitle>Book Appointment</CardTitle>
          <p className="text-sm text-muted-foreground">Select doctor, date, and time</p>
        </CardHeader>

        {/* Doctor Selection */}
        <div className="border-b p-6">
          <label className="text-sm font-medium mb-2 block">Select Doctor</label>
          <Select onValueChange={handleDoctorSelect}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a doctor..." />
            </SelectTrigger>
            <SelectContent>
              {doctors.map(doctor => (
                <SelectItem key={doctor.id} value={doctor.id}>
                  <div className="flex items-center gap-2">
                    <UserIcon className="size-4" />
                    <div>
                      <div className="font-medium">{doctor.name}</div>
                      <div className="text-xs text-muted-foreground">{doctor.specialization}</div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedDoctor && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="bg-blue-100 text-blue-700">
                  {selectedDoctor.specialization}
                </Badge>
              </div>
              <p className="text-sm text-gray-700">
                Available: {selectedDoctor.availability.startTime} - {selectedDoctor.availability.endTime}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Working days: {selectedDoctor.availability.dayOfWeek.map(d => 
                  ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]
                ).join(', ')}
              </p>
            </div>
          )}
        </div>

        {/* Calendar and Time Slots */}
        {selectedDoctor ? (
          <CardContent className="relative p-0 md:pr-48">
            <div className="p-6">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                defaultMonth={date}
                disabled={isDateDisabled}
                showOutsideDays={false}
                className="bg-transparent p-0 [--cell-size:--spacing(10)]"
                formatters={{
                  formatWeekdayName: (date) => {
                    return date.toLocaleString('en-US', { weekday: 'short' });
                  }
                }}
              />
            </div>

            {timeSlots.length > 0 ? (
              <div className="inset-y-0 right-0 flex w-full flex-col gap-4 border-t max-md:h-60 md:absolute md:w-48 md:border-t-0 md:border-l">
                <div className="p-4 border-b bg-gray-50">
                  <p className="text-xs font-medium text-gray-700">Available Times</p>
                  <p className="text-xs text-gray-500 mt-1">{timeSlots.length} slots</p>
                </div>
                <ScrollArea className="h-full">
                  <div className="flex flex-col gap-2 px-6 pb-6">
                    {timeSlots.map(time => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? 'default' : 'outline'}
                        onClick={() => setSelectedTime(time)}
                        className="w-full shadow-none"
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            ) : (
              <div className="inset-y-0 right-0 flex w-full items-center justify-center border-t p-6 text-center max-md:h-60 md:absolute md:w-48 md:border-t-0 md:border-l">
                <p className="text-sm text-muted-foreground">
                  {date ? 'Doctor not available on this date' : 'Select a date'}
                </p>
              </div>
            )}
          </CardContent>
        ) : (
          <CardContent className="p-12 text-center">
            <UserIcon className="size-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Please select a doctor to view available dates and times</p>
          </CardContent>
        )}

        <CardFooter className="flex flex-col gap-4 border-t px-6 !py-5 md:flex-row">
          <div className="flex items-center gap-2 text-sm flex-1">
            {selectedDoctor && date && selectedTime ? (
              <>
                <CircleCheckIcon className="size-5 stroke-green-600 dark:stroke-green-400 flex-shrink-0" />
                <span>
                  Appointment with <span className="font-medium">{selectedDoctor.name}</span> on{' '}
                  <span className="font-medium">
                    {date.toLocaleDateString('en-US', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long'
                    })}
                  </span>{' '}
                  at <span className="font-medium">{selectedTime}</span>.
                </span>
              </>
            ) : (
              <>Select a doctor, date, and time for the appointment.</>
            )}
          </div>
          <Button 
            disabled={!selectedDoctor || !date || !selectedTime} 
            className="w-full md:ml-auto md:w-auto"
            onClick={handleBookAppointment}
          >
            Book Appointment
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
