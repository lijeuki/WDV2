import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Play, Pause, StopCircle, Clock, AlertTriangle, CheckCircle2, Package } from 'lucide-react';
import { ProceduralNotes } from '@/lib/types/treatment-workflow';

interface ProceduralExecutionPanelProps {
  treatmentName: string;
  toothNumber?: string;
  onComplete: (data: ProceduralNotes) => void;
  onCancel: () => void;
}

export function ProceduralExecutionPanel({
  treatmentName,
  toothNumber,
  onComplete,
  onCancel
}: ProceduralExecutionPanelProps) {
  const [isInProgress, setIsInProgress] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  
  const [formData, setFormData] = useState<Partial<ProceduralNotes>>({
    treatmentItemId: 'TEMP001',
    materialsUsed: [],
    toothSurfacesTreated: [],
    stepByStepNotes: '',
    complications: [],
    documentedBy: 'Current Doctor'
  });

  const [newMaterial, setNewMaterial] = useState({ material: '', shade: '', batchNumber: '' });
  const [complicationText, setComplicationText] = useState('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isInProgress && startTime) {
      interval = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - startTime.getTime()) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isInProgress, startTime]);

  const handleStart = () => {
    const now = new Date();
    setStartTime(now);
    setIsInProgress(true);
    setFormData({ ...formData, startTime: now });
  };

  const handlePause = () => {
    setIsInProgress(false);
  };

  const handleComplete = () => {
    const endTime = new Date();
    const duration = startTime ? Math.floor((endTime.getTime() - startTime.getTime()) / 60000) : 0;
    
    const completeData: ProceduralNotes = {
      ...formData as ProceduralNotes,
      endTime,
      actualDurationMinutes: duration
    };

    onComplete(completeData);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const addMaterial = () => {
    if (newMaterial.material) {
      setFormData({
        ...formData,
        materialsUsed: [...(formData.materialsUsed || []), { ...newMaterial }]
      });
      setNewMaterial({ material: '', shade: '', batchNumber: '' });
    }
  };

  const addComplication = () => {
    if (complicationText) {
      setFormData({
        ...formData,
        complications: [
          ...(formData.complications || []),
          { type: 'Other', details: complicationText, actionTaken: '' }
        ]
      });
      setComplicationText('');
    }
  };

  const toothSurfaces = ['Occlusal', 'Mesial', 'Distal', 'Buccal', 'Lingual'];

  return (
    <div className="space-y-6">
      {/* Header with Timer */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-blue-900">Treatment in Progress</h2>
            <p className="text-blue-700">
              {treatmentName}
              {toothNumber && <Badge className="ml-2 bg-blue-600">Tooth #{toothNumber}</Badge>}
            </p>
          </div>
          
          <div className="text-right">
            <div className="text-4xl font-mono font-bold text-blue-900 mb-2">
              {formatTime(elapsedSeconds)}
            </div>
            <div className="flex gap-2">
              {!isInProgress && !startTime && (
                <Button onClick={handleStart} className="bg-green-600 hover:bg-green-700">
                  <Play className="size-4 mr-2" />
                  Start Treatment
                </Button>
              )}
              {isInProgress && (
                <Button onClick={handlePause} variant="outline">
                  <Pause className="size-4 mr-2" />
                  Pause
                </Button>
              )}
              {startTime && !isInProgress && (
                <Button onClick={() => setIsInProgress(true)} className="bg-green-600">
                  <Play className="size-4 mr-2" />
                  Resume
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {startTime && (
        <>
          {/* Tooth Surfaces Treated */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Tooth Surfaces Treated</h3>
            <div className="flex gap-2 flex-wrap">
              {toothSurfaces.map((surface) => (
                <button
                  key={surface}
                  onClick={() => {
                    const surfaces = formData.toothSurfacesTreated || [];
                    setFormData({
                      ...formData,
                      toothSurfacesTreated: surfaces.includes(surface)
                        ? surfaces.filter(s => s !== surface)
                        : [...surfaces, surface]
                    });
                  }}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    formData.toothSurfacesTreated?.includes(surface)
                      ? 'border-blue-500 bg-blue-50 text-blue-900 font-semibold'
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                >
                  {surface}
                </button>
              ))}
            </div>
          </Card>

          {/* Materials Used */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="size-5 text-purple-600" />
              <h3 className="font-semibold text-lg">Materials Used</h3>
            </div>
            
            <div className="space-y-4">
              {formData.materialsUsed && formData.materialsUsed.length > 0 && (
                <div className="space-y-2">
                  {formData.materialsUsed.map((material, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-purple-50 p-3 rounded-lg">
                      <div>
                        <span className="font-semibold">{material.material}</span>
                        {material.shade && <span className="text-gray-600 ml-2">Shade: {material.shade}</span>}
                        {material.batchNumber && <span className="text-gray-500 ml-2 text-sm">Batch: {material.batchNumber}</span>}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            materialsUsed: formData.materialsUsed?.filter((_, i) => i !== idx)
                          });
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-4 gap-2">
                <Input
                  placeholder="Material name"
                  value={newMaterial.material}
                  onChange={(e) => setNewMaterial({ ...newMaterial, material: e.target.value })}
                />
                <Input
                  placeholder="Shade (optional)"
                  value={newMaterial.shade}
                  onChange={(e) => setNewMaterial({ ...newMaterial, shade: e.target.value })}
                />
                <Input
                  placeholder="Batch # (optional)"
                  value={newMaterial.batchNumber}
                  onChange={(e) => setNewMaterial({ ...newMaterial, batchNumber: e.target.value })}
                />
                <Button onClick={addMaterial} variant="outline">
                  Add Material
                </Button>
              </div>
            </div>
          </Card>

          {/* Step-by-Step Notes */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Step-by-Step Procedural Notes *</h3>
            <Textarea
              value={formData.stepByStepNotes}
              onChange={(e) => setFormData({ ...formData, stepByStepNotes: e.target.value })}
              placeholder="Document each step as you perform the procedure...&#10;&#10;Example:&#10;1. Removed old temporary restoration&#10;2. Prepared cavity using high-speed handpiece&#10;3. Applied etching gel for 15 seconds&#10;4. Placed composite in 3 layers&#10;5. Light cured each layer for 20 seconds&#10;6. Polished final restoration"
              rows={8}
              className="font-mono text-sm"
            />
          </Card>

          {/* Deviations from Plan */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Deviations from Original Plan</h3>
            <Textarea
              value={formData.deviationFromPlan}
              onChange={(e) => setFormData({ ...formData, deviationFromPlan: e.target.value })}
              placeholder="Note any deviations from the original treatment plan (if any)...&#10;Example: Cavity extended mesially; required larger filling than anticipated"
              rows={3}
            />
          </Card>

          {/* Complications */}
          <Card className="p-6 border-amber-200 bg-amber-50">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="size-5 text-amber-600" />
              <h3 className="font-semibold text-lg">Complications Encountered</h3>
            </div>
            
            {formData.complications && formData.complications.length > 0 && (
              <div className="space-y-2 mb-4">
                {formData.complications.map((comp, idx) => (
                  <Alert key={idx} className="bg-amber-100 border-amber-300">
                    <AlertDescription className="text-amber-900">
                      {comp.details}
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <Input
                placeholder="Describe any complications..."
                value={complicationText}
                onChange={(e) => setComplicationText(e.target.value)}
              />
              <Button onClick={addComplication} variant="outline">
                Add Complication
              </Button>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={onCancel}>
              Cancel Treatment
            </Button>
            <Button
              onClick={handleComplete}
              disabled={!formData.stepByStepNotes}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle2 className="size-4 mr-2" />
              Complete Treatment
            </Button>
          </div>
        </>
      )}

      {!startTime && (
        <Alert>
          <Clock className="size-4" />
          <AlertDescription>
            Click "Start Treatment" to begin the timer and start documenting the procedure.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
