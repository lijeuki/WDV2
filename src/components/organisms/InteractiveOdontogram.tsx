import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Label } from "../ui/label";
import { X, History, Download } from "lucide-react";
import {
  DentitionType,
  ToothSurface,
  ToothData,
  ToothCondition,
  DentalSymbol,
  ADULT_TEETH,
  PEDIATRIC_TEETH,
  DENTAL_SYMBOLS
} from "../../lib/odontogram-types";

interface InteractiveOdontogramProps {
  patientId?: string;
  initialData?: Record<string, ToothData>;
  dentitionType?: DentitionType;
  readOnly?: boolean;
  selectedSymbol?: DentalSymbol | null;
  onDataChange?: (data: Record<string, ToothData>) => void;
  onSnapshot?: () => void;
}

// Tooth component matching the visual style from the image - border-only design with 5 sections
function InteractiveTooth({ 
  toothNumber,
  data,
  onSurfaceClick,
  onClick,
  readOnly = false,
  showNumberAbove = true
}: { 
  toothNumber: string;
  data?: ToothData;
  onSurfaceClick: (surface: ToothSurface) => void;
  onClick: () => void;
  readOnly?: boolean;
  showNumberAbove?: boolean;
}) {
  const [hoveredSurface, setHoveredSurface] = useState<ToothSurface | null>(null);
  
  // Get surface conditions
  const getSurfaceCondition = (surface: ToothSurface): ToothCondition | undefined => {
    if (!data?.conditions) return undefined;
    
    // Prioritize categories so that more critical conditions take precedence
    const categoryPriority: Record<string, number> = {
      missing: 100,
      prosthetics: 90,
      endodontic: 80,
      orthodontic: 70,
      periodontal: 60,
      restorations: 50,
      findings: 40,
      other: 0,
    };

    let bestCondition: ToothCondition | undefined = undefined;
    let bestPriority = -1;
    let bestIdx = -1;

    data.conditions.forEach((cond, idx) => {
      const symbol = DENTAL_SYMBOLS[cond.symbolId];
      if (!symbol) return;

      const applies = cond.surfaces === 'whole' || (Array.isArray(cond.surfaces) && cond.surfaces.includes(surface));
      if (!applies) return;

      const p = categoryPriority[symbol.category] ?? 0;

      if (p > bestPriority || (p === bestPriority && idx > bestIdx)) {
        bestCondition = cond;
        bestPriority = p;
        bestIdx = idx;
      }
    });

    return bestCondition;
  };

  // Check if tooth is marked as missing or whole-tooth condition
  const wholeToothCondition = data?.conditions?.find(c => c.surfaces === 'whole');
  const wholeToothSymbol = wholeToothCondition ? DENTAL_SYMBOLS[wholeToothCondition.symbolId] : null;

  // Check if tooth number should be highlighted
  const hasConditions = data && data.conditions.length > 0;

  const toothNumberElement = (
    <span 
      className={`text-[10px] cursor-pointer select-none ${
        hasConditions ? 'font-bold text-blue-700' : 'text-gray-600'
      }`}
      onClick={onClick}
    >
      {toothNumber}
    </span>
  );

  const getSurfaceColor = (surface: ToothSurface): string => {
    const condition = getSurfaceCondition(surface);
    return condition ? DENTAL_SYMBOLS[condition.symbolId]?.color || '#ffffff' : '#ffffff';
  };

  return (
    <div className="flex flex-col items-center gap-0.5">
      {/* Tooth number above for upper jaw */}
      {showNumberAbove && toothNumberElement}
      
      {/* Tooth box with 5 anatomical sections - border-only style matching the image */}
      <div 
        className={`relative w-[45px] h-[45px] cursor-pointer ${
          wholeToothSymbol?.category === 'missing' 
            ? 'opacity-30' 
            : ''
        }`}
        style={{ 
          boxSizing: 'border-box'
        }}
      >
        {wholeToothSymbol?.category === 'missing' ? (
          // Missing tooth representation
          <div 
            className="absolute inset-0 flex items-center justify-center bg-gray-100"
            onClick={onClick}
          >
            <X className="w-6 h-6 text-gray-400" strokeWidth={2} />
          </div>
        ) : wholeToothCondition ? (
          // Whole tooth condition (crown, implant, etc.)
          <div 
            className="absolute inset-0 flex items-center justify-center border-2 border-gray-800"
            style={{ backgroundColor: wholeToothSymbol?.color + '40' }}
            onClick={onClick}
          >
            <div className="text-[9px] font-bold text-gray-800">
              {wholeToothSymbol?.code}
            </div>
          </div>
        ) : (
          // SVG with 5 anatomical sections - visible dividing lines like reference image
          <svg 
            width="45" 
            height="45" 
            viewBox="0 0 45 45"
            className="absolute inset-0"
            style={{ pointerEvents: 'none' }}
          >
            {/* Outer square border */}
            <rect
              x="0.5"
              y="0.5"
              width="44"
              height="44"
              fill="white"
              stroke="#1f2937"
              strokeWidth="1.5"
            />
            
            {/* Top Triangle - Occlusal/Incisal */}
            <polygon
              points="0,0 45,0 29,16 16,16"
              fill={getSurfaceColor('occlusal')}
              stroke="none"
              className="cursor-pointer transition-all hover:opacity-80"
              style={{ 
                pointerEvents: 'all',
                opacity: hoveredSurface === 'occlusal' ? 0.9 : (getSurfaceColor('occlusal') !== '#ffffff' ? 0.6 : 0)
              }}
              onMouseEnter={() => setHoveredSurface('occlusal')}
              onMouseLeave={() => setHoveredSurface(null)}
              onClick={(e) => {
                e.stopPropagation();
                if (!readOnly) onSurfaceClick('occlusal');
              }}
            >
              <title>Occlusal/Incisal</title>
            </polygon>
            
            {/* Left Triangle - Mesial */}
            <polygon
              points="0,0 0,45 16,29 16,16"
              fill={getSurfaceColor('mesial')}
              stroke="none"
              className="cursor-pointer transition-all hover:opacity-80"
              style={{ 
                pointerEvents: 'all',
                opacity: hoveredSurface === 'mesial' ? 0.9 : (getSurfaceColor('mesial') !== '#ffffff' ? 0.6 : 0)
              }}
              onMouseEnter={() => setHoveredSurface('mesial')}
              onMouseLeave={() => setHoveredSurface(null)}
              onClick={(e) => {
                e.stopPropagation();
                if (!readOnly) onSurfaceClick('mesial');
              }}
            >
              <title>Mesial</title>
            </polygon>
            
            {/* Right Triangle - Distal */}
            <polygon
              points="45,0 45,45 29,29 29,16"
              fill={getSurfaceColor('distal')}
              stroke="none"
              className="cursor-pointer transition-all hover:opacity-80"
              style={{ 
                pointerEvents: 'all',
                opacity: hoveredSurface === 'distal' ? 0.9 : (getSurfaceColor('distal') !== '#ffffff' ? 0.6 : 0)
              }}
              onMouseEnter={() => setHoveredSurface('distal')}
              onMouseLeave={() => setHoveredSurface(null)}
              onClick={(e) => {
                e.stopPropagation();
                if (!readOnly) onSurfaceClick('distal');
              }}
            >
              <title>Distal</title>
            </polygon>
            
            {/* Bottom Triangle - Lingual/Palatal */}
            <polygon
              points="0,45 45,45 29,29 16,29"
              fill={getSurfaceColor('lingual')}
              stroke="none"
              className="cursor-pointer transition-all hover:opacity-80"
              style={{ 
                pointerEvents: 'all',
                opacity: hoveredSurface === 'lingual' ? 0.9 : (getSurfaceColor('lingual') !== '#ffffff' ? 0.6 : 0)
              }}
              onMouseEnter={() => setHoveredSurface('lingual')}
              onMouseLeave={() => setHoveredSurface(null)}
              onClick={(e) => {
                e.stopPropagation();
                if (!readOnly) onSurfaceClick('lingual');
              }}
            >
              <title>Lingual/Palatal</title>
            </polygon>
            
            {/* Center Rectangle - Buccal/Labial */}
            <rect
              x="16"
              y="16"
              width="13"
              height="13"
              fill={getSurfaceColor('buccal')}
              stroke="none"
              className="cursor-pointer transition-all hover:opacity-80"
              style={{ 
                pointerEvents: 'all',
                opacity: hoveredSurface === 'buccal' ? 0.9 : (getSurfaceColor('buccal') !== '#ffffff' ? 0.6 : 0)
              }}
              onMouseEnter={() => setHoveredSurface('buccal')}
              onMouseLeave={() => setHoveredSurface(null)}
              onClick={(e) => {
                e.stopPropagation();
                if (!readOnly) onSurfaceClick('buccal');
              }}
            >
              <title>Buccal/Labial</title>
            </rect>
            
            {/* X-shaped dividing lines - always visible */}
            <line x1="0" y1="0" x2="16" y2="16" stroke="#1f2937" strokeWidth="1" />
            <line x1="45" y1="0" x2="29" y2="16" stroke="#1f2937" strokeWidth="1" />
            <line x1="0" y1="45" x2="16" y2="29" stroke="#1f2937" strokeWidth="1" />
            <line x1="45" y1="45" x2="29" y2="29" stroke="#1f2937" strokeWidth="1" />
            
            {/* Hover indicator - blue outline on hovered section */}
            {hoveredSurface === 'occlusal' && (
              <polygon
                points="0,0 45,0 29,16 16,16"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                style={{ pointerEvents: 'none' }}
              />
            )}
            {hoveredSurface === 'mesial' && (
              <polygon
                points="0,0 0,45 16,29 16,16"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                style={{ pointerEvents: 'none' }}
              />
            )}
            {hoveredSurface === 'distal' && (
              <polygon
                points="45,0 45,45 29,29 29,16"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                style={{ pointerEvents: 'none' }}
              />
            )}
            {hoveredSurface === 'lingual' && (
              <polygon
                points="0,45 45,45 29,29 16,29"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                style={{ pointerEvents: 'none' }}
              />
            )}
            {hoveredSurface === 'buccal' && (
              <rect
                x="16"
                y="16"
                width="13"
                height="13"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                style={{ pointerEvents: 'none' }}
              />
            )}
          </svg>
        )}
      </div>
      
      {/* Tooth number below for lower jaw */}
      {!showNumberAbove && toothNumberElement}
    </div>
  );
}

