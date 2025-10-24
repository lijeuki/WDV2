import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Odontogram from '@/components/organisms/Odontogram';
import { ExamData, ToothNumber } from '@/lib/types/dental';
import { ArrowLeft, Plus, Trash2, Save, Send } from 'lucide-react';

interface TreatmentProcedure {
  id: string;
  toothNumber?: ToothNumber;
  procedureCode: string;
  procedureName: string;
  description: string;
  estimatedCost: number;
  estimatedDuration: number;
  priority: 'urgent' | 'high' | 'normal' | 'low';
  sequenceOrder: number;
}

interface TreatmentPlan {
  id: string;
  title: string;
  description: string;
  procedures: TreatmentProcedure[];
  totalCost: number;
  estimatedInsurance: number;
  patientPortion: number;
  status: 'draft' | 'presented' | 'accepted' | 'in_progress';
}

// Common procedures library
const COMMON_PROCEDURES = [
  { code: 'D0120', name: 'Periodic Oral Evaluation', cost: 500000, duration: 30 },
  { code: 'D0150', name: 'Comprehensive Oral Evaluation', cost: 750000, duration: 45 },
  { code: 'D1110', name: 'Prophylaxis (Cleaning) - Adult', cost: 800000, duration: 45 },
  { code: 'D2140', name: 'Amalgam - One Surface', cost: 1200000, duration: 30 },
  { code: 'D2150', name: 'Amalgam - Two Surfaces', cost: 1500000, duration: 45 },
  { code: 'D2160', name: 'Amalgam - Three Surfaces', cost: 1800000, duration: 60 },
  { code: 'D2330', name: 'Resin - One Surface (Anterior)', cost: 1500000, duration: 30 },
  { code: 'D2740', name: 'Crown - Porcelain/Ceramic', cost: 8000000, duration: 120 },
  { code: 'D3310', name: 'Root Canal - Anterior', cost: 4500000, duration: 90 },
  { code: 'D3320', name: 'Root Canal - Bicuspid', cost: 5500000, duration: 120 },
  { code: 'D3330', name: 'Root Canal - Molar', cost: 7000000, duration: 150 },
  { code: 'D4341', name: 'Scaling & Root Planing (per quadrant)', cost: 2000000, duration: 60 },
  { code: 'D7140', name: 'Extraction - Erupted Tooth', cost: 1500000, duration: 30 },
  { code: 'D7210', name: 'Extraction - Impacted (Soft Tissue)', cost: 3000000, duration: 60 },
  { code: 'D7240', name: 'Extraction - Impacted (Bone)', cost: 5000000, duration: 90 },
  { code: 'D6010', name: 'Implant - Surgical Placement', cost: 15000000, duration: 120 },
];

