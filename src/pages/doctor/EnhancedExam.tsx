import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { InteractiveOdontogram } from '@/components/organisms/InteractiveOdontogram';
import { SymbolPalette } from '@/components/molecules/SymbolPalette';
import { ProcedureExecutionMode, PendingProcedure } from '@/components/molecules/ProcedureExecutionMode';
import { ProcedureWithPrescriptionDialog, ProcedureWithPrescription } from '@/components/molecules/ProcedureWithPrescriptionDialog';
import { DentalSymbol, ToothData } from '@/lib/odontogram-types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, CheckCircle2, ArrowRight, FileText, Plus, Pill, ClipboardList, Send } from 'lucide-react';

/**
 * Enhanced Exam Workflow
 * 
 * Features from Badental:
 * - Interactive odontogram with surface-level charting
 * - Symbol palette with categorized dental symbols
 * - Visual feedback for selected symbols and conditions
 * - Auto-legend generation
 * - Multi-step workflow (simplified version)
 */
export default function EnhancedExam() {
  const navigate = useNavigate();
  const { patientId } = useParams();

  // Exam steps - Doctor only workflow
  const [currentStep, setCurrentStep] = useState<'mode-selection' | 'examination' | 'treatment-plan' | 'present'>('mode-selection');

  // Procedure execution mode
  const [executionMode, setExecutionMode] = useState<'execute-pending' | 'select-new' | null>(null);
  const [selectedPendingProcedures, setSelectedPendingProcedures] = useState<string[]>([]);

  // Mock pending procedures (replace with actual data from API)
  const [pendingProcedures] = useState<PendingProcedure[]>([
    {
      id: 'PEND-001',
      toothNumber: '26',
      procedureName: 'Crown (Porcelain)',
      recommendedDate: '15 Aug 2024',
      reason: 'Patient postponed due to budget constraints',
      estimatedCost: 4500000,
      duration: '2 visits',
      surfaces: []
    },
    {
      id: 'PEND-002',
      toothNumber: '36',
      procedureName: 'Root Canal Treatment',
      recommendedDate: '20 Sep 2024',
      reason: 'Patient requested to defer for insurance approval',
      estimatedCost: 2800000,
      duration: '90 minutes',
      surfaces: []
    },
  ]);

  // Odontogram state
  const [selectedSymbol, setSelectedSymbol] = useState<DentalSymbol | null>(null);
  const [odontogramData, setOdontogramData] = useState<Record<string, ToothData>>({});

  // Exam data
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  
  // Treatment plan & procedures
  const [procedures, setProcedures] = useState<ProcedureWithPrescription[]>([]);
  const [showProcedureDialog, setShowProcedureDialog] = useState(false);
  const [selectedToothForProcedure, setSelectedToothForProcedure] = useState<string | undefined>();

  const handleSendToFrontDesk = () => {
    const examData = {
      patientId,
      chiefComplaint,
      odontogramData,
      clinicalNotes,
      procedures,
      examDate: new Date().toISOString(),
      status: 'awaiting_checkout',
      doctorId: 'current-doctor-id' // Replace with actual
    };
    
    console.log('Sending to front desk:', examData);
    // TODO: Save to database and notify front desk
    
    alert(`Treatment plan sent to front desk!\n\n${procedures.length} procedure(s) with ${procedures.reduce((sum, p) => sum + p.prescriptions.length, 0)} prescription(s).\n\nPatient can now proceed to front desk for payment and scheduling.`);
    navigate('/doctor/patients');
  };

  const handleAddProcedure = (toothNumber?: string) => {
    setSelectedToothForProcedure(toothNumber);
    setShowProcedureDialog(true);
  };

  const handleSaveProcedure = (procedure: ProcedureWithPrescription) => {
    setProcedures([...procedures, procedure]);
  };

  const handleRemoveProcedure = (procedureId: string) => {
    setProcedures(procedures.filter(p => p.id !== procedureId));
  };

  const handleModeSelect = (mode: 'execute-pending' | 'select-new') => {
    setExecutionMode(mode);
    // If no pending procedures, automatically proceed
    if (mode === 'select-new' || pendingProcedures.length === 0) {
      setCurrentStep('examination');
    }
  };

  const handleProcedureToggle = (procedureId: string, selected: boolean) => {
    setSelectedPendingProcedures(prev => 
      selected 
        ? [...prev, procedureId]
        : prev.filter(id => id !== procedureId)
    );
  };

  const handleStartExam = () => {
    if (executionMode === 'execute-pending' && selectedPendingProcedures.length === 0) {
      alert('Please select at least one pending procedure to execute.');
      return;
    }
    setCurrentStep('examination');
  };

  const handleNext = () => {
    if (currentStep === 'mode-selection') {
      handleStartExam();
    } else if (currentStep === 'examination') {
      setCurrentStep('treatment-plan');
    } else if (currentStep === 'treatment-plan') {
      setCurrentStep('present');
    } else {
      handleSendToFrontDesk();
    }
  };

  const handlePrevious = () => {
    if (currentStep === 'present') {
      setCurrentStep('treatment-plan');
    } else if (currentStep === 'treatment-plan') {
      setCurrentStep('examination');
    } else if (currentStep === 'examination') {
      setCurrentStep('mode-selection');
    } else {
      navigate(-1);
    }
  };

  // Count charted teeth
  const chartedTeethCount = Object.keys(odontogramData).length;
  const totalConditions = Object.values(odontogramData).reduce(
    (sum, tooth) => sum + tooth.conditions.length, 
    0
  );
  const totalCost = procedures.reduce((sum, p) => sum + p.estimatedCost, 0);
  const totalPrescriptions = procedures.reduce((sum, p) => sum + p.prescriptions.length, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Layout with Persistent Sidebar */}
      <div className="flex">
        {/* LEFT SIDEBAR - Always visible with patient info and stats */}
        <div className="w-80 bg-white border-r min-h-screen p-6 space-y-4 sticky top-0">
          <div>
            <h2 className="text-lg font-bold">Patient Information</h2>
            <p className="text-sm text-muted-foreground">ID: {patientId}</p>
          </div>

          {/* Stats */}
          <Card className="p-4 bg-blue-50">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Teeth Charted:</span>
                <Badge variant="secondary">{chartedTeethCount}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Conditions:</span>
                <Badge variant="secondary">{totalConditions}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Procedures:</span>
                <Badge variant="secondary">{procedures.length}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Prescriptions:</span>
                <Badge variant="secondary">{totalPrescriptions}</Badge>
              </div>
            </div>
          </Card>

          {procedures.length > 0 && (
            <Card className="p-4">
              <h3 className="font-semibold text-sm mb-2">Total Cost</h3>
              <p className="text-2xl font-bold text-blue-600">
                {new Intl.NumberFormat('id-ID', { 
                  style: 'currency', 
                  currency: 'IDR',
                  maximumFractionDigits: 0 
                }).format(totalCost)}
              </p>
            </Card>
          )}

          {/* Quick Actions */}
          <div className="space-y-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start"
              onClick={() => console.log('Save draft')}
            >
              <Save className="size-4 mr-2" />
              Save Draft
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start"
              onClick={handlePrevious}
            >
              <ArrowLeft className="size-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={handlePrevious}>
              <ArrowLeft className="size-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Enhanced Clinical Examination</h1>
              <p className="text-gray-600">Patient ID: {patientId}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {chartedTeethCount} teeth charted
            </Badge>
            <Button variant="outline" onClick={() => console.log('Auto-save')}>
              <Save className="size-4 mr-2" />
              Auto-save
            </Button>
          </div>
        </div>

        {/* Progress Indicator */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-2 ${currentStep === 'mode-selection' ? 'text-blue-600' : currentStep === 'examination' || currentStep === 'review' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`size-8 rounded-full flex items-center justify-center font-bold ${
                currentStep === 'mode-selection' ? 'bg-blue-500 text-white' : currentStep === 'examination' || currentStep === 'review' ? 'bg-green-500 text-white' : 'bg-gray-200'
              }`}>
                {currentStep === 'examination' || currentStep === 'review' ? <CheckCircle2 className="size-5" /> : '1'}
              </div>
              <span className="font-medium">Select Mode</span>
            </div>

            <div className="flex-1 h-1 mx-4 bg-gray-200">
              <div className={`h-full bg-blue-500 transition-all`} style={{ 
                width: currentStep === 'mode-selection' ? '0%' : currentStep === 'examination' ? '50%' : '100%' 
              }} />
            </div>

            <div className={`flex items-center gap-2 ${currentStep === 'examination' ? 'text-blue-600' : currentStep === 'review' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`size-8 rounded-full flex items-center justify-center font-bold ${
                currentStep === 'examination' ? 'bg-blue-500 text-white' : currentStep === 'review' ? 'bg-green-500 text-white' : 'bg-gray-200'
              }`}>
                {currentStep === 'review' ? <CheckCircle2 className="size-5" /> : '2'}
              </div>
              <span className="font-medium">Examination</span>
            </div>

            <div className="flex-1 h-1 mx-4 bg-gray-200">
              <div className={`h-full bg-blue-500 transition-all`} style={{ 
                width: currentStep === 'review' ? '100%' : '0%' 
              }} />
            </div>

            <div className={`flex items-center gap-2 ${currentStep === 'review' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`size-8 rounded-full flex items-center justify-center font-bold ${
                currentStep === 'review' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}>
                3
              </div>
              <span className="font-medium">Review & Complete</span>
            </div>
          </div>
        </Card>

        {/* Step Content */}
        {currentStep === 'mode-selection' ? (
          <ProcedureExecutionMode
            pendingProcedures={pendingProcedures}
            selectedMode={executionMode}
            onModeSelect={handleModeSelect}
            onProcedureToggle={handleProcedureToggle}
            selectedProcedures={selectedPendingProcedures}
          />
        ) : currentStep === 'examination' ? (
          <div className="space-y-6">
            {/* Chief Complaint */}
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Chief Complaint</h3>
              <Input
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                placeholder="Patient's main concern..."
              />
            </Card>

            {/* Interactive Odontogram with Symbol Palette */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Symbol Palette - Left Sidebar */}
              <div className="lg:col-span-1">
                <SymbolPalette
                  onSymbolSelect={setSelectedSymbol}
                  selectedSymbolId={selectedSymbol?.id}
                  compact={true}
                />
              </div>

              {/* Odontogram - Main Area */}
              <div className="lg:col-span-3">
                <InteractiveOdontogram
                  patientId={patientId}
                  initialData={odontogramData}
                  onDataChange={setOdontogramData}
                  selectedSymbol={selectedSymbol}
                  readOnly={false}
                />
              </div>
            </div>

            {/* Clinical Notes */}
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Clinical Notes</h3>
              <Textarea
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                placeholder="General clinical observations..."
                rows={4}
              />
            </Card>
          </div>
        ) : (
          /* Review Step */
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Examination Summary</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-sm text-gray-600 mb-1">Chief Complaint</h3>
                  <p>{chiefComplaint || 'No chief complaint entered'}</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Card className="p-4 bg-blue-50">
                    <div className="text-2xl font-bold text-blue-600">{chartedTeethCount}</div>
                    <div className="text-sm text-gray-600">Teeth Charted</div>
                  </Card>
                  <Card className="p-4 bg-purple-50">
                    <div className="text-2xl font-bold text-purple-600">{totalConditions}</div>
                    <div className="text-sm text-gray-600">Conditions Recorded</div>
                  </Card>
                  <Card className="p-4 bg-green-50">
                    <div className="text-2xl font-bold text-green-600">
                      {Object.values(odontogramData).filter(t => t.conditions.some(c => 
                        ['caries', 'fractured', 'non-vital'].includes(c.symbolId)
                      )).length}
                    </div>
                    <div className="text-sm text-gray-600">Require Treatment</div>
                  </Card>
                </div>

                {clinicalNotes && (
                  <div>
                    <h3 className="font-semibold text-sm text-gray-600 mb-1">Clinical Notes</h3>
                    <p className="text-sm bg-gray-50 p-3 rounded">{clinicalNotes}</p>
                  </div>
                )}

                {/* Odontogram Preview */}
                <div>
                  <h3 className="font-semibold text-sm text-gray-600 mb-2">Odontogram</h3>
                  <InteractiveOdontogram
                    patientId={patientId}
                    initialData={odontogramData}
                    readOnly={true}
                  />
                </div>
              </div>
            </Card>

            {/* Completion Alert */}
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="size-5 text-green-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-green-900">Ready to Complete</h3>
                  <p className="text-sm text-green-700 mt-1">
                    Examination data is ready to be saved. Click "Complete Exam" to finish.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between sticky bottom-6 bg-white/95 backdrop-blur-sm p-4 rounded-lg border shadow-lg">
          <Button variant="outline" onClick={handlePrevious}>
            <ArrowLeft className="size-4 mr-2" />
            {currentStep === 'mode-selection' ? 'Cancel' : 
             currentStep === 'examination' ? 'Back to Mode Selection' : 
             'Back to Exam'}
          </Button>

          <Button 
            onClick={handleNext}
            disabled={currentStep === 'mode-selection' && !executionMode}
          >
            {currentStep === 'mode-selection' ? (
              <>
                Start Examination <ArrowRight className="size-4 ml-2" />
              </>
            ) : currentStep === 'examination' ? (
              <>
                Review <ArrowRight className="size-4 ml-2" />
              </>
            ) : (
              <>
                <CheckCircle2 className="size-4 mr-2" />
                Complete Exam
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
