import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  SOAPNotes,
  SOAPNotesSubjective,
  SOAPNotesObjective,
  SOAPNotesAssessment,
  SOAPNotesPlan,
  DEFAULT_SOAP_TEMPLATES,
  OdontogramData,
} from '@/lib/types/dental';
import {
  FileText,
  User,
  Activity,
  ClipboardCheck,
  PenTool,
  Plus,
  X,
  Save,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface SOAPNotesFormProps {
  examId?: string;
  patientId: string;
  doctorId: string;
  odontogramData?: OdontogramData;
  initialData?: Partial<SOAPNotes>;
  onSave?: (soapNotes: SOAPNotes) => void;
  onComplete?: (soapNotes: SOAPNotes) => void;
}

type SOAPSection = 'subjective' | 'objective' | 'assessment' | 'plan';

export default function SOAPNotesForm({
  examId,
  patientId,
  doctorId,
  odontogramData,
  initialData,
  onSave,
  onComplete,
}: SOAPNotesFormProps) {
  const [activeSection, setActiveSection] = useState<SOAPSection>('subjective');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  const [soapNotes, setSOAPNotes] = useState<Partial<SOAPNotes>>({
    examId: examId || '',
    patientId,
    doctorId,
    visitDate: new Date().toISOString().split('T')[0],
    subjective: {
      chiefComplaint: '',
      historyOfPresentIllness: '',
      painLevel: undefined,
      painLocation: '',
      painDuration: '',
      previousTreatments: '',
      allergies: '',
      medications: '',
      medicalHistory: '',
    },
    objective: {
      vitalSigns: {
        bloodPressure: '',
        pulse: undefined,
        temperature: undefined,
        respiratoryRate: undefined,
      },
      extraoralExamination: '',
      intraoralExamination: '',
      periodontalAssessment: '',
      odontogramData: odontogramData || { teeth: {} as Record<any, any> },
      radiographicFindings: '',
      diagnosticTests: '',
    },
    assessment: {
      primaryDiagnosis: '',
      secondaryDiagnoses: [],
      icd10Codes: [],
      prognosis: 'good',
      differentialDiagnoses: [],
      clinicalImpression: '',
    },
    plan: {
      immediateTreatment: '',
      proposedTreatmentPlan: '',
      procedures: [],
      prescriptions: [],
      patientInstructions: '',
      followUpSchedule: '',
      referrals: [],
      preventiveMeasures: [],
    },
    status: 'draft',
    ...initialData,
  });

  const updateSubjective = (field: keyof SOAPNotesSubjective, value: any) => {
    setSOAPNotes((prev) => ({
      ...prev,
      subjective: {
        ...prev.subjective!,
        [field]: value,
      },
    }));
  };

  const updateObjective = (field: keyof SOAPNotesObjective, value: any) => {
    setSOAPNotes((prev) => ({
      ...prev,
      objective: {
        ...prev.objective!,
        [field]: value,
      },
    }));
  };

  const updateAssessment = (field: keyof SOAPNotesAssessment, value: any) => {
    setSOAPNotes((prev) => ({
      ...prev,
      assessment: {
        ...prev.assessment!,
        [field]: value,
      },
    }));
  };

  const updatePlan = (field: keyof SOAPNotesPlan, value: any) => {
    setSOAPNotes((prev) => ({
      ...prev,
      plan: {
        ...prev.plan!,
        [field]: value,
      },
    }));
  };

  const applyTemplate = (templateId: string) => {
    const template = DEFAULT_SOAP_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;

    setSOAPNotes((prev) => ({
      ...prev,
      subjective: {
        ...prev.subjective!,
        ...template.subjectiveTemplate,
      },
      objective: {
        ...prev.objective!,
        ...template.objectiveTemplate,
      },
      assessment: {
        ...prev.assessment!,
        ...template.assessmentTemplate,
      },
      plan: {
        ...prev.plan!,
        ...template.planTemplate,
      },
    }));

    setSelectedTemplate(templateId);
  };

  const addDiagnosis = () => {
    const diagnosis = prompt('Enter secondary diagnosis:');
    if (diagnosis) {
      updateAssessment('secondaryDiagnoses', [
        ...(soapNotes.assessment?.secondaryDiagnoses || []),
        diagnosis,
      ]);
    }
  };

  const removeDiagnosis = (index: number) => {
    const diagnoses = [...(soapNotes.assessment?.secondaryDiagnoses || [])];
    diagnoses.splice(index, 1);
    updateAssessment('secondaryDiagnoses', diagnoses);
  };

  const addReferral = () => {
    const referral = prompt('Enter referral specialist:');
    if (referral) {
      updatePlan('referrals', [...(soapNotes.plan?.referrals || []), referral]);
    }
  };

  const removeReferral = (index: number) => {
    const referrals = [...(soapNotes.plan?.referrals || [])];
    referrals.splice(index, 1);
    updatePlan('referrals', referrals);
  };

  const handleSave = () => {
    const completeNotes: SOAPNotes = {
      id: soapNotes.id || crypto.randomUUID(),
      examId: soapNotes.examId!,
      patientId: soapNotes.patientId!,
      doctorId: soapNotes.doctorId!,
      visitDate: soapNotes.visitDate!,
      subjective: soapNotes.subjective!,
      objective: soapNotes.objective!,
      assessment: soapNotes.assessment!,
      plan: soapNotes.plan!,
      status: 'draft',
      createdAt: soapNotes.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave?.(completeNotes);
  };

  const handleComplete = () => {
    const completeNotes: SOAPNotes = {
      id: soapNotes.id || crypto.randomUUID(),
      examId: soapNotes.examId!,
      patientId: soapNotes.patientId!,
      doctorId: soapNotes.doctorId!,
      visitDate: soapNotes.visitDate!,
      subjective: soapNotes.subjective!,
      objective: soapNotes.objective!,
      assessment: soapNotes.assessment!,
      plan: soapNotes.plan!,
      status: 'completed',
      createdAt: soapNotes.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      signedAt: new Date().toISOString(),
    };

    onComplete?.(completeNotes);
  };

  const sections = [
    { id: 'subjective', label: 'Subjective', icon: User, color: 'blue' },
    { id: 'objective', label: 'Objective', icon: Activity, color: 'green' },
    { id: 'assessment', label: 'Assessment', icon: ClipboardCheck, color: 'yellow' },
    { id: 'plan', label: 'Plan', icon: PenTool, color: 'purple' },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Template Selection */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="size-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold">SOAP Notes</h2>
              <p className="text-sm text-gray-600">Subjective, Objective, Assessment, Plan</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Select value={selectedTemplate} onValueChange={applyTemplate}>
              <SelectTrigger className="w-[250px]">
                <Sparkles className="size-4 mr-2" />
                <SelectValue placeholder="Apply template..." />
              </SelectTrigger>
              <SelectContent>
                {DEFAULT_SOAP_TEMPLATES.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={handleSave}>
              <Save className="size-4 mr-2" />
              Save Draft
            </Button>

            <Button onClick={handleComplete}>
              <CheckCircle2 className="size-4 mr-2" />
              Complete & Sign
            </Button>
          </div>
        </div>
      </Card>

      {/* Section Navigation */}
      <div className="flex gap-2">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id as SOAPSection)}
              className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                isActive
                  ? `border-${section.color}-600 bg-${section.color}-50`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Icon className={`size-5 ${isActive ? `text-${section.color}-600` : 'text-gray-400'}`} />
                <span className={`font-semibold ${isActive ? `text-${section.color}-900` : 'text-gray-600'}`}>
                  {section.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* SUBJECTIVE Section */}
      {activeSection === 'subjective' && (
        <Card className="p-6 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <User className="size-6 text-blue-600" />
            <h3 className="text-xl font-bold">Subjective - Patient's Report</h3>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Chief Complaint *</Label>
              <Input
                placeholder="Patient's main concern or reason for visit"
                value={soapNotes.subjective?.chiefComplaint}
                onChange={(e) => updateSubjective('chiefComplaint', e.target.value)}
              />
            </div>

            <div>
              <Label>History of Present Illness *</Label>
              <Textarea
                placeholder="Detailed description of symptoms, onset, duration, severity..."
                rows={4}
                value={soapNotes.subjective?.historyOfPresentIllness}
                onChange={(e) => updateSubjective('historyOfPresentIllness', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Pain Level (1-10)</Label>
                <Input
                  type="number"
                  min="0"
                  max="10"
                  placeholder="0-10"
                  value={soapNotes.subjective?.painLevel || ''}
                  onChange={(e) => updateSubjective('painLevel', parseInt(e.target.value) || undefined)}
                />
              </div>

              <div>
                <Label>Pain Location</Label>
                <Input
                  placeholder="e.g., Lower right molar"
                  value={soapNotes.subjective?.painLocation}
                  onChange={(e) => updateSubjective('painLocation', e.target.value)}
                />
              </div>

              <div>
                <Label>Pain Duration</Label>
                <Input
                  placeholder="e.g., 3 days"
                  value={soapNotes.subjective?.painDuration}
                  onChange={(e) => updateSubjective('painDuration', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label>Previous Treatments</Label>
              <Textarea
                placeholder="Any previous dental treatments, home remedies, medications tried..."
                rows={2}
                value={soapNotes.subjective?.previousTreatments}
                onChange={(e) => updateSubjective('previousTreatments', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Allergies</Label>
                <Input
                  placeholder="Medications, latex, etc."
                  value={soapNotes.subjective?.allergies}
                  onChange={(e) => updateSubjective('allergies', e.target.value)}
                />
              </div>

              <div>
                <Label>Current Medications</Label>
                <Input
                  placeholder="List all medications"
                  value={soapNotes.subjective?.medications}
                  onChange={(e) => updateSubjective('medications', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label>Medical History</Label>
              <Textarea
                placeholder="Relevant medical conditions, surgeries, hospitalizations..."
                rows={3}
                value={soapNotes.subjective?.medicalHistory}
                onChange={(e) => updateSubjective('medicalHistory', e.target.value)}
              />
            </div>
          </div>
        </Card>
      )}

      {/* OBJECTIVE Section */}
      {activeSection === 'objective' && (
        <Card className="p-6 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="size-6 text-green-600" />
            <h3 className="text-xl font-bold">Objective - Clinical Findings</h3>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-lg font-semibold mb-3 block">Vital Signs</Label>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label>Blood Pressure</Label>
                  <Input
                    placeholder="120/80"
                    value={soapNotes.objective?.vitalSigns.bloodPressure}
                    onChange={(e) =>
                      updateObjective('vitalSigns', {
                        ...soapNotes.objective?.vitalSigns,
                        bloodPressure: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label>Pulse (bpm)</Label>
                  <Input
                    type="number"
                    placeholder="72"
                    value={soapNotes.objective?.vitalSigns.pulse || ''}
                    onChange={(e) =>
                      updateObjective('vitalSigns', {
                        ...soapNotes.objective?.vitalSigns,
                        pulse: parseInt(e.target.value) || undefined,
                      })
                    }
                  />
                </div>

                <div>
                  <Label>Temperature (°F)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="98.6"
                    value={soapNotes.objective?.vitalSigns.temperature || ''}
                    onChange={(e) =>
                      updateObjective('vitalSigns', {
                        ...soapNotes.objective?.vitalSigns,
                        temperature: parseFloat(e.target.value) || undefined,
                      })
                    }
                  />
                </div>

                <div>
                  <Label>Respiratory Rate</Label>
                  <Input
                    type="number"
                    placeholder="16"
                    value={soapNotes.objective?.vitalSigns.respiratoryRate || ''}
                    onChange={(e) =>
                      updateObjective('vitalSigns', {
                        ...soapNotes.objective?.vitalSigns,
                        respiratoryRate: parseInt(e.target.value) || undefined,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>Extraoral Examination *</Label>
              <Textarea
                placeholder="Face, TMJ, lymph nodes, skin, asymmetries..."
                rows={3}
                value={soapNotes.objective?.extraoralExamination}
                onChange={(e) => updateObjective('extraoralExamination', e.target.value)}
              />
            </div>

            <div>
              <Label>Intraoral Examination *</Label>
              <Textarea
                placeholder="Soft tissues, tongue, floor of mouth, palate, oral mucosa..."
                rows={3}
                value={soapNotes.objective?.intraoralExamination}
                onChange={(e) => updateObjective('intraoralExamination', e.target.value)}
              />
            </div>

            <div>
              <Label>Periodontal Assessment</Label>
              <Textarea
                placeholder="Gingiva, pocket depths, bleeding, mobility..."
                rows={3}
                value={soapNotes.objective?.periodontalAssessment}
                onChange={(e) => updateObjective('periodontalAssessment', e.target.value)}
              />
            </div>

            <div>
              <Label>Radiographic Findings</Label>
              <Textarea
                placeholder="X-ray findings, bone levels, pathology..."
                rows={3}
                value={soapNotes.objective?.radiographicFindings}
                onChange={(e) => updateObjective('radiographicFindings', e.target.value)}
              />
            </div>

            <div>
              <Label>Diagnostic Tests</Label>
              <Textarea
                placeholder="Pulp tests, percussion, palpation results..."
                rows={2}
                value={soapNotes.objective?.diagnosticTests}
                onChange={(e) => updateObjective('diagnosticTests', e.target.value)}
              />
            </div>

            {odontogramData && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <Label className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-blue-600" />
                  Odontogram Data Captured
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  {Object.keys(odontogramData.teeth).length} teeth charted with conditions
                </p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* ASSESSMENT Section */}
      {activeSection === 'assessment' && (
        <Card className="p-6 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <ClipboardCheck className="size-6 text-yellow-600" />
            <h3 className="text-xl font-bold">Assessment - Clinical Diagnosis</h3>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Primary Diagnosis *</Label>
              <Input
                placeholder="Main diagnosis based on findings"
                value={soapNotes.assessment?.primaryDiagnosis}
                onChange={(e) => updateAssessment('primaryDiagnosis', e.target.value)}
              />
            </div>

            <div>
              <Label>Secondary Diagnoses</Label>
              <div className="space-y-2">
                {soapNotes.assessment?.secondaryDiagnoses?.map((diagnosis, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Badge variant="secondary" className="flex-1">
                      {diagnosis}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => removeDiagnosis(index)}>
                      <X className="size-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addDiagnosis}>
                  <Plus className="size-4 mr-2" />
                  Add Secondary Diagnosis
                </Button>
              </div>
            </div>

            <div>
              <Label>Prognosis *</Label>
              <Select
                value={soapNotes.assessment?.prognosis}
                onValueChange={(value: any) => updateAssessment('prognosis', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                  <SelectItem value="guarded">Guarded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Clinical Impression *</Label>
              <Textarea
                placeholder="Overall clinical impression, severity, expected outcomes..."
                rows={4}
                value={soapNotes.assessment?.clinicalImpression}
                onChange={(e) => updateAssessment('clinicalImpression', e.target.value)}
              />
            </div>
          </div>
        </Card>
      )}

      {/* PLAN Section */}
      {activeSection === 'plan' && (
        <Card className="p-6 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <PenTool className="size-6 text-purple-600" />
            <h3 className="text-xl font-bold">Plan - Treatment Plan</h3>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Immediate Treatment</Label>
              <Textarea
                placeholder="Treatment provided today (if any)..."
                rows={2}
                value={soapNotes.plan?.immediateTreatment}
                onChange={(e) => updatePlan('immediateTreatment', e.target.value)}
              />
            </div>

            <div>
              <Label>Proposed Treatment Plan *</Label>
              <Textarea
                placeholder="Comprehensive treatment plan overview..."
                rows={4}
                value={soapNotes.plan?.proposedTreatmentPlan}
                onChange={(e) => updatePlan('proposedTreatmentPlan', e.target.value)}
              />
            </div>

            <div>
              <Label>Patient Instructions *</Label>
              <Textarea
                placeholder="Post-treatment care, home care instructions, precautions..."
                rows={3}
                value={soapNotes.plan?.patientInstructions}
                onChange={(e) => updatePlan('patientInstructions', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Follow-up Schedule</Label>
                <Input
                  placeholder="e.g., 2 weeks, 1 month"
                  value={soapNotes.plan?.followUpSchedule}
                  onChange={(e) => updatePlan('followUpSchedule', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label>Referrals</Label>
              <div className="space-y-2">
                {soapNotes.plan?.referrals?.map((referral, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Badge variant="secondary" className="flex-1">
                      {referral}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => removeReferral(index)}>
                      <X className="size-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addReferral}>
                  <Plus className="size-4 mr-2" />
                  Add Referral
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Bottom Actions */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {soapNotes.status === 'draft' && (
            <Badge variant="outline">Draft - Last saved at {new Date().toLocaleTimeString()}</Badge>
          )}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={handleSave}>
            <Save className="size-4 mr-2" />
            Save Draft
          </Button>

          <Button onClick={handleComplete}>
            <CheckCircle2 className="size-4 mr-2" />
            Complete & Sign
          </Button>
        </div>
      </div>
    </div>
  );
}
