import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { ScrollArea } from '../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Pill, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

export interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface ProcedureWithPrescription {
  id: string;
  toothNumber?: string;
  procedureName: string;
  surfaces?: string[];
  estimatedCost: number;
  duration: string;
  prescriptions: Prescription[];
  notes?: string;
}

interface ProcedureWithPrescriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (procedure: ProcedureWithPrescription) => void;
  toothNumber?: string;
  initialProcedure?: Partial<ProcedureWithPrescription>;
}

// Common dental prescriptions library
const PRESCRIPTION_TEMPLATES = [
  {
    name: 'Post-Extraction',
    prescriptions: [
      { medication: 'Amoxicillin', dosage: '500 mg', frequency: '3x daily', duration: '7 days', instructions: 'Take after meals' },
      { medication: 'Ibuprofen', dosage: '400 mg', frequency: '3x daily', duration: '5 days', instructions: 'Take with food' },
      { medication: 'Chlorhexidine Mouthwash', dosage: '15 ml', frequency: '2x daily', duration: '7 days', instructions: 'Rinse for 30 seconds' },
    ]
  },
  {
    name: 'Root Canal',
    prescriptions: [
      { medication: 'Amoxicillin', dosage: '500 mg', frequency: '3x daily', duration: '7 days', instructions: 'Take after meals' },
      { medication: 'Paracetamol', dosage: '500 mg', frequency: 'As needed', duration: '5 days', instructions: 'Max 4x daily for pain' },
    ]
  },
  {
    name: 'General Pain Relief',
    prescriptions: [
      { medication: 'Ibuprofen', dosage: '400 mg', frequency: 'As needed', duration: '3 days', instructions: 'Max 3x daily, take with food' },
    ]
  },
  {
    name: 'Infection Treatment',
    prescriptions: [
      { medication: 'Amoxicillin', dosage: '500 mg', frequency: '3x daily', duration: '7 days', instructions: 'Complete full course' },
      { medication: 'Metronidazole', dosage: '500 mg', frequency: '3x daily', duration: '7 days', instructions: 'No alcohol during treatment' },
    ]
  },
];

const COMMON_MEDICATIONS = [
  { medication: 'Amoxicillin', dosage: '500 mg', frequency: '3x daily', duration: '7 days', instructions: 'Take after meals' },
  { medication: 'Ibuprofen', dosage: '400 mg', frequency: '3x daily', duration: '5 days', instructions: 'Take with food' },
  { medication: 'Paracetamol', dosage: '500 mg', frequency: 'As needed', duration: '5 days', instructions: 'Max 4x daily' },
  { medication: 'Chlorhexidine Mouthwash', dosage: '15 ml', frequency: '2x daily', duration: '7 days', instructions: 'Rinse for 30 seconds' },
  { medication: 'Metronidazole', dosage: '500 mg', frequency: '3x daily', duration: '7 days', instructions: 'No alcohol' },
  { medication: 'Dexamethasone', dosage: '0.5 mg', frequency: '3x daily', duration: '3 days', instructions: 'Take after meals' },
];

const PROCEDURE_LIBRARY = [
  { name: 'Composite Filling', cost: 750000, duration: '45 min' },
  { name: 'Amalgam Filling', cost: 450000, duration: '30 min' },
  { name: 'Crown (Porcelain)', cost: 4500000, duration: '2 visits' },
  { name: 'Crown (Metal)', cost: 3500000, duration: '2 visits' },
  { name: 'Root Canal Treatment', cost: 2800000, duration: '90 min' },
  { name: 'Extraction (Simple)', cost: 500000, duration: '30 min' },
  { name: 'Extraction (Surgical)', cost: 1200000, duration: '60 min' },
  { name: 'Scaling', cost: 350000, duration: '45 min' },
  { name: 'Scaling & Root Planing', cost: 650000, duration: '60 min' },
  { name: 'Fissure Sealant', cost: 200000, duration: '20 min' },
  { name: 'Veneer (Porcelain)', cost: 5500000, duration: '2 visits' },
  { name: 'Implant', cost: 12000000, duration: 'Multiple visits' },
  { name: 'Bridge (3 units)', cost: 9000000, duration: '2 visits' },
  { name: 'Partial Denture', cost: 6500000, duration: 'Multiple visits' },
  { name: 'Teeth Whitening', cost: 1500000, duration: '60 min' },
];

