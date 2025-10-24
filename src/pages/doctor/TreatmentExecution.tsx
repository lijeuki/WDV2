import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AnesthesiaDocumentationPanel } from '@/components/molecules/AnesthesiaDocumentationPanel';
import { ProceduralExecutionPanel } from '@/components/molecules/ProceduralExecutionPanel';
import { PostTreatmentDocumentationForm } from '@/components/molecules/PostTreatmentDocumentation';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  FileText,
  Syringe,
  Activity,
  ClipboardCheck
} from 'lucide-react';
import { ProcedureWithPrescription } from '@/components/molecules/ProcedureWithPrescriptionDialog';
import { AnesthesiaRecord, ProceduralNotes, PostTreatmentDocumentation as PostTreatmentDoc } from '@/lib/types/treatment-workflow';

interface TreatmentExecutionState {
  patientId: string;
  procedures: ProcedureWithPrescription[];
  examData?: any;
}

export function TreatmentExecution() {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const location = useLocation();
  const state = location.state as TreatmentExecutionState;

  // Execution steps
  const [currentStep, setCurrentStep] = useState<'authorization' | 'anesthesia' | 'procedure' | 'post-treatment'>('authorization');
  const [currentProcedureIndex, setCurrentProcedureIndex] = useState(0);

  // Treatment data
  const [anesthesiaRecords, setAnesthesiaRecords] = useState<Record<number, AnesthesiaRecord>>({});
  const [proceduralNotes, setProceduralNotes] = useState<Record<number, ProceduralNotes>>({});
  const [postTreatmentDocs, setPostTreatmentDocs] = useState<Record<number, PostTreatmentDoc>>({});
  
  // Authorization
  const [patientConsent, setPatientConsent] = useState(false);
  const [riskAcknowledged, setRiskAcknowledged] = useState(false);

  const procedures = state?.procedures || [];
  const currentProcedure = procedures[currentProcedureIndex];

  useEffect(() => {
    if (!state || !state.procedures || state.procedures.length === 0) {
      alert('No procedures found. Returning to exam.');
      navigate(-1);
    }
  }, [state, navigate]);

  const handleAuthorization = () => {
    if (!patientConsent || !riskAcknowledged) {
      alert('Patient must provide consent and acknowledge risks before proceeding.');
      return;
    }
    setCurrentStep('anesthesia');
  };

  const handleAnesthesiaComplete = (record: AnesthesiaRecord) => {
    setAnesthesiaRecords({
      ...anesthesiaRecords,
      [currentProcedureIndex]: record
    });
    setCurrentStep('procedure');
  };

  const handleProcedureComplete = (notes: ProceduralNotes) => {
    setProceduralNotes({
      ...proceduralNotes,
      [currentProcedureIndex]: notes
    });
    setCurrentStep('post-treatment');
  };

  const handlePostTreatmentComplete = (doc: PostTreatmentDoc) => {
    setPostTreatmentDocs({
      ...postTreatmentDocs,
      [currentProcedureIndex]: doc
    });

    // Check if there are more procedures
    if (currentProcedureIndex < procedures.length - 1) {
      // Move to next procedure
      setCurrentProcedureIndex(currentProcedureIndex + 1);
      setCurrentStep('anesthesia'); // Start next procedure with anesthesia
      alert(`Procedure ${currentProcedureIndex + 1} completed! Moving to next procedure...`);
    } else {
      // All procedures complete
      handleCompleteAllTreatments();
    }
  };

  const handleCompleteAllTreatments = () => {
    const completionSummary = {
      patientId,
      procedures: procedures.map((proc, idx) => ({
        procedure: proc,
        anesthesia: anesthesiaRecords[idx],
        procedural: proceduralNotes[idx],
        postTreatment: postTreatmentDocs[idx]
      })),
      completedAt: new Date().toISOString(),
      status: 'completed'
    };

    console.log('Treatment Execution Complete:', completionSummary);

    // TODO: Save to database

    alert(
      `✅ All Treatments Completed!\n\n` +
      `${procedures.length} procedure(s) executed successfully.\n` +
      `Patient ready for checkout.\n\n` +
      `Documentation:\n` +
      `- Anesthesia records: ${Object.keys(anesthesiaRecords).length}\n` +
      `- Procedural notes: ${Object.keys(proceduralNotes).length}\n` +
      `- Post-treatment instructions: ${Object.keys(postTreatmentDocs).length}`
    );

    // Navigate to checkout or back to dashboard
    navigate('/doctor/patients');
  };

  const getStepIcon = (step: string) => {
    switch (step) {
      case 'authorization': return <FileText className="size-5" />;
      case 'anesthesia': return <Syringe className="size-5" />;
      case 'procedure': return <Activity className="size-5" />;
      case 'post-treatment': return <ClipboardCheck className="size-5" />;
      default: return <Clock className="size-5" />;
    }
  };

  const getStepStatus = (step: string) => {
    const stepOrder = ['authorization', 'anesthesia', 'procedure', 'post-treatment'];
    const currentStepIndex = stepOrder.indexOf(currentStep);
    const checkStepIndex = stepOrder.indexOf(step);

    if (checkStepIndex < currentStepIndex) return 'completed';
    if (checkStepIndex === currentStepIndex) return 'active';
    return 'pending';
  };

  if (!state || !procedures.length) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                <ArrowLeft className="size-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Immediate Treatment Execution</h1>
                <p className="text-sm text-gray-600">Patient ID: {patientId}</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
              Procedure {currentProcedureIndex + 1} of {procedures.length}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Progress Steps */}
          <div className="lg:col-span-1">
            <Card className="p-4 sticky top-24">
              <h3 className="font-semibold mb-4">Treatment Steps</h3>
              <div className="space-y-3">
                {['authorization', 'anesthesia', 'procedure', 'post-treatment'].map((step, idx) => {
                  const status = getStepStatus(step);
                  return (
                    <div
                      key={step}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        status === 'completed' ? 'bg-green-50 border border-green-200' :
                        status === 'active' ? 'bg-blue-50 border-2 border-blue-500' :
                        'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <div className={`flex items-center justify-center size-8 rounded-full ${
                        status === 'completed' ? 'bg-green-500 text-white' :
                        status === 'active' ? 'bg-blue-500 text-white' :
                        'bg-gray-300 text-gray-600'
                      }`}>
                        {status === 'completed' ? <CheckCircle2 className="size-4" /> : getStepIcon(step)}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${
                          status === 'completed' ? 'text-green-900' :
                          status === 'active' ? 'text-blue-900' :
                          'text-gray-600'
                        }`}>
                          {step === 'authorization' ? 'Authorization' :
                           step === 'anesthesia' ? 'Anesthesia' :
                           step === 'procedure' ? 'Execution' :
                           'Post-Treatment'}
                        </p>
                        <p className="text-xs text-gray-500">Step {idx + 1}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Current Procedure Info */}
              <div className="mt-6 pt-4 border-t">
                <h4 className="text-sm font-semibold mb-2">Current Procedure</h4>
                <div className="text-sm space-y-1">
                  <p className="font-medium">{currentProcedure?.procedureName}</p>
                  {currentProcedure?.toothNumber && (
                    <p className="text-gray-600">Tooth #{currentProcedure.toothNumber}</p>
                  )}
                  <p className="text-gray-600">Duration: {currentProcedure?.duration}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {currentStep === 'authorization' && (
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="size-8 text-blue-600" />
                  <div>
                    <h2 className="text-xl font-bold">Treatment Authorization</h2>
                    <p className="text-sm text-gray-600">Obtain patient consent before proceeding</p>
                  </div>
                </div>

                <Alert className="mb-6">
                  <AlertTriangle className="size-4" />
                  <AlertDescription>
                    The following procedure(s) will be performed immediately. Ensure patient understanding and consent.
                  </AlertDescription>
                </Alert>

                {/* Procedures List */}
                <div className="space-y-3 mb-6">
                  {procedures.map((proc, idx) => (
                    <div key={proc.id} className="p-4 bg-gray-50 rounded-lg border">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline">{idx + 1}</Badge>
                            <h3 className="font-semibold">{proc.procedureName}</h3>
                          </div>
                          {proc.toothNumber && (
                            <p className="text-sm text-gray-600">Tooth #{proc.toothNumber}</p>
                          )}
                          <p className="text-sm text-gray-600">{proc.duration}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-700">
                            ${proc.estimatedCost.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Consent Checkboxes */}
                <div className="space-y-4 mb-6">
                  <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={patientConsent}
                      onChange={(e) => setPatientConsent(e.target.checked)}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium">Patient Consent</p>
                      <p className="text-sm text-gray-600">
                        I consent to the above treatment(s) and understand the procedures that will be performed.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={riskAcknowledged}
                      onChange={(e) => setRiskAcknowledged(e.target.checked)}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium">Risk Acknowledgment</p>
                      <p className="text-sm text-gray-600">
                        I acknowledge that I have been informed of the risks, benefits, and alternatives to this treatment.
                      </p>
                    </div>
                  </label>
                </div>

                <Button
                  onClick={handleAuthorization}
                  disabled={!patientConsent || !riskAcknowledged}
                  className="w-full"
                  size="lg"
                >
                  Proceed to Anesthesia
                </Button>
              </Card>
            )}

            {currentStep === 'anesthesia' && (
              <AnesthesiaDocumentationPanel
                patientName="Current Patient"
                onComplete={handleAnesthesiaComplete}
                onCancel={() => navigate(-1)}
              />
            )}

            {currentStep === 'procedure' && (
              <ProceduralExecutionPanel
                treatmentName={currentProcedure?.procedureName || "Treatment"}
                onComplete={handleProcedureComplete}
                onCancel={() => setCurrentStep('anesthesia')}
              />
            )}

            {currentStep === 'post-treatment' && (
              <PostTreatmentDocumentationForm
                treatmentName={currentProcedure?.procedureName || "Treatment"}
                onComplete={handlePostTreatmentComplete}
                onCancel={() => setCurrentStep('procedure')}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
