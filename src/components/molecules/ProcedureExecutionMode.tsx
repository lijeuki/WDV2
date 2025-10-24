import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { AlertCircle, ClipboardList, Stethoscope, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";

export interface PendingProcedure {
  id: string;
  toothNumber: string;
  procedureName: string;
  recommendedDate: string;
  reason: string;
  estimatedCost: number;
  duration: string;
  surfaces?: string[];
}

interface ProcedureExecutionModeProps {
  pendingProcedures: PendingProcedure[];
  selectedMode: 'execute-pending' | 'select-new' | null;
  onModeSelect: (mode: 'execute-pending' | 'select-new') => void;
  onProcedureToggle?: (procedureId: string, selected: boolean) => void;
  selectedProcedures?: string[];
}

export function ProcedureExecutionMode({
  pendingProcedures,
  selectedMode,
  onModeSelect,
  onProcedureToggle,
  selectedProcedures = []
}: ProcedureExecutionModeProps) {
  const hasPending = pendingProcedures.length > 0;

  return (
    <div className="space-y-4">
      {/* Mode Selection */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Select Examination Mode</h3>
        
        <RadioGroup 
          value={selectedMode || ''} 
          onValueChange={(value) => onModeSelect(value as 'execute-pending' | 'select-new')}
          className="space-y-4"
        >
          {/* Execute Pending Procedures */}
          {hasPending && (
            <div className="flex items-start space-x-3">
              <RadioGroupItem value="execute-pending" id="execute-pending" className="mt-1" />
              <Label 
                htmlFor="execute-pending" 
                className="flex-1 cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className={`size-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    selectedMode === 'execute-pending' ? 'bg-amber-100' : 'bg-amber-50'
                  }`}>
                    <AlertCircle className={`size-6 ${
                      selectedMode === 'execute-pending' ? 'text-amber-600' : 'text-amber-500'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-base mb-1">
                      Execute Pending Procedures
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Complete procedures that were deferred from previous visits
                    </p>
                    <Badge variant="outline" className="mt-2 bg-amber-50 text-amber-700 border-amber-200">
                      {pendingProcedures.length} pending procedure{pendingProcedures.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                </div>
              </Label>
            </div>
          )}

          {/* New Examination */}
          <div className="flex items-start space-x-3">
            <RadioGroupItem value="select-new" id="select-new" className="mt-1" />
            <Label 
              htmlFor="select-new" 
              className="flex-1 cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className={`size-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  selectedMode === 'select-new' ? 'bg-blue-100' : 'bg-blue-50'
                }`}>
                  <Stethoscope className={`size-6 ${
                    selectedMode === 'select-new' ? 'text-blue-600' : 'text-blue-500'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-base mb-1">
                    New Clinical Examination
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Perform new examination and select procedures based on findings
                  </p>
                </div>
              </div>
            </Label>
          </div>
        </RadioGroup>

        {!hasPending && (
          <Alert className="mt-4 border-blue-200 bg-blue-50">
            <AlertCircle className="size-4 text-blue-600" />
            <AlertDescription className="text-blue-900 text-sm">
              No pending procedures found. Proceeding with new clinical examination.
            </AlertDescription>
          </Alert>
        )}
      </Card>

      {/* Pending Procedures List - Show when Execute Pending is selected */}
      {selectedMode === 'execute-pending' && hasPending && (
        <Card className="p-6 bg-amber-50 border-amber-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-amber-900">
              Select Procedures to Execute
            </h3>
            <Badge variant="outline" className="bg-white">
              {selectedProcedures.length} of {pendingProcedures.length} selected
            </Badge>
          </div>

          <div className="space-y-3">
            {pendingProcedures.map((procedure) => {
              const isSelected = selectedProcedures.includes(procedure.id);
              
              return (
                <div
                  key={procedure.id}
                  className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-white border-amber-500 shadow-md' 
                      : 'bg-white/50 border-amber-200 hover:border-amber-300'
                  }`}
                  onClick={() => onProcedureToggle?.(procedure.id, !isSelected)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex items-center h-6">
                      <div className={`size-5 rounded border-2 flex items-center justify-center ${
                        isSelected 
                          ? 'bg-amber-500 border-amber-500' 
                          : 'bg-white border-gray-300'
                      }`}>
                        {isSelected && (
                          <CheckCircle2 className="size-4 text-white" />
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          Tooth #{procedure.toothNumber}
                        </Badge>
                        <span className="font-medium text-amber-900">
                          {procedure.procedureName}
                        </span>
                      </div>
                      
                      {procedure.surfaces && procedure.surfaces.length > 0 && (
                        <p className="text-xs text-amber-700 mb-1">
                          Surfaces: {procedure.surfaces.join(', ')}
                        </p>
                      )}
                      
                      <p className="text-sm text-amber-700 mb-2">
                        Reason: {procedure.reason}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-amber-600">
                        <span>⏱ {procedure.duration}</span>
                        <span>•</span>
                        <span className="font-medium">
                          Rp {new Intl.NumberFormat('id-ID').format(procedure.estimatedCost)}
                        </span>
                        <span>•</span>
                        <span>Recommended: {procedure.recommendedDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Alert className="mt-4 border-amber-300 bg-amber-100">
            <AlertCircle className="size-4 text-amber-700" />
            <AlertDescription className="text-amber-900 text-sm">
              <strong>Note:</strong> You can select specific procedures to execute today. 
              Unselected procedures will remain in the pending list.
            </AlertDescription>
          </Alert>
        </Card>
      )}

      {/* New Examination Info */}
      {selectedMode === 'select-new' && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <ClipboardList className="size-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-1">
                Clinical Examination Workflow
              </h3>
              <p className="text-sm text-blue-700">
                You will be able to:
              </p>
              <ul className="text-sm text-blue-700 mt-2 space-y-1 ml-4">
                <li>• Chart dental findings using the interactive odontogram</li>
                <li>• Select surfaces affected by conditions</li>
                <li>• Choose specific procedures to perform</li>
                <li>• Create SOAP notes for documentation</li>
              </ul>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