export function ProcedureWithPrescriptionDialog({
  open,
  onOpenChange,
  onSave,
  toothNumber,
  initialProcedure
}: ProcedureWithPrescriptionDialogProps) {
  const [procedureName, setProcedureName] = useState(initialProcedure?.procedureName || '');
  const [estimatedCost, setEstimatedCost] = useState(initialProcedure?.estimatedCost || 0);
  const [duration, setDuration] = useState(initialProcedure?.duration || '');
  const [notes, setNotes] = useState(initialProcedure?.notes || '');
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(initialProcedure?.prescriptions || []);
  
  const [newPrescription, setNewPrescription] = useState({
    medication: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: ''
  });

  const handleSelectProcedure = (proc: typeof PROCEDURE_LIBRARY[0]) => {
    setProcedureName(proc.name);
    setEstimatedCost(proc.cost);
    setDuration(proc.duration);
  };

  const handleLoadTemplate = (template: typeof PRESCRIPTION_TEMPLATES[0]) => {
    const newPrescriptions = template.prescriptions.map(p => ({
      id: crypto.randomUUID(),
      ...p
    }));
    setPrescriptions(newPrescriptions);
  };

  const handleAddCommonMedication = (med: typeof COMMON_MEDICATIONS[0]) => {
    const newPrescription: Prescription = {
      id: crypto.randomUUID(),
      ...med
    };
    setPrescriptions([...prescriptions, newPrescription]);
  };

  const handleAddCustomPrescription = () => {
    if (!newPrescription.medication || !newPrescription.dosage) {
      alert('Please enter medication name and dosage');
      return;
    }

    const prescription: Prescription = {
      id: crypto.randomUUID(),
      ...newPrescription
    };

    setPrescriptions([...prescriptions, prescription]);
    setNewPrescription({
      medication: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: ''
    });
  };

  const handleRemovePrescription = (id: string) => {
    setPrescriptions(prescriptions.filter(p => p.id !== id));
  };

  const handleSave = () => {
    if (!procedureName) {
      alert('Please select or enter a procedure name');
      return;
    }

    const procedure: ProcedureWithPrescription = {
      id: crypto.randomUUID(),
      toothNumber,
      procedureName,
      estimatedCost,
      duration,
      prescriptions,
      notes
    };

    onSave(procedure);
    onOpenChange(false);
    
    // Reset form
    setProcedureName('');
    setEstimatedCost(0);
    setDuration('');
    setNotes('');
    setPrescriptions([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Add Procedure {toothNumber && `for Tooth #${toothNumber}`}
          </DialogTitle>
          <DialogDescription>
            Select procedure and add prescriptions if needed
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Procedure Selection */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Select Procedure</h3>
            <div className="grid grid-cols-3 gap-2 max-h-[200px] overflow-y-auto">
              {PROCEDURE_LIBRARY.map((proc) => (
                <Button
                  key={proc.name}
                  variant={procedureName === proc.name ? "default" : "outline"}
                  size="sm"
                  className="justify-start text-left h-auto py-2"
                  onClick={() => handleSelectProcedure(proc)}
                >
                  <div className="w-full">
                    <div className="font-medium text-sm">{proc.name}</div>
                    <div className="text-xs opacity-80">
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(proc.cost)}
                    </div>
                  </div>
                </Button>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <div>
                <Label className="text-xs">Procedure Name</Label>
                <Input
                  value={procedureName}
                  onChange={(e) => setProcedureName(e.target.value)}
                  placeholder="Custom procedure..."
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Estimated Cost (Rp)</Label>
                <Input
                  type="number"
                  value={estimatedCost}
                  onChange={(e) => setEstimatedCost(Number(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Duration</Label>
                <Input
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g., 45 min"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="mt-3">
              <Label className="text-xs">Procedure Notes</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes about the procedure..."
                rows={2}
                className="mt-1"
              />
            </div>
          </Card>

          {/* Prescriptions */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Pill className="size-5 text-blue-600" />
                <h3 className="font-semibold">Prescriptions</h3>
                {prescriptions.length > 0 && (
                  <Badge variant="secondary">{prescriptions.length} medication(s)</Badge>
                )}
              </div>
            </div>

            <Tabs defaultValue="templates" className="w-full">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="templates">Templates</TabsTrigger>
                <TabsTrigger value="common">Common</TabsTrigger>
                <TabsTrigger value="custom">Custom</TabsTrigger>
              </TabsList>

              {/* Templates */}
              <TabsContent value="templates" className="space-y-2 mt-3">
                <p className="text-sm text-muted-foreground mb-2">Quick prescription templates</p>
                <div className="grid grid-cols-2 gap-2">
                  {PRESCRIPTION_TEMPLATES.map((template) => (
                    <Button
                      key={template.name}
                      variant="outline"
                      size="sm"
                      onClick={() => handleLoadTemplate(template)}
                      className="justify-start"
                    >
                      <CheckCircle2 className="size-4 mr-2" />
                      {template.name} ({template.prescriptions.length} meds)
                    </Button>
                  ))}
                </div>
              </TabsContent>

              {/* Common Medications */}
              <TabsContent value="common" className="mt-3">
                <p className="text-sm text-muted-foreground mb-2">Click to add common medications</p>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-2">
                    {COMMON_MEDICATIONS.map((med, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 border rounded hover:bg-accent cursor-pointer"
                        onClick={() => handleAddCommonMedication(med)}
                      >
                        <div className="flex-1">
                          <div className="font-medium text-sm">{med.medication}</div>
                          <div className="text-xs text-muted-foreground">
                            {med.dosage} • {med.frequency} • {med.duration}
                          </div>
                        </div>
                        <Plus className="size-4 text-blue-600" />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* Custom Prescription */}
              <TabsContent value="custom" className="mt-3 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Medication Name *</Label>
                    <Input
                      value={newPrescription.medication}
                      onChange={(e) => setNewPrescription({ ...newPrescription, medication: e.target.value })}
                      placeholder="e.g., Amoxicillin"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Dosage *</Label>
                    <Input
                      value={newPrescription.dosage}
                      onChange={(e) => setNewPrescription({ ...newPrescription, dosage: e.target.value })}
                      placeholder="e.g., 500 mg"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Frequency</Label>
                    <Input
                      value={newPrescription.frequency}
                      onChange={(e) => setNewPrescription({ ...newPrescription, frequency: e.target.value })}
                      placeholder="e.g., 3x daily"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Duration</Label>
                    <Input
                      value={newPrescription.duration}
                      onChange={(e) => setNewPrescription({ ...newPrescription, duration: e.target.value })}
                      placeholder="e.g., 7 days"
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Instructions</Label>
                  <Input
                    value={newPrescription.instructions}
                    onChange={(e) => setNewPrescription({ ...newPrescription, instructions: e.target.value })}
                    placeholder="e.g., Take after meals"
                    className="mt-1"
                  />
                </div>
                <Button onClick={handleAddCustomPrescription} size="sm" className="w-full">
                  <Plus className="size-4 mr-2" />
                  Add Custom Prescription
                </Button>
              </TabsContent>
            </Tabs>

            {/* Current Prescriptions List */}
            {prescriptions.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">
                  Current Prescriptions ({prescriptions.length})
                </h4>
                <div className="space-y-2">
                  {prescriptions.map((prescription) => (
                    <div key={prescription.id} className="flex items-start justify-between p-2 bg-white rounded border">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{prescription.medication}</div>
                        <div className="text-xs text-muted-foreground">
                          {prescription.dosage} • {prescription.frequency} • {prescription.duration}
                        </div>
                        {prescription.instructions && (
                          <div className="text-xs text-blue-700 mt-1">
                            📝 {prescription.instructions}
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemovePrescription(prescription.id)}
                      >
                        <Trash2 className="size-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <CheckCircle2 className="size-4 mr-2" />
            Add Procedure
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
