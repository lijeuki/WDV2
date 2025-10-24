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
  Prescription,
  DENTAL_MEDICATIONS,
  PRESCRIPTION_TEMPLATES,
  checkDrugInteractions,
  DrugInteraction,
} from '@/lib/types/prescription';
import {
  Pill,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Printer,
  Send,
  FileText,
  Sparkles,
  Save,
} from 'lucide-react';

interface PrescriptionManagerProps {
  patientId: string;
  doctorId: string;
  visitId?: string;
  soapNotesId?: string;
  patientMedications?: string[];
  patientAllergies?: string[];
  onSave?: (prescriptions: Prescription[]) => void;
  onPrint?: (prescriptions: Prescription[]) => void;
  onSend?: (prescriptions: Prescription[]) => void;
}

export default function PrescriptionManager({
  patientId,
  doctorId,
  visitId,
  soapNotesId,
  patientMedications = [],
  patientAllergies = [],
  onSave,
  onPrint,
  onSend,
}: PrescriptionManagerProps) {
  const [prescriptions, setPrescriptions] = useState<Partial<Prescription>[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [interactions, setInteractions] = useState<DrugInteraction[]>([]);
  const [showInteractionWarning, setShowInteractionWarning] = useState(false);

  const addBlankPrescription = () => {
    const newPrescription: Partial<Prescription> = {
      id: crypto.randomUUID(),
      patientId,
      doctorId,
      visitId,
      soapNotesId,
      medication: {
        medicationId: '',
        medicationName: '',
        strength: '',
        form: '',
      },
      dosage: '',
      frequency: '',
      duration: '',
      quantity: 0,
      refills: 0,
      instructions: '',
      reason: '',
      status: 'pending',
      prescribedDate: new Date().toISOString().split('T')[0],
    };

    setPrescriptions([...prescriptions, newPrescription]);
  };

  const applyTemplate = (templateId: string) => {
    const template = PRESCRIPTION_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;

    const newPrescriptions = template.medications.map((med) => {
      const medication = DENTAL_MEDICATIONS.find((m) => m.id === med.medicationId);
      
      return {
        id: crypto.randomUUID(),
        patientId,
        doctorId,
        visitId,
        soapNotesId,
        medication: {
          medicationId: med.medicationId,
          medicationName: med.medicationName,
          strength: medication?.strengths[0] || '',
          form: medication?.form || '',
          genericName: medication?.genericName,
        },
        dosage: med.dosage,
        frequency: med.frequency,
        duration: med.duration,
        quantity: calculateQuantity(med.frequency, med.duration),
        refills: 0,
        instructions: med.instructions,
        reason: template.name,
        status: 'pending',
        prescribedDate: new Date().toISOString().split('T')[0],
      } as Partial<Prescription>;
    });

    setPrescriptions(newPrescriptions);
    setSelectedTemplate(templateId);
    checkAllInteractions(newPrescriptions);
  };

  const calculateQuantity = (frequency: string, duration: string): number => {
    // Simple calculation - parse frequency and duration
    const daysMatch = duration.match(/(\d+)\s*days?/i);
    const days = daysMatch ? parseInt(daysMatch[1]) : 7;

    if (frequency.toLowerCase().includes('every 4')) return days * 6;
    if (frequency.toLowerCase().includes('every 6')) return days * 4;
    if (frequency.toLowerCase().includes('every 8')) return days * 3;
    if (frequency.toLowerCase().includes('twice') || frequency.toLowerCase().includes('2')) return days * 2;
    if (frequency.toLowerCase().includes('once') || frequency.toLowerCase().includes('daily')) return days;

    return days * 3; // Default
  };

  const updatePrescription = (index: number, field: string, value: any) => {
    const updated = [...prescriptions];
    
    if (field.startsWith('medication.')) {
      const medField = field.split('.')[1];
      updated[index] = {
        ...updated[index],
        medication: {
          ...updated[index].medication!,
          [medField]: value,
        },
      };
    } else {
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
    }

    setPrescriptions(updated);
    checkAllInteractions(updated);
  };

  const selectMedication = (index: number, medicationId: string) => {
    const medication = DENTAL_MEDICATIONS.find((m) => m.id === medicationId);
    if (!medication) return;

    const updated = [...prescriptions];
    updated[index] = {
      ...updated[index],
      medication: {
        medicationId: medication.id,
        medicationName: medication.name,
        genericName: medication.genericName,
        strength: medication.strengths[0],
        form: medication.form,
      },
      dosage: medication.usualDosage,
      instructions: `Take as directed. ${medication.sideEffects ? 'Common side effects: ' + medication.sideEffects.slice(0, 2).join(', ') : ''}`,
    };

    setPrescriptions(updated);
    checkAllInteractions(updated);
  };

  const removePrescription = (index: number) => {
    const updated = prescriptions.filter((_, i) => i !== index);
    setPrescriptions(updated);
    checkAllInteractions(updated);
  };

  const checkAllInteractions = (currentPrescriptions: Partial<Prescription>[]) => {
    const prescribedMeds = currentPrescriptions
      .map((p) => p.medication?.medicationName || '')
      .filter(Boolean);

    const foundInteractions = checkDrugInteractions(prescribedMeds, patientMedications);
    setInteractions(foundInteractions);
    setShowInteractionWarning(foundInteractions.length > 0);
  };

  const handleSave = () => {
    const completePrescriptions = prescriptions.map((p) => ({
      ...p,
      id: p.id || crypto.randomUUID(),
      patientId,
      doctorId,
      createdAt: new Date().toISOString(),
    })) as Prescription[];

    onSave?.(completePrescriptions);
  };

  const handlePrint = () => {
    const completePrescriptions = prescriptions as Prescription[];
    onPrint?.(completePrescriptions);
  };

  const handleSend = () => {
    const completePrescriptions = prescriptions as Prescription[];
    onSend?.(completePrescriptions);
  };

  const getMedicationsByCategory = (category: string) => {
    return DENTAL_MEDICATIONS.filter((m) => m.category === category);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Pill className="size-6 text-purple-600" />
            <div>
              <h2 className="text-xl font-bold">Prescription Manager</h2>
              <p className="text-sm text-gray-600">E-Prescription with Drug Interaction Checker</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Select value={selectedTemplate} onValueChange={applyTemplate}>
              <SelectTrigger className="w-[250px]">
                <Sparkles className="size-4 mr-2" />
                <SelectValue placeholder="Apply template..." />
              </SelectTrigger>
              <SelectContent>
                {PRESCRIPTION_TEMPLATES.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={addBlankPrescription}>
              <Plus className="size-4 mr-2" />
              Add Prescription
            </Button>
          </div>
        </div>
      </Card>

      {/* Patient Allergies Warning */}
      {patientAllergies.length > 0 && (
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="size-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">Patient Allergies</h3>
              <p className="text-sm text-red-800 mt-1">
                <strong>Allergies:</strong> {patientAllergies.join(', ')}
              </p>
              <p className="text-sm text-red-700 mt-1">
                Please verify medications do not contain allergens before prescribing.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Drug Interaction Warnings */}
      {showInteractionWarning && interactions.length > 0 && (
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="size-5 text-yellow-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-900">Drug Interactions Detected</h3>
              <div className="space-y-3 mt-3">
                {interactions.map((interaction, index) => (
                  <div key={index} className="bg-white rounded-lg p-3 border border-yellow-300">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">
                        {interaction.medication1} + {interaction.medication2}
                      </span>
                      <Badge
                        variant={
                          interaction.severity === 'contraindicated'
                            ? 'destructive'
                            : interaction.severity === 'major'
                            ? 'destructive'
                            : 'default'
                        }
                      >
                        {interaction.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{interaction.description}</p>
                    <p className="text-sm text-blue-700">
                      <strong>Recommendation:</strong> {interaction.recommendation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Current Patient Medications */}
      {patientMedications.length > 0 && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <FileText className="size-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900">Current Medications</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {patientMedications.map((med, index) => (
                  <Badge key={index} variant="secondary">
                    {med}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Prescriptions List */}
      <div className="space-y-4">
        {prescriptions.length === 0 ? (
          <Card className="p-12 text-center">
            <Pill className="size-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Prescriptions Added</h3>
            <p className="text-gray-500 mb-4">
              Add a prescription manually or apply a template to get started
            </p>
            <Button onClick={addBlankPrescription}>
              <Plus className="size-4 mr-2" />
              Add First Prescription
            </Button>
          </Card>
        ) : (
          prescriptions.map((prescription, index) => (
            <Card key={prescription.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold">Prescription #{index + 1}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removePrescription(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>

              <div className="space-y-4">
                {/* Medication Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Medication *</Label>
                    <Select
                      value={prescription.medication?.medicationId}
                      onValueChange={(value) => selectMedication(index, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select medication..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="antibiotics-header" disabled>
                          <span className="font-semibold">Antibiotics</span>
                        </SelectItem>
                        {getMedicationsByCategory('antibiotic').map((med) => (
                          <SelectItem key={med.id} value={med.id}>
                            {med.name} ({med.strengths.join(', ')})
                          </SelectItem>
                        ))}
                        <SelectItem value="analgesics-header" disabled>
                          <span className="font-semibold">Analgesics</span>
                        </SelectItem>
                        {getMedicationsByCategory('analgesic').map((med) => (
                          <SelectItem key={med.id} value={med.id}>
                            {med.name} ({med.strengths.join(', ')})
                          </SelectItem>
                        ))}
                        <SelectItem value="anti-inflammatory-header" disabled>
                          <span className="font-semibold">Anti-inflammatory</span>
                        </SelectItem>
                        {getMedicationsByCategory('anti-inflammatory').map((med) => (
                          <SelectItem key={med.id} value={med.id}>
                            {med.name} ({med.strengths.join(', ')})
                          </SelectItem>
                        ))}
                        <SelectItem value="other-header" disabled>
                          <span className="font-semibold">Other</span>
                        </SelectItem>
                        {DENTAL_MEDICATIONS.filter(
                          (m) =>
                            m.category !== 'antibiotic' &&
                            m.category !== 'analgesic' &&
                            m.category !== 'anti-inflammatory'
                        ).map((med) => (
                          <SelectItem key={med.id} value={med.id}>
                            {med.name} ({med.strengths.join(', ')})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Reason for Prescription *</Label>
                    <Input
                      placeholder="e.g., Dental abscess"
                      value={prescription.reason}
                      onChange={(e) => updatePrescription(index, 'reason', e.target.value)}
                    />
                  </div>
                </div>

                {/* Dosage Details */}
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <Label>Dosage *</Label>
                    <Input
                      placeholder="e.g., 500mg"
                      value={prescription.dosage}
                      onChange={(e) => updatePrescription(index, 'dosage', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Frequency *</Label>
                    <Input
                      placeholder="e.g., Every 8 hours"
                      value={prescription.frequency}
                      onChange={(e) => updatePrescription(index, 'frequency', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Duration *</Label>
                    <Input
                      placeholder="e.g., 7 days"
                      value={prescription.duration}
                      onChange={(e) => updatePrescription(index, 'duration', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      placeholder="21"
                      value={prescription.quantity || ''}
                      onChange={(e) =>
                        updatePrescription(index, 'quantity', parseInt(e.target.value) || 0)
                      }
                    />
                  </div>
                </div>

                {/* Instructions */}
                <div>
                  <Label>Instructions for Patient *</Label>
                  <Textarea
                    placeholder="Detailed instructions on how to take the medication..."
                    rows={3}
                    value={prescription.instructions}
                    onChange={(e) => updatePrescription(index, 'instructions', e.target.value)}
                  />
                </div>

                {/* Additional Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Refills</Label>
                    <Input
                      type="number"
                      min="0"
                      max="5"
                      value={prescription.refills || 0}
                      onChange={(e) =>
                        updatePrescription(index, 'refills', parseInt(e.target.value) || 0)
                      }
                    />
                  </div>

                  <div>
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={prescription.startDate || prescription.prescribedDate}
                      onChange={(e) => updatePrescription(index, 'startDate', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Actions */}
      {prescriptions.length > 0 && (
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle2 className="size-4" />
              <span>{prescriptions.length} prescription(s) ready</span>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleSave}>
                <Save className="size-4 mr-2" />
                Save Draft
              </Button>

              <Button variant="outline" onClick={handlePrint}>
                <Printer className="size-4 mr-2" />
                Print Rx
              </Button>

              <Button onClick={handleSend} disabled={interactions.some((i) => i.severity === 'contraindicated')}>
                <Send className="size-4 mr-2" />
                Send to Pharmacy
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
