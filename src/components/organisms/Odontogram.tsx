import { useState } from 'react';
import { 
  ToothNumber, 
  ToothCondition, 
  OdontogramData, 
  ToothData,
  QUADRANTS,
  CONDITION_COLORS,
  CONDITION_LABELS,
  getToothType
} from '@/lib/types/dental';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface OdontogramProps {
  data: OdontogramData;
  onChange?: (data: OdontogramData) => void;
  readOnly?: boolean;
  highlightedTeeth?: ToothNumber[];
}

export function Odontogram({ 
  data, 
  onChange, 
  readOnly = false,
  highlightedTeeth = []
}: OdontogramProps) {
  const [selectedTooth, setSelectedTooth] = useState<ToothNumber | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<ToothCondition | null>(null);

  const handleToothClick = (toothNumber: ToothNumber) => {
    if (readOnly) return;
    setSelectedTooth(toothNumber);
  };

  const handleConditionSelect = (condition: ToothCondition) => {
    if (readOnly || !selectedTooth) return;
    
    const currentTooth = data.teeth[selectedTooth] || {
      toothNumber: selectedTooth,
      conditions: [],
      requiresTreatment: false
    };

    const updatedConditions = currentTooth.conditions.includes(condition)
      ? currentTooth.conditions.filter(c => c !== condition)
      : [...currentTooth.conditions, condition];

    const updatedTooth: ToothData = {
      ...currentTooth,
      conditions: updatedConditions,
      requiresTreatment: updatedConditions.some(c => c !== 'healthy')
    };

    const updatedData: OdontogramData = {
      ...data,
      teeth: {
        ...data.teeth,
        [selectedTooth]: updatedTooth
      }
    };

    onChange?.(updatedData);
    setSelectedCondition(condition);
  };

  const getToothColor = (toothNumber: ToothNumber): string => {
    const toothData = data.teeth[toothNumber];
    if (!toothData || toothData.conditions.length === 0) return '#f3f4f6';
    
    // Priority: show most severe condition
    const priorityOrder: ToothCondition[] = [
      'abscess', 'fracture', 'to-extract', 'caries', 'root-canal',
      'missing', 'crown', 'bridge', 'implant', 'filled', 'healthy'
    ];
    
    for (const condition of priorityOrder) {
      if (toothData.conditions.includes(condition)) {
        return CONDITION_COLORS[condition];
      }
    }
    
    return CONDITION_COLORS[toothData.conditions[0]];
  };

  return (
    <div className="space-y-6">
      {/* Legend */}
      {!readOnly && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Select Condition</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {Object.entries(CONDITION_LABELS).map(([condition, label]) => (
              <Button
                key={condition}
                variant={selectedCondition === condition ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleConditionSelect(condition as ToothCondition)}
                className="text-xs"
                style={{
                  backgroundColor: selectedCondition === condition 
                    ? CONDITION_COLORS[condition as ToothCondition]
                    : 'transparent',
                  borderColor: CONDITION_COLORS[condition as ToothCondition],
                  color: selectedCondition === condition ? 'white' : 'inherit'
                }}
              >
                {label}
              </Button>
            ))}
          </div>
        </Card>
      )}

      {/* Odontogram Chart */}
      <Card className="p-6">
        <div className="space-y-8">
          {/* Upper Jaw */}
          <div>
            <div className="text-center text-sm text-gray-500 mb-2">Upper Jaw</div>
            <div className="flex justify-center gap-8">
              {/* Upper Right (Quadrant 1) */}
              <div className="flex gap-2">
                {[...QUADRANTS[1]].reverse().map((toothNumber) => (
                  <Tooth
                    key={toothNumber}
                    toothNumber={toothNumber}
                    color={getToothColor(toothNumber)}
                    onClick={() => handleToothClick(toothNumber)}
                    isSelected={selectedTooth === toothNumber}
                    isHighlighted={highlightedTeeth.includes(toothNumber)}
                    conditions={data.teeth[toothNumber as ToothNumber]?.conditions || []}
                    readOnly={readOnly}
                  />
                ))}
              </div>

              {/* Upper Left (Quadrant 2) */}
              <div className="flex gap-2">
                {QUADRANTS[2].map(toothNumber => (
                  <Tooth
                    key={toothNumber}
                    toothNumber={toothNumber}
                    color={getToothColor(toothNumber)}
                    onClick={() => handleToothClick(toothNumber)}
                    isSelected={selectedTooth === toothNumber}
                    isHighlighted={highlightedTeeth.includes(toothNumber)}
                    conditions={data.teeth[toothNumber]?.conditions || []}
                    readOnly={readOnly}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t-2 border-gray-300" />

          {/* Lower Jaw */}
          <div>
            <div className="flex justify-center gap-8">
              {/* Lower Right (Quadrant 4) */}
              <div className="flex gap-2">
                {[...QUADRANTS[4]].reverse().map((toothNumber) => (
                  <Tooth
                    key={toothNumber}
                    toothNumber={toothNumber}
                    color={getToothColor(toothNumber)}
                    onClick={() => handleToothClick(toothNumber)}
                    isSelected={selectedTooth === toothNumber}
                    isHighlighted={highlightedTeeth.includes(toothNumber)}
                    conditions={data.teeth[toothNumber as ToothNumber]?.conditions || []}
                    readOnly={readOnly}
                  />
                ))}
              </div>

              {/* Lower Left (Quadrant 3) */}
              <div className="flex gap-2">
                {QUADRANTS[3].map(toothNumber => (
                  <Tooth
                    key={toothNumber}
                    toothNumber={toothNumber}
                    color={getToothColor(toothNumber)}
                    onClick={() => handleToothClick(toothNumber)}
                    isSelected={selectedTooth === toothNumber}
                    isHighlighted={highlightedTeeth.includes(toothNumber)}
                    conditions={data.teeth[toothNumber]?.conditions || []}
                    readOnly={readOnly}
                  />
                ))}
              </div>
            </div>
            <div className="text-center text-sm text-gray-500 mt-2">Lower Jaw</div>
          </div>
        </div>
      </Card>

      {/* Selected Tooth Details */}
      {selectedTooth && (
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Tooth #{selectedTooth}</h3>
          <div className="space-y-2">
            <div className="text-sm text-gray-600">
              Type: {getToothType(selectedTooth)}
            </div>
            {data.teeth[selectedTooth]?.conditions && data.teeth[selectedTooth].conditions.length > 0 && (
              <div>
                <div className="text-sm font-medium mb-1">Conditions:</div>
                <div className="flex flex-wrap gap-2">
                  {data.teeth[selectedTooth].conditions.map(condition => (
                    <Badge 
                      key={condition}
                      style={{ backgroundColor: CONDITION_COLORS[condition] }}
                    >
                      {CONDITION_LABELS[condition]}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {data.teeth[selectedTooth]?.notes && (
              <div className="text-sm">
                <div className="font-medium">Notes:</div>
                <div className="text-gray-600">{data.teeth[selectedTooth].notes}</div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

interface ToothProps {
  toothNumber: ToothNumber;
  color: string;
  onClick: () => void;
  isSelected: boolean;
  isHighlighted: boolean;
  conditions: ToothCondition[];
  readOnly: boolean;
}

function Tooth({ 
  toothNumber, 
  color, 
  onClick, 
  isSelected, 
  isHighlighted,
  conditions,
  readOnly 
}: ToothProps) {
  const toothType = getToothType(toothNumber);
  
  // Different sizes for different tooth types
  const sizeClass = toothType === 'molar' ? 'w-10 h-14' 
    : toothType === 'premolar' ? 'w-9 h-12' 
    : toothType === 'canine' ? 'w-8 h-14'
    : 'w-7 h-12'; // incisor

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="text-xs font-mono text-gray-500">{toothNumber}</div>
      <button
        onClick={onClick}
        disabled={readOnly}
        className={`
          ${sizeClass} rounded-lg transition-all
          ${isSelected ? 'ring-4 ring-blue-500 scale-110' : ''}
          ${isHighlighted ? 'ring-2 ring-yellow-400' : ''}
          ${!readOnly ? 'hover:scale-105 cursor-pointer' : 'cursor-default'}
          ${conditions.includes('missing') ? 'opacity-30' : ''}
          shadow-md
        `}
        style={{ 
          backgroundColor: color,
          transform: isSelected ? 'scale(1.1)' : undefined
        }}
        title={conditions.map(c => CONDITION_LABELS[c]).join(', ')}
      />
      {conditions.length > 1 && (
        <div className="text-xs font-bold text-gray-700">
          {conditions.length}
        </div>
      )}
    </div>
  );
}

export default Odontogram;
