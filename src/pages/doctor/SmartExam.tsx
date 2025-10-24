import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Odontogram from '@/components/organisms/Odontogram';
import { ExamData, OdontogramData, ToothNumber } from '@/lib/types/dental';
import { ArrowLeft, Save, CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';

export default function SmartExam() {
  const navigate = useNavigate();
  const { patientId } = useParams();

  const [examStep, setExamStep] = useState<'vitals' | 'odontogram' | 'diagnosis' | 'review'>('vitals');
  
  const [examData, setExamData] = useState<Partial<ExamData>>({
    patientId: patientId || '',
    examDate: new Date().toISOString().split('T')[0],
    chiefComplaint: '',
    bloodPressure: '',
    pulse: undefined,
    temperature: undefined,
    odontogramData: {
      teeth: {} as Record<ToothNumber, any>
    },
    clinicalNotes: '',
    diagnosis: [],
    status: 'in_progress'
  });

  const updateExamData = (field: keyof ExamData, value: any) => {
    setExamData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOdontogramChange = (data: OdontogramData) => {
    updateExamData('odontogramData', data);
  };

  const getTeethRequiringTreatment = (): ToothNumber[] => {
    if (!examData.odontogramData) return [];
    return Object.values(examData.odontogramData.teeth)
      .filter(tooth => tooth.requiresTreatment)
      .map(tooth => tooth.toothNumber);
  };

  const handleCompleteExam = async () => {
    // In real app, save to Supabase
    console.log('Completing exam:', examData);
    
    // Check if there are teeth requiring treatment
    const requiresTreatment = getTeethRequiringTreatment().length > 0;
    
    if (requiresTreatment) {
      // Navigate to treatment plan builder
      navigate(`/doctor/treatment-plan/new/${patientId}`, {
        state: { examData }
      });
    } else {
      // No treatment needed, show success and return to patient list
      alert('Examination completed successfully! No treatment required at this time.');
      navigate('/doctor/patients');
    }
  };

  const progressSteps = [
    { id: 'vitals', label: 'Vitals & Chief Complaint', completed: !!examData.chiefComplaint },
    { id: 'odontogram', label: 'Odontogram Charting', completed: Object.keys(examData.odontogramData?.teeth || {}).length > 0 },
    { id: 'diagnosis', label: 'Clinical Notes & Diagnosis', completed: !!examData.clinicalNotes },
    { id: 'review', label: 'Review & Complete', completed: false }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="size-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Smart Exam Workflow</h1>
              <p className="text-gray-600">Patient ID: {patientId}</p>
            </div>
          </div>
          
          <Button
            variant="outline"
            onClick={() => {
              // Auto-save
              console.log('Auto-saving:', examData);
            }}
          >
            <Save className="size-4 mr-2" />
            Auto-save
          </Button>
        </div>

        {/* Progress Steps */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            {progressSteps.map((step, index) => (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => setExamStep(step.id as any)}
                  className={`flex items-center gap-2 ${
                    examStep === step.id ? 'text-blue-600' : 'text-gray-600'
                  }`}
                >
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center font-bold
                    ${step.completed ? 'bg-green-500 text-white' : 
                      examStep === step.id ? 'bg-blue-500 text-white' : 
                      'bg-gray-200 text-gray-600'}
                  `}>
                    {step.completed ? <CheckCircle2 className="size-5" /> : index + 1}
                  </div>
                  <span className="text-sm font-medium hidden md:block">{step.label}</span>
                </button>
                {index < progressSteps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    step.completed ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </Card>

        {/* Step Content */}
        {examStep === 'vitals' && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Vitals & Chief Complaint</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Chief Complaint *
                </label>
                <Textarea
                  value={examData.chiefComplaint}
                  onChange={(e) => updateExamData('chiefComplaint', e.target.value)}
                  placeholder="What brings the patient in today?"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Blood Pressure
                  </label>
                  <Input
                    value={examData.bloodPressure}
                    onChange={(e) => updateExamData('bloodPressure', e.target.value)}
                    placeholder="120/80"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Pulse (bpm)
                  </label>
                  <Input
                    type="number"
                    value={examData.pulse || ''}
                    onChange={(e) => updateExamData('pulse', parseInt(e.target.value) || undefined)}
                    placeholder="72"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Temperature (°C)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    value={examData.temperature || ''}
                    onChange={(e) => updateExamData('temperature', parseFloat(e.target.value) || undefined)}
                    placeholder="36.5"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => setExamStep('odontogram')}
                  disabled={!examData.chiefComplaint}
                >
                  Continue to Odontogram
                </Button>
              </div>
            </div>
          </Card>
        )}

        {examStep === 'odontogram' && (
          <div className="space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Odontogram Charting</h2>
              <Odontogram
                data={examData.odontogramData!}
                onChange={handleOdontogramChange}
              />
            </Card>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setExamStep('vitals')}
              >
                Back
              </Button>
              <Button
                onClick={() => setExamStep('diagnosis')}
              >
                Continue to Diagnosis
              </Button>
            </div>
          </div>
        )}

        {examStep === 'diagnosis' && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Clinical Notes & Diagnosis</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Clinical Notes
                </label>
                <Textarea
                  value={examData.clinicalNotes}
                  onChange={(e) => updateExamData('clinicalNotes', e.target.value)}
                  placeholder="Detailed clinical observations..."
                  rows={6}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Diagnosis (comma-separated)
                </label>
                <Input
                  value={examData.diagnosis?.join(', ') || ''}
                  onChange={(e) => updateExamData('diagnosis', e.target.value.split(',').map(d => d.trim()).filter(Boolean))}
                  placeholder="e.g., Dental caries, Gingivitis"
                />
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setExamStep('odontogram')}
                >
                  Back
                </Button>
                <Button
                  onClick={() => setExamStep('review')}
                >
                  Review Exam
                </Button>
              </div>
            </div>
          </Card>
        )}

        {examStep === 'review' && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Review Exam</h2>
            <div className="space-y-6">
              {/* Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Chief Complaint</h3>
                  <p className="text-gray-700">{examData.chiefComplaint}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Vitals</h3>
                  <div className="space-y-1 text-sm">
                    {examData.bloodPressure && <p>BP: {examData.bloodPressure}</p>}
                    {examData.pulse && <p>Pulse: {examData.pulse} bpm</p>}
                    {examData.temperature && <p>Temp: {examData.temperature}°C</p>}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Clinical Notes</h3>
                  <p className="text-gray-700">{examData.clinicalNotes || 'None'}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Diagnosis</h3>
                  <div className="flex flex-wrap gap-2">
                    {examData.diagnosis?.map(d => (
                      <Badge key={d}>{d}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Teeth Requiring Treatment */}
              {getTeethRequiringTreatment().length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="size-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-yellow-900">Treatment Required</h3>
                      <p className="text-sm text-yellow-800 mt-1">
                        {getTeethRequiringTreatment().length} teeth require treatment: {getTeethRequiringTreatment().join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Odontogram Preview */}
              <div>
                <h3 className="font-semibold mb-3">Odontogram</h3>
                <Odontogram
                  data={examData.odontogramData!}
                  readOnly
                  highlightedTeeth={getTeethRequiringTreatment()}
                />
              </div>

              {/* Actions */}
              <div className="flex justify-between pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setExamStep('diagnosis')}
                >
                  Back to Edit
                </Button>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleCompleteExam}
                  >
                    Save & Exit
                  </Button>
                  <Button
                    onClick={handleCompleteExam}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle2 className="size-4 mr-2" />
                    Complete Exam & Create Treatment Plan
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
