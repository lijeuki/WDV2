import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";
import { DentalSymbol, DENTAL_SYMBOLS, SymbolCategory } from "../../lib/odontogram-types";
import { Info } from "lucide-react";

interface SymbolPaletteProps {
  onSymbolSelect: (symbol: DentalSymbol) => void;
  selectedSymbolId?: string;
  compact?: boolean;
}

export function SymbolPalette({ 
  onSymbolSelect, 
  selectedSymbolId,
  compact = false 
}: SymbolPaletteProps) {
  const categories: { id: SymbolCategory; label: string; icon?: string }[] = [
    { id: 'findings', label: 'Findings', icon: '🔍' },
    { id: 'restorations', label: 'Restorations', icon: '🦷' },
    { id: 'prosthetics', label: 'Prosthetics', icon: '👑' },
    { id: 'endodontic', label: 'Endodontic', icon: '🩺' },
    { id: 'missing', label: 'Missing', icon: '❌' },
    { id: 'orthodontic', label: 'Orthodontic', icon: '🔗' },
    { id: 'periodontal', label: 'Periodontal', icon: '⚕️' },
  ];

  const symbolsByCategory = (category: SymbolCategory) => {
    return Object.values(DENTAL_SYMBOLS).filter(s => s.category === category);
  };

  const SymbolButton = ({ symbol }: { symbol: DentalSymbol }) => {
    const isSelected = selectedSymbolId === symbol.id;
    
    if (compact) {
      return (
        <button
          onClick={() => onSymbolSelect(symbol)}
          className={`
            flex items-center gap-2 px-2 py-1.5 rounded border transition-all text-left w-full
            ${isSelected 
              ? 'bg-primary text-white border-primary shadow-md scale-105' 
              : 'bg-background hover:bg-accent border-border hover:border-primary/50'}
          `}
          title={symbol.description}
        >
          <div 
            className="size-4 rounded-sm flex-shrink-0"
            style={{ backgroundColor: symbol.color }}
          />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium truncate">{symbol.nameId}</div>
            <div className="text-[10px] text-muted-foreground">{symbol.code}</div>
          </div>
        </button>
      );
    }

    return (
      <button
        onClick={() => onSymbolSelect(symbol)}
        className={`
          flex flex-col items-start gap-2 p-3 rounded-lg border transition-all
          ${isSelected 
            ? 'bg-primary text-white border-primary shadow-lg scale-105' 
            : 'bg-card hover:bg-accent border-border hover:border-primary/50 hover:shadow-md'}
        `}
        title={symbol.description}
      >
        <div className="flex items-center gap-2 w-full">
          <div 
            className="size-6 rounded flex-shrink-0"
            style={{ backgroundColor: symbol.color }}
          />
          <Badge 
            variant="outline" 
            className={`text-xs ${isSelected ? 'border-white text-white' : ''}`}
          >
            {symbol.code}
          </Badge>
        </div>
        <div className="w-full">
          <div className="text-sm font-medium">{symbol.nameId}</div>
          <div className="text-xs opacity-80">{symbol.name}</div>
        </div>
      </button>
    );
  };

  return (
    <Card className={compact ? 'p-3' : 'p-4'}>
      <div className="mb-3">
        <h3 className={compact ? 'text-sm font-semibold' : 'text-base font-semibold'}>
          Dental Symbols
        </h3>
        {!compact && (
          <p className="text-xs text-muted-foreground mt-1">
            Select a symbol, then click on tooth surfaces to chart
          </p>
        )}
      </div>

      {selectedSymbolId && (
        <div className="mb-3 p-2 bg-primary/10 rounded border border-primary/30">
          <div className="flex items-center gap-2">
            <Info className="size-3 text-primary" />
            <span className="text-xs font-medium text-primary">
              {DENTAL_SYMBOLS[selectedSymbolId]?.nameId || 'Symbol'} selected
            </span>
          </div>
        </div>
      )}

      <Tabs defaultValue="findings" className="w-full">
        <TabsList className={`grid ${compact ? 'grid-cols-4' : 'grid-cols-3'} w-full mb-3`}>
          {categories.slice(0, compact ? 4 : categories.length).map(cat => (
            <TabsTrigger 
              key={cat.id} 
              value={cat.id}
              className="text-xs"
            >
              {cat.icon && <span className="mr-1">{cat.icon}</span>}
              {compact ? cat.icon : cat.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <ScrollArea className={compact ? 'h-[400px]' : 'h-[500px]'}>
          {categories.map(category => (
            <TabsContent key={category.id} value={category.id} className="mt-0">
              <div className={`grid ${compact ? 'grid-cols-1 gap-1.5' : 'grid-cols-1 gap-2.5'}`}>
                {symbolsByCategory(category.id).map(symbol => (
                  <SymbolButton key={symbol.id} symbol={symbol} />
                ))}
              </div>
            </TabsContent>
          ))}
        </ScrollArea>
      </Tabs>
    </Card>
  );
}
