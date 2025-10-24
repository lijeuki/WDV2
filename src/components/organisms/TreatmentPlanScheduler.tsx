/**
 * Treatment Plan Scheduler Component
 * Allows scheduling multiple visits from a treatment plan with intelligent grouping
 */

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Edit,
  Save
} from 'lucide-react';
import { 
  groupProceduresIntoVisits, 
  isVisitSchedulable, 
  getSuggestedAppointmentDate,
  VisitGroup 
} from '@/lib/scheduling/procedure-grouping';
import { TreatmentProcedure } from '@/lib/types/dental';

interface TreatmentPlanSchedulerProps {
  procedures: TreatmentProcedure[];
  onComplete?: (visitGroups: VisitGroup[]) => void;
}

export function TreatmentPlanScheduler({
  procedures,
  onComplete,
}: TreatmentPlanSchedulerProps) {
  const [visitGroups, setVisitGroups] = useState<VisitGroup[]>([]);
  const [editingVisitId, setEditingVisitId] = useState<string | null>(null);

  useEffect(() => {
    // Automatically group procedures into visits
    const groups = groupProceduresIntoVisits(procedures);
    setVisitGroups(groups);
  }, [procedures]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const handleScheduleVisit = (visitId: string, date: string, time: string) => {
    setVisitGroups(prev =>
      prev.map(visit =>
        visit.id === visitId
          ? {
              ...visit,
              appointmentId: `appt-${Date.now()}`,
              appointmentDate: date,
              appointmentTime: time,
            }
          : visit
      )
    );
    setEditingVisitId(null);
  };

  const handleReschedule = (visitId: string) => {
    setEditingVisitId(visitId);
  };

  const allVisitsScheduled = visitGroups.every(v => v.appointmentId);
  const scheduledCount = visitGroups.filter(v => v.appointmentId).length;

  const handleConfirmAll = () => {
    if (allVisitsScheduled && onComplete) {
      onComplete(visitGroups);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Schedule Treatment Series</h2>
        <p className="text-gray-600 mt-1">
          {visitGroups.length} visits required • {scheduledCount} scheduled
        </p>
      </div>

      {/* Progress Bar */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Scheduling Progress</span>
          <span className="text-sm text-gray-600">
            {scheduledCount}/{visitGroups.length} visits
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(scheduledCount / visitGroups.length) * 100}%` }}
          />
        </div>
      </Card>

      {/* Visit Groups */}
      <div className="space-y-4">
        {visitGroups.map((visit) => {
          const schedulability = isVisitSchedulable(visit, visitGroups);
          const isScheduled = !!visit.appointmentId;
          const isEditing = editingVisitId === visit.id;
          const suggestedDate = getSuggestedAppointmentDate(visit, visitGroups);

          return (
            <Card
              key={visit.id}
              className={`p-6 ${
                !schedulability.schedulable
                  ? 'opacity-60 bg-gray-50'
                  : isScheduled
                  ? 'border-green-500 bg-green-50'
                  : 'border-blue-500'
              }`}
            >
              <div className="flex items-start justify-between gap-6">
                {/* Visit Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-bold
                      ${
                        isScheduled
                          ? 'bg-green-500 text-white'
                          : schedulability.schedulable
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }
                    `}
                    >
                      {isScheduled ? (
                        <CheckCircle2 className="size-5" />
                      ) : (
                        <span>{visit.visitNumber}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        Visit {visit.visitNumber}
                      </h3>
                      <p className="text-sm text-gray-600">{visit.notes}</p>
                    </div>
                  </div>

                  {/* Procedures in this visit */}
                  <div className="space-y-2 mb-4">
                    {visit.procedures.map((proc) => (
                      <div
                        key={proc.id}
                        className="flex items-center gap-2 text-sm"
                      >
                        {proc.toothNumber && (
                          <Badge variant="outline">#{proc.toothNumber}</Badge>
                        )}
                        <span className="text-gray-700">{proc.procedureName}</span>
                        <span className="text-xs text-gray-500">
                          ({proc.estimatedDuration}min)
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Visit Summary */}
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock className="size-4" />
                      <span>{visit.totalDuration} minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {formatCurrency(visit.totalCost)}
                      </span>
                    </div>
                  </div>

                  {/* Dependency Warning */}
                  {visit.requiresPriorVisit && !schedulability.schedulable && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
                      <AlertCircle className="size-4 text-yellow-600 mt-0.5" />
                      <p className="text-sm text-yellow-800">
                        {schedulability.reason}
                      </p>
                    </div>
                  )}
                </div>

                {/* Scheduling Interface */}
                <div className="w-80">
                  {!schedulability.schedulable ? (
                    <div className="text-center p-4 bg-gray-100 rounded-lg">
                      <AlertCircle className="size-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        Schedule previous visit first
                      </p>
                    </div>
                  ) : isScheduled && !isEditing ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="size-4 text-green-600" />
                        <span className="text-sm font-medium text-green-900">
                          Scheduled
                        </span>
                      </div>
                      <div className="space-y-1 mb-3">
                        <p className="text-sm font-semibold">
                          {formatDate(new Date(visit.appointmentDate!))}
                        </p>
                        <p className="text-sm text-gray-600">
                          {visit.appointmentTime}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReschedule(visit.id)}
                        className="w-full"
                      >
                        <Edit className="size-4 mr-2" />
                        Reschedule
                      </Button>
                    </div>
                  ) : (
                    <SchedulingForm
                      visitId={visit.id}
                      suggestedDate={suggestedDate}
                      duration={visit.totalDuration}
                      onSchedule={(date, time) =>
                        handleScheduleVisit(visit.id, date, time)
                      }
                      onCancel={() => setEditingVisitId(null)}
                      isRescheduling={isEditing}
                    />
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Sequencing Notes */}
      {visitGroups.length > 1 && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="size-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 mb-1">
                Treatment Sequence
              </h4>
              <p className="text-sm text-blue-800">
                Visits are ordered based on clinical requirements. Some procedures
                require healing time before subsequent treatments can begin.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Bulk Actions */}
      <div className="flex gap-3 justify-end pt-4 border-t">
        <Button variant="outline">Save for Later</Button>
        <Button
          disabled={!allVisitsScheduled}
          onClick={handleConfirmAll}
          className="bg-green-600 hover:bg-green-700"
        >
          <CheckCircle2 className="size-4 mr-2" />
          Confirm All Appointments ({scheduledCount}/{visitGroups.length})
        </Button>
      </div>
    </div>
  );
}

/**
 * Scheduling Form Component
 */
interface SchedulingFormProps {
  visitId: string;
  suggestedDate: Date;
  duration: number;
  onSchedule: (date: string, time: string) => void;
  onCancel?: () => void;
  isRescheduling?: boolean;
}

function SchedulingForm({
  suggestedDate,
  duration,
  onSchedule,
  onCancel,
  isRescheduling,
}: SchedulingFormProps) {
  const [selectedDate, setSelectedDate] = useState(
    suggestedDate.toISOString().split('T')[0]
  );
  const [selectedTime, setSelectedTime] = useState('09:00');

  const handleSchedule = () => {
    if (selectedDate && selectedTime) {
      onSchedule(selectedDate, selectedTime);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h4 className="font-semibold mb-3">
        {isRescheduling ? 'Reschedule Appointment' : 'Schedule Appointment'}
      </h4>

      <div className="space-y-3">
        {/* Date Picker */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Select Date
          </label>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
          <p className="text-xs text-gray-500 mt-1">
            Suggested: {suggestedDate.toLocaleDateString('id-ID')}
          </p>
        </div>

        {/* Time Picker */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Select Time
          </label>
          <Input
            type="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
          />
        </div>

        {/* Duration Info */}
        <div className="p-2 bg-gray-50 rounded text-xs">
          <div className="flex items-center gap-2">
            <Clock className="size-3 text-gray-600" />
            <span className="text-gray-600">
              Duration: {duration} minutes (~{Math.ceil(duration / 60)} hours)
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {onCancel && (
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
          )}
          <Button
            size="sm"
            onClick={handleSchedule}
            disabled={!selectedDate || !selectedTime}
            className="flex-1"
          >
            <Save className="size-4 mr-2" />
            {isRescheduling ? 'Update' : 'Schedule'}
          </Button>
        </div>
      </div>
    </div>
  );
}