export default function TreatmentPlanBuilder() {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const location = useLocation();
  const examData: ExamData | undefined = location.state?.examData;

  const [treatmentPlan, setTreatmentPlan] = useState<TreatmentPlan>({
    id: '',
    title: 'Treatment Plan',
    description: '',
    procedures: [],
    totalCost: 0,
    estimatedInsurance: 0,
    patientPortion: 0,
    status: 'draft'
  });

  const [selectedProcedure, setSelectedProcedure] = useState<string>('');
  const [selectedTooth, setSelectedTooth] = useState<ToothNumber | undefined>();

  const addProcedure = () => {
    const procedure = COMMON_PROCEDURES.find(p => p.code === selectedProcedure);
    if (!procedure) return;

    const newProcedure: TreatmentProcedure = {
      id: Date.now().toString(),
      toothNumber: selectedTooth,
      procedureCode: procedure.code,
      procedureName: procedure.name,
      description: '',
      estimatedCost: procedure.cost,
      estimatedDuration: procedure.duration,
      priority: 'normal',
      sequenceOrder: treatmentPlan.procedures.length + 1
    };

    const updatedProcedures = [...treatmentPlan.procedures, newProcedure];
    const totalCost = updatedProcedures.reduce((sum, p) => sum + p.estimatedCost, 0);
    const estimatedInsurance = totalCost * 0.3; // Assume 30% insurance coverage
    const patientPortion = totalCost - estimatedInsurance;

    setTreatmentPlan({
      ...treatmentPlan,
      procedures: updatedProcedures,
      totalCost,
      estimatedInsurance,
      patientPortion
    });

    setSelectedProcedure('');
    setSelectedTooth(undefined);
  };

  const removeProcedure = (id: string) => {
    const updatedProcedures = treatmentPlan.procedures.filter(p => p.id !== id);
    const totalCost = updatedProcedures.reduce((sum, p) => sum + p.estimatedCost, 0);
    const estimatedInsurance = totalCost * 0.3;
    const patientPortion = totalCost - estimatedInsurance;

    setTreatmentPlan({
      ...treatmentPlan,
      procedures: updatedProcedures,
      totalCost,
      estimatedInsurance,
      patientPortion
    });
  };

  const updateProcedure = (id: string, field: keyof TreatmentProcedure, value: any) => {
    const updatedProcedures = treatmentPlan.procedures.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    );

    const totalCost = updatedProcedures.reduce((sum, p) => sum + p.estimatedCost, 0);
    const estimatedInsurance = totalCost * 0.3;
    const patientPortion = totalCost - estimatedInsurance;

    setTreatmentPlan({
      ...treatmentPlan,
      procedures: updatedProcedures,
      totalCost,
      estimatedInsurance,
      patientPortion
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleSaveDraft = () => {
    console.log('Saving draft:', treatmentPlan);
    navigate(-1);
  };

  const handlePresentPlan = () => {
    console.log('Presenting plan:', treatmentPlan);
    // Navigate to checkout/presentation flow
    navigate(`/checkout/${patientId}`, {
      state: { treatmentPlan, examData }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="size-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Treatment Plan Builder</h1>
              <p className="text-gray-600">Patient ID: {patientId}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Odontogram Reference */}
            {examData?.odontogramData && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Exam Findings</h2>
                <Odontogram
                  data={examData.odontogramData}
                  readOnly
                  highlightedTeeth={examData.odontogramData 
                    ? Object.values(examData.odontogramData.teeth)
                        .filter(t => t.requiresTreatment)
                        .map(t => t.toothNumber)
                    : []
                  }
                />
              </Card>
            )}

            {/* Add Procedure */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Add Procedure</h2>
              <div className="flex gap-4">
                <div className="flex-1">
                  <select
                    value={selectedProcedure}
                    onChange={(e) => setSelectedProcedure(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">Select Procedure</option>
                    {COMMON_PROCEDURES.map(proc => (
                      <option key={proc.code} value={proc.code}>
                        {proc.code} - {proc.name} ({formatCurrency(proc.cost)})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-32">
                  <Input
                    type="number"
                    placeholder="Tooth #"
                    value={selectedTooth || ''}
                    onChange={(e) => setSelectedTooth(e.target.value ? parseInt(e.target.value) as ToothNumber : undefined)}
                  />
                </div>
                <Button
                  onClick={addProcedure}
                  disabled={!selectedProcedure}
                >
                  <Plus className="size-4 mr-2" />
                  Add
                </Button>
              </div>
            </Card>

            {/* Procedures List */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">
                Planned Procedures ({treatmentPlan.procedures.length})
              </h2>
              
              {treatmentPlan.procedures.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No procedures added yet. Add procedures above to build the treatment plan.
                </p>
              ) : (
                <div className="space-y-4">
                  {treatmentPlan.procedures.map((proc, index) => (
                    <div key={proc.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant="outline">#{index + 1}</Badge>
                            {proc.toothNumber && (
                              <Badge>Tooth {proc.toothNumber}</Badge>
                            )}
                            <select
                              value={proc.priority}
                              onChange={(e) => updateProcedure(proc.id, 'priority', e.target.value)}
                              className="text-sm px-2 py-1 border rounded"
                            >
                              <option value="urgent">Urgent</option>
                              <option value="high">High</option>
                              <option value="normal">Normal</option>
                              <option value="low">Low</option>
                            </select>
                          </div>
                          
                          <h3 className="font-semibold">{proc.procedureName}</h3>
                          <p className="text-sm text-gray-600 mb-2">{proc.procedureCode}</p>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <label className="text-gray-600">Cost:</label>
                              <Input
                                type="number"
                                value={proc.estimatedCost}
                                onChange={(e) => updateProcedure(proc.id, 'estimatedCost', parseFloat(e.target.value))}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <label className="text-gray-600">Duration (min):</label>
                              <Input
                                type="number"
                                value={proc.estimatedDuration}
                                onChange={(e) => updateProcedure(proc.id, 'estimatedDuration', parseInt(e.target.value))}
                                className="mt-1"
                              />
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeProcedure(proc.id)}
                        >
                          <Trash2 className="size-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar - Summary */}
          <div className="space-y-6">
            <Card className="p-6 sticky top-6">
              <h2 className="text-lg font-semibold mb-4">Treatment Summary</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600">Plan Title</label>
                  <Input
                    value={treatmentPlan.title}
                    onChange={(e) => setTreatmentPlan({ ...treatmentPlan, title: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div className="border-t pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Procedures:</span>
                      <span className="font-medium">{treatmentPlan.procedures.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Est. Duration:</span>
                      <span className="font-medium">
                        {treatmentPlan.procedures.reduce((sum, p) => sum + p.estimatedDuration, 0)} min
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">{formatCurrency(treatmentPlan.totalCost)}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Insurance (est.):</span>
                      <span>-{formatCurrency(treatmentPlan.estimatedInsurance)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-3">
                      <span>Patient Portion:</span>
                      <span>{formatCurrency(treatmentPlan.patientPortion)}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleSaveDraft}
                  >
                    <Save className="size-4 mr-2" />
                    Save Draft
                  </Button>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={handlePresentPlan}
                    disabled={treatmentPlan.procedures.length === 0}
                  >
                    <Send className="size-4 mr-2" />
                    Present to Patient
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
