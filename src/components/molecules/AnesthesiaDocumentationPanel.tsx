import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Alert, AlertDescription } from '../ui/alert';
import { Checkbox } from '../ui/checkbox';
import { Syringe, AlertCircle, Heart, Activity } from 'lucide-react';
import { AnesthesiaRecord } from '@/lib/types/treatment-workflow';

interface AnesthesiaDocumentationPanelProps {
  onComplete: (data: AnesthesiaRecord) => void;
  onCancel: () => void;
  patientName: string;
}

export function AnesthesiaDocumentationPanel({
  onComplete,
  onCancel,
  patientName
}: AnesthesiaDocumentationPanelProps) {
  const [formData, setFormData] = useState<Partial<AnesthesiaRecord>>({
    type: 'local',
    agentName: '2% Lidocaine with 1:100,000 Epinephrine',
    concentration: '2%',
    injectionSites: [],
    numberOfInjections: 1,
    onsetTimeMinutes: 5,
    vitalsBeforeAnesthesia: {
      bloodPressure: '',
      heartRate: 0,
      oxygenSaturation: 0
    },
    vitalsAfterAnesthesia: {
      bloodPressure: '',
      heartRate: 0,
      oxygenSaturation: 0
    },
    complications: []
  });

  const anesthesiaTypes = [
    { value: 'local', label: 'Local Anesthesia', icon: '💉' },
    { value: 'topical', label: 'Topical', icon: '🧴' },
    { value: 'nitrous_oxide', label: 'Nitrous Oxide', icon: '😌' },
    { value: 'iv_sedation', label: 'IV Sedation', icon: '💤' },
    { value: 'general', label: 'General Anesthesia', icon: '🏥' }
  ];

  const localAnestheticAgents = [
    '2% Lidocaine with 1:100,000 Epinephrine',
    '2% Lidocaine with 1:50,000 Epinephrine',
    '3% Mepivacaine (Carbocaine)',
    '4% Articaine with 1:100,000 Epinephrine',
    '0.5% Bupivacaine with 1:200,000 Epinephrine',
    '2% Lidocaine Plain (no vasoconstrictor)'
  ];

  const injectionSiteOptions = ['buccal', 'lingual', 'palatal', 'infiltration', 'block'];

  const handleSubmit = () => {
    const now = new Date();
    const completeData: AnesthesiaRecord = {
      ...formData as AnesthesiaRecord,
      injectionTime: now.toISOString(),
      documentedBy: 'Current Doctor', // Will be replaced with actual user
      documentedAt: now
    };

    onComplete(completeData);
  };

  const isFormValid = () => {
    return formData.type &&
           formData.agentName &&
           formData.totalDoseMg &&
           formData.vitalsBeforeAnesthesia?.bloodPressure &&
           formData.vitalsBeforeAnesthesia?.heartRate &&
           formData.vitalsBeforeAnesthesia?.oxygenSaturation;
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-purple-50 border-purple-200">
        <div className="flex items-center gap-3 mb-4">
          <Syringe className="size-6 text-purple-600" />
          <div>
            <h2 className="text-xl font-bold text-purple-900">Anesthesia Documentation</h2>
            <p className="text-sm text-purple-700">Patient: {patientName}</p>
          </div>
        </div>

        <Alert className="bg-purple-100 border-purple-300">
          <AlertCircle className="size-4 text-purple-600" />
          <AlertDescription className="text-purple-800">
            Complete anesthesia documentation before proceeding with treatment. All fields marked with * are required.
          </AlertDescription>
        </Alert>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Anesthesia Type *</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {anesthesiaTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setFormData({ ...formData, type: type.value as any })}
              className={`p-4 rounded-lg border-2 transition-all ${
                formData.type === type.value
                  ? 'border-purple-500 bg-purple-50 shadow-md'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              <div className="text-2xl mb-2">{type.icon}</div>
              <div className="text-sm font-medium">{type.label}</div>
            </button>
          ))}
        </div>

        {formData.type === 'local' && (
          <>
            <div className="space-y-4 mb-6">
              <div>
                <Label>Anesthetic Agent *</Label>
                <select
                  value={formData.agentName}
                  onChange={(e) => setFormData({ ...formData, agentName: e.target.value })}
                  className="w-full mt-1 p-2 border rounded-lg"
                >
                  {localAnestheticAgents.map((agent) => (
                    <option key={agent} value={agent}>{agent}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Total Dose (mg) *</Label>
                  <Input
                    type="number"
                    value={formData.totalDoseMg || ''}
                    onChange={(e) => setFormData({ ...formData, totalDoseMg: Number(e.target.value) })}
                    placeholder="36"
                  />
                </div>
                <div>
                  <Label>Concentration *</Label>
                  <Input
                    value={formData.concentration}
                    onChange={(e) => setFormData({ ...formData, concentration: e.target.value })}
                    placeholder="2%"
                  />
                </div>
              </div>

              <div>
                <Label>Injection Site(s)</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {injectionSiteOptions.map((site) => (
                    <div key={site} className="flex items-center gap-2">
                      <Checkbox
                        checked={formData.injectionSites?.includes(site as any)}
                        onCheckedChange={(checked) => {
                          const sites = formData.injectionSites || [];
                          setFormData({
                            ...formData,
                            injectionSites: checked
                              ? [...sites, site as any]
                              : sites.filter(s => s !== site)
                          });
                        }}
                      />
                      <Label className="capitalize">{site}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Number of Injections</Label>
                  <Input
                    type="number"
                    value={formData.numberOfInjections || 1}
                    onChange={(e) => setFormData({ ...formData, numberOfInjections: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>Expected Onset Time (minutes)</Label>
                  <Input
                    type="number"
                    value={formData.onsetTimeMinutes || 5}
                    onChange={(e) => setFormData({ ...formData, onsetTimeMinutes: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </Card>

      {/* Vitals Before Anesthesia */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="size-5 text-red-600" />
          <h3 className="font-semibold text-lg">Vitals Before Anesthesia *</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Blood Pressure *</Label>
            <Input
              placeholder="120/80"
              value={formData.vitalsBeforeAnesthesia?.bloodPressure}
              onChange={(e) => setFormData({
                ...formData,
                vitalsBeforeAnesthesia: {
                  ...formData.vitalsBeforeAnesthesia!,
                  bloodPressure: e.target.value
                }
              })}
            />
          </div>
          <div>
            <Label>Heart Rate (bpm) *</Label>
            <Input
              type="number"
              placeholder="72"
              value={formData.vitalsBeforeAnesthesia?.heartRate || ''}
              onChange={(e) => setFormData({
                ...formData,
                vitalsBeforeAnesthesia: {
                  ...formData.vitalsBeforeAnesthesia!,
                  heartRate: Number(e.target.value)
                }
              })}
            />
          </div>
          <div>
            <Label>O2 Saturation (%) *</Label>
            <Input
              type="number"
              placeholder="98"
              value={formData.vitalsBeforeAnesthesia?.oxygenSaturation || ''}
              onChange={(e) => setFormData({
                ...formData,
                vitalsBeforeAnesthesia: {
                  ...formData.vitalsBeforeAnesthesia!,
                  oxygenSaturation: Number(e.target.value)
                }
              })}
            />
          </div>
        </div>
      </Card>

      {/* Vitals After Anesthesia */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="size-5 text-green-600" />
          <h3 className="font-semibold text-lg">Vitals After Anesthesia</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Blood Pressure</Label>
            <Input
              placeholder="118/78"
              value={formData.vitalsAfterAnesthesia?.bloodPressure}
              onChange={(e) => setFormData({
                ...formData,
                vitalsAfterAnesthesia: {
                  ...formData.vitalsAfterAnesthesia!,
                  bloodPressure: e.target.value
                }
              })}
            />
          </div>
          <div>
            <Label>Heart Rate (bpm)</Label>
            <Input
              type="number"
              placeholder="70"
              value={formData.vitalsAfterAnesthesia?.heartRate || ''}
              onChange={(e) => setFormData({
                ...formData,
                vitalsAfterAnesthesia: {
                  ...formData.vitalsAfterAnesthesia!,
                  heartRate: Number(e.target.value)
                }
              })}
            />
          </div>
          <div>
            <Label>O2 Saturation (%)</Label>
            <Input
              type="number"
              placeholder="98"
              value={formData.vitalsAfterAnesthesia?.oxygenSaturation || ''}
              onChange={(e) => setFormData({
                ...formData,
                vitalsAfterAnesthesia: {
                  ...formData.vitalsAfterAnesthesia!,
                  oxygenSaturation: Number(e.target.value)
                }
              })}
            />
          </div>
        </div>
      </Card>

      {/* Additional Notes */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Additional Notes</h3>
        <div className="space-y-4">
          <div>
            <Label>Patient Tolerance</Label>
            <Textarea
              value={formData.patientTolerance}
              onChange={(e) => setFormData({ ...formData, patientTolerance: e.target.value })}
              placeholder="Patient tolerated anesthesia well, minimal discomfort..."
              rows={2}
            />
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!isFormValid()}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Complete Anesthesia Documentation
        </Button>
      </div>
    </div>
  );
}
