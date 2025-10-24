import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { CheckCircle2, FileText } from 'lucide-react';
import { PostTreatmentDocumentation as PostTreatmentData } from '@/lib/types/treatment-workflow';

interface PostTreatmentDocumentationProps {
  treatmentName: string;
  onComplete: (data: PostTreatmentData) => void;
  onCancel: () => void;
}

export function PostTreatmentDocumentationForm({
  treatmentName,
  onComplete,
  onCancel
}: PostTreatmentDocumentationProps) {
  const [formData, setFormData] = useState<Partial<PostTreatmentData>>({
    completionStatus: 'completed_successfully',
    postOpInstructions: '',
    painManagementPlan: '',
    followUpNeeded: 'none',
    followUpScheduled: false,
    patientAcknowledgment: false
  });

  const handleSubmit = () => {
    const completeData: PostTreatmentData = {
      ...formData as PostTreatmentData,
      patientSignatureDate: formData.patientAcknowledgment ? new Date() : undefined
    };
    onComplete(completeData);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-green-50">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="size-8 text-green-600" />
          <div>
            <h2 className="text-2xl font-bold">Post-Treatment Documentation</h2>
            <p>{treatmentName}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Post-Op Instructions *</h3>
        <Textarea
          value={formData.postOpInstructions}
          onChange={(e) => setFormData({ ...formData, postOpInstructions: e.target.value })}
          rows={6}
        />
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Pain Management *</h3>
        <Textarea
          value={formData.painManagementPlan}
          onChange={(e) => setFormData({ ...formData, painManagementPlan: e.target.value })}
          rows={4}
        />
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={formData.patientAcknowledgment}
            onCheckedChange={(checked) => setFormData({ ...formData, patientAcknowledgment: !!checked })}
          />
          <Label>Patient acknowledges instructions</Label>
        </div>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>Back</Button>
        <Button onClick={handleSubmit} disabled={!formData.patientAcknowledgment}>Complete</Button>
      </div>
    </div>
  );
}