export function InteractiveOdontogram({ 
  initialData = {},
  dentitionType: initialDentitionType = 'adult',
  readOnly = false,
  selectedSymbol: externalSelectedSymbol = null,
  onDataChange,
  onSnapshot
}: InteractiveOdontogramProps) {
  const [dentitionType, setDentitionType] = useState<DentitionType>(initialDentitionType);
  const [teethData, setTeethData] = useState<Record<string, ToothData>>(initialData);
  
  // Use external symbol if provided
  const selectedSymbol = externalSelectedSymbol;

  const handleSurfaceClick = (toothNumber: string, surface: ToothSurface) => {
    if (readOnly || !selectedSymbol) return;

    const existing = teethData[toothNumber];
    const symbol = selectedSymbol;

    // Check if symbol applies to whole tooth
    if (symbol.surfaces === 'whole') {
      const newCondition: ToothCondition = {
        symbolId: symbol.id,
        surfaces: 'whole',
        dateRecorded: new Date(),
        recordedBy: 'Current User'
      };

      const updated = {
        ...teethData,
        [toothNumber]: {
          toothNumber,
          conditions: [newCondition],
          clinicalNotes: existing?.clinicalNotes,
          images: existing?.images,
          mobility: existing?.mobility,
          linkedTreatments: existing?.linkedTreatments
        }
      };

      setTeethData(updated);
      onDataChange?.(updated);
      return;
    }

    // For surface-specific conditions
    const existingConditionIndex = existing?.conditions?.findIndex(c => 
      Array.isArray(c.surfaces) && c.surfaces.includes(surface) && c.symbolId === symbol.id
    ) ?? -1;

    let newConditions: ToothCondition[];

    if (existingConditionIndex >= 0) {
      // Remove this surface from the condition
      const condition = existing!.conditions[existingConditionIndex];
      const newSurfaces = (condition.surfaces as ToothSurface[]).filter(s => s !== surface);
      
      if (newSurfaces.length === 0) {
        newConditions = existing!.conditions.filter((_, i) => i !== existingConditionIndex);
      } else {
        newConditions = existing!.conditions.map((c, i) => 
          i === existingConditionIndex ? { ...c, surfaces: newSurfaces } : c
        );
      }
    } else {
      // Add this surface to conditions
      const newCondition: ToothCondition = {
        symbolId: symbol.id,
        surfaces: [surface],
        dateRecorded: new Date(),
        recordedBy: 'Current User'
      };

      newConditions = [...(existing?.conditions || []), newCondition];
    }

    const updated = {
      ...teethData,
      [toothNumber]: {
        toothNumber,
        conditions: newConditions,
        clinicalNotes: existing?.clinicalNotes,
        images: existing?.images,
        mobility: existing?.mobility,
        linkedTreatments: existing?.linkedTreatments
      }
    };

    setTeethData(updated);
    onDataChange?.(updated);
  };

  const handleToothClick = (_toothNumber: string) => {
    // Can be used to show tooth details dialog
  };

  const handleSnapshot = () => {
    onSnapshot?.();
    alert('Snapshot saved successfully!');
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <Card className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Dentition Type Toggle */}
            <div className="flex items-center gap-2">
              <Label className="text-sm">Dentition:</Label>
              <Tabs value={dentitionType} onValueChange={(v: string) => setDentitionType(v as DentitionType)}>
                <TabsList>
                  <TabsTrigger value="adult">
                    Adult (32)
                  </TabsTrigger>
                  <TabsTrigger value="pediatric">
                    Pediatric (20)
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!readOnly && (
              <>
                <Button variant="outline" size="sm" onClick={handleSnapshot}>
                  <History className="size-4 mr-2" />
                  Save Snapshot
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="size-4 mr-2" />
                  Export PDF
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Odontogram Chart */}
      <Card className="p-6">
        <div className="mb-6">
          <h3>Interactive Odontogram - FDI Notation</h3>
          {!readOnly && selectedSymbol && (
            <div className="mt-2 flex items-center gap-2">
              <Badge 
                style={{ 
                  backgroundColor: selectedSymbol.color + '30', 
                  color: selectedSymbol.color,
                  border: `1px solid ${selectedSymbol.color}`
                }}
              >
                Active: {selectedSymbol.nameId} ({selectedSymbol.code})
              </Badge>
            </div>
          )}
          {!readOnly && !selectedSymbol && (
            <p className="text-sm text-muted-foreground mt-2">
              Select a symbol from the palette, then click tooth surfaces to chart.
            </p>
          )}
        </div>

        {/* Chart Layout - FDI 4-Quadrant Layout with Pediatric teeth visible */}
        <div className="inline-block mx-auto">
          {/* Upper Quadrants */}
          <div className="flex gap-4 mb-2">
            {/* Quadrant 1 - Upper Right (18-11) */}
            <div className="flex flex-col items-end">
              {/* Adult teeth */}
              <div className="flex gap-[2px] mb-1">
                {ADULT_TEETH.upperRight.map(tooth => (
                  <InteractiveTooth
                    key={tooth}
                    toothNumber={tooth}
                    data={teethData[tooth]}
                    onSurfaceClick={(surface) => handleSurfaceClick(tooth, surface)}
                    onClick={() => handleToothClick(tooth)}
                    readOnly={readOnly}
                    showNumberAbove={true}
                  />
                ))}
              </div>
              
              {/* Pediatric teeth - smaller, centered below adult */}
              <div className="flex gap-[2px] justify-end pr-[90px] opacity-70">
                {PEDIATRIC_TEETH.upperRight.map(tooth => (
                  <div key={tooth} className="scale-75">
                    <InteractiveTooth
                      toothNumber={tooth}
                      data={teethData[tooth]}
                      onSurfaceClick={(surface) => handleSurfaceClick(tooth, surface)}
                      onClick={() => handleToothClick(tooth)}
                      readOnly={readOnly}
                      showNumberAbove={true}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="w-[2px] bg-slate-400 mx-2" />

            {/* Quadrant 2 - Upper Left (21-28) */}
            <div className="flex flex-col items-start">
              {/* Adult teeth */}
              <div className="flex gap-[2px] mb-1">
                {ADULT_TEETH.upperLeft.map(tooth => (
                  <InteractiveTooth
                    key={tooth}
                    toothNumber={tooth}
                    data={teethData[tooth]}
                    onSurfaceClick={(surface) => handleSurfaceClick(tooth, surface)}
                    onClick={() => handleToothClick(tooth)}
                    readOnly={readOnly}
                    showNumberAbove={true}
                  />
                ))}
              </div>
              
              {/* Pediatric teeth - smaller, centered below adult */}
              <div className="flex gap-[2px] pl-[90px] opacity-70">
                {PEDIATRIC_TEETH.upperLeft.map(tooth => (
                  <div key={tooth} className="scale-75">
                    <InteractiveTooth
                      toothNumber={tooth}
                      data={teethData[tooth]}
                      onSurfaceClick={(surface) => handleSurfaceClick(tooth, surface)}
                      onClick={() => handleToothClick(tooth)}
                      readOnly={readOnly}
                      showNumberAbove={true}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Horizontal Divider */}
          <div className="border-t-2 border-slate-400 my-3" />

          {/* Lower Quadrants */}
          <div className="flex gap-4 mt-2">
            {/* Quadrant 4 - Lower Right (48-41) */}
            <div className="flex flex-col items-end">
              {/* Pediatric teeth - smaller, centered above adult */}
              <div className="flex gap-[2px] justify-end pr-[90px] opacity-70 mb-1">
                {PEDIATRIC_TEETH.lowerRight.map(tooth => (
                  <div key={tooth} className="scale-75">
                    <InteractiveTooth
                      toothNumber={tooth}
                      data={teethData[tooth]}
                      onSurfaceClick={(surface) => handleSurfaceClick(tooth, surface)}
                      onClick={() => handleToothClick(tooth)}
                      readOnly={readOnly}
                      showNumberAbove={false}
                    />
                  </div>
                ))}
              </div>
              
              {/* Adult teeth */}
              <div className="flex gap-[2px]">
                {ADULT_TEETH.lowerRight.map(tooth => (
                  <InteractiveTooth
                    key={tooth}
                    toothNumber={tooth}
                    data={teethData[tooth]}
                    onSurfaceClick={(surface) => handleSurfaceClick(tooth, surface)}
                    onClick={() => handleToothClick(tooth)}
                    readOnly={readOnly}
                    showNumberAbove={false}
                  />
                ))}
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="w-[2px] bg-slate-400 mx-2" />

            {/* Quadrant 3 - Lower Left (31-38) */}
            <div className="flex flex-col items-start">
              {/* Pediatric teeth - smaller, centered above adult */}
              <div className="flex gap-[2px] pl-[90px] opacity-70 mb-1">
                {PEDIATRIC_TEETH.lowerLeft.map(tooth => (
                  <div key={tooth} className="scale-75">
                    <InteractiveTooth
                      toothNumber={tooth}
                      data={teethData[tooth]}
                      onSurfaceClick={(surface) => handleSurfaceClick(tooth, surface)}
                      onClick={() => handleToothClick(tooth)}
                      readOnly={readOnly}
                      showNumberAbove={false}
                    />
                  </div>
                ))}
              </div>
              
              {/* Adult teeth */}
              <div className="flex gap-[2px]">
                {ADULT_TEETH.lowerLeft.map(tooth => (
                  <InteractiveTooth
                    key={tooth}
                    toothNumber={tooth}
                    data={teethData[tooth]}
                    selectedSymbol={selectedSymbol || undefined}
                    onSurfaceClick={(surface) => handleSurfaceClick(tooth, surface)}
                    onClick={() => handleToothClick(tooth)}
                    readOnly={readOnly}
                    showNumberAbove={false}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Condition Legend */}
        <div className="mt-6 border-t pt-4">
          <h5 className="font-medium text-sm mb-2">Legends</h5>
          {Object.values(teethData).some(td => td?.conditions?.length) ? (
            <div className="space-y-2">
              {Object.entries(teethData)
                .filter(([_, td]) => td?.conditions?.length)
                .sort(([a], [b]) => parseInt(a) - parseInt(b))
                .map(([toothNumber, td]) => (
                  <div key={toothNumber} className="flex items-start gap-2">
                    <span className="text-xs font-medium w-10">#{toothNumber}</span>
                    <div className="flex flex-wrap gap-1">
                      {td.conditions.map((cond, i) => {
                        const symbol = DENTAL_SYMBOLS[cond.symbolId];
                        const surfacesLabel = cond.surfaces === 'whole'
                          ? ''
                          : ` (${(cond.surfaces as ToothSurface[]).map(s => s[0].toUpperCase()).join(',')})`;
                        return (
                          <Badge key={i}
                            className="text-xs"
                            style={{
                              backgroundColor: symbol.color + '20',
                              color: symbol.color,
                              border: `1px solid ${symbol.color}`
                            }}
                          >
                            {symbol.code}{surfacesLabel}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No charted legends yet. Select a symbol and click on tooth surfaces above.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
