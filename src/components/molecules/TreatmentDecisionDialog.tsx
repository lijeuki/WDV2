import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Calendar, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { TreatmentDecision } from '@/lib/types/treatment-workflow';

interface TreatmentDecisionDialogProps {
  open: boolean;
  onClose: () => void;
  onDecision: (decision: TreatmentDecision) => void;
  treatmentPlanSummary: {
    procedureCount: number;
    estimatedCost: number;
    estimatedDuration: number;
    urgentItems: number;
  };
}

export function TreatmentDecisionDialog({
  open,
  onClose,
  onDecision,
  treatmentPlanSummary
}: TreatmentDecisionDialogProps) {
  
  const handleDecision = (decision: TreatmentDecision) => {
    onDecision(decision);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Treatment Decision Point</DialogTitle>
          <DialogDescription>
            The examination is complete and a treatment plan has been created.
            How would you like to proceed?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Treatment Plan Summary */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-3">Treatment Plan Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-blue-700">Procedures</p>
                <p className="text-2xl font-bold text-blue-900">{treatmentPlanSummary.procedureCount}</p>
              </div>
              <div>
                <p className="text-sm text-blue-700">Est. Cost</p>
                <p className="text-2xl font-bold text-blue-900">
                  ${treatmentPlanSummary.estimatedCost.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-blue-700">Est. Time</p>
                <p className="text-2xl font-bold text-blue-900">
                  {treatmentPlanSummary.estimatedDuration} min
                </p>
              </div>
              {treatmentPlanSummary.urgentItems > 0 && (
                <div>
                  <p className="text-sm text-red-700">Urgent Items</p>
                  <p className="text-2xl font-bold text-red-900">{treatmentPlanSummary.urgentItems}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Decision Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Option A: Immediate Treatment */}
            <Card 
              className="p-6 cursor-pointer hover:shadow-lg transition-all hover:border-green-500 border-2"
              onClick={() => handleDecision('immediate')}
            >
              <div className="text-center space-y-4">
                <div className="size-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="size-8 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-green-900">Immediate Treatment</h3>
                <p className="text-sm text-gray-600">
                  Proceed with treatment today (same-day execution)
                </p>
                <div className="space-y-2 text-sm text-left bg-green-50 p-3 rounded">
                  <p className="font-semibold text-green-900">Next Steps:</p>
                  <ul className="text-green-800 space-y-1">
                    <li>✓ Treatment authorization form</li>
                    <li>✓ Anesthesia documentation</li>
                    <li>✓ Real-time procedure notes</li>
                    <li>✓ Post-treatment care</li>
                  </ul>
                </div>
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDecision('immediate');
                  }}
                >
                  Proceed Now
                </Button>
              </div>
            </Card>

            {/* Option B: Schedule for Later */}
            <Card 
              className="p-6 cursor-pointer hover:shadow-lg transition-all hover:border-blue-500 border-2"
              onClick={() => handleDecision('schedule')}
            >
              <div className="text-center space-y-4">
                <div className="size-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="size-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-blue-900">Schedule Treatment</h3>
                <p className="text-sm text-gray-600">
                  Approve plan and schedule for future appointment
                </p>
                <div className="space-y-2 text-sm text-left bg-blue-50 p-3 rounded">
                  <p className="font-semibold text-blue-900">Next Steps:</p>
                  <ul className="text-blue-800 space-y-1">
                    <li>✓ Approve treatment plan</li>
                    <li>✓ Set priority/sequencing</li>
                    <li>✓ Create appointment(s)</li>
                    <li>✓ Patient notification</li>
                  </ul>
                </div>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDecision('schedule');
                  }}
                >
                  Schedule Later
                </Button>
              </div>
            </Card>

            {/* Option C: Defer/Refer */}
            <Card 
              className="p-6 cursor-pointer hover:shadow-lg transition-all hover:border-amber-500 border-2"
              onClick={() => handleDecision('defer')}
            >
              <div className="text-center space-y-4">
                <div className="size-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center">
                  <Clock className="size-8 text-amber-600" />
                </div>
                <h3 className="text-lg font-bold text-amber-900">Defer / Refer</h3>
                <p className="text-sm text-gray-600">
                  Put plan on hold or refer to specialist
                </p>
                <div className="space-y-2 text-sm text-left bg-amber-50 p-3 rounded">
                  <p className="font-semibold text-amber-900">Options:</p>
                  <ul className="text-amber-800 space-y-1">
                    <li>• Patient declined for now</li>
                    <li>• Needs specialist referral</li>
                    <li>• Additional testing needed</li>
                    <li>• Financial/insurance pending</li>
                  </ul>
                </div>
                <Button 
                  variant="outline"
                  className="w-full border-amber-600 text-amber-700 hover:bg-amber-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDecision('defer');
                  }}
                >
                  Defer / Refer
                </Button>
              </div>
            </Card>
          </div>

          {/* Important Note */}
          <Card className="p-4 bg-yellow-50 border-yellow-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="size-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-yellow-900 mb-1">Important</p>
                <p className="text-sm text-yellow-800">
                  Once you select a decision, the workflow will adapt accordingly. For immediate treatment,
                  ensure the patient is available and the operatory is ready. For scheduled treatment,
                  coordinate with front desk for appointment scheduling.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
