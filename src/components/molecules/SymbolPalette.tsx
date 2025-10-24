import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";
import { DentalSymbol, DENTAL_SYMBOLS, SymbolCategory } from "../../lib/odontogram-types";
import { Info, Search } from "lucide-react";
import { useState } from "react";

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
  const [searchQuery, setSearchQuery] = useState('');
  
  const categories: { id: SymbolCategory; label: string; icon?: string }[] = [
    { id: 'findings', label: 'Findings', icon: '🔍' },
    { id: 'restorations', label: 'Restore', icon: '🦷' },
    { id: 'prosthetics', label: 'Prosth.', icon: '👑' },
    { id: 'endodontic', label: 'Endo', icon: '🩺' },
    { id: 'missing', label: 'Missing', icon: '❌' },
    { id: 'orthodontic', label: 'Ortho', icon: '🔗' },
    { id: 'periodontal', label: 'Perio', icon: '⚕️' },
  ];

  const symbolsByCategory = (category: SymbolCategory) => {
    const symbols = Object.values(DENTAL_SYMBOLS).filter(s => s.category === category);
    
    if (!searchQuery) return symbols;
    
    const query = searchQuery.toLowerCase();
    return symbols.filter(s => 
      s.nameId.toLowerCase().includes(query) ||
      s.name.toLowerCase().includes(query) ||
      s.code.toLowerCase().includes(query)
    );
  };
  
  const allFilteredSymbols = () => {
    if (!searchQuery) return [];
    
    const query = searchQuery.toLowerCase();
    return Object.values(DENTAL_SYMBOLS).filter(s => 
      s.nameId.toLowerCase().includes(query) ||
      s.name.toLowerCase().includes(query) ||
      s.code.toLowerCase().includes(query)
    );
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

      {/* Search Bar */}
      <div className="mb-3 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search symbols..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-9 text-sm"
        />
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

      {/* Show search results if searching, otherwise show tabs */}
      {searchQuery ? (
        <ScrollArea className={compact ? 'h-[400px]' : 'h-[500px]'}>
          <div className={`grid ${compact ? 'grid-cols-1 gap-1.5' : 'grid-cols-1 gap-2.5'}`}>
            {allFilteredSymbols().length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No symbols found for "{searchQuery}"
              </div>
            ) : (
              allFilteredSymbols().map(symbol => (
                <SymbolButton key={symbol.id} symbol={symbol} />
              ))
            )}
          </div>
        </ScrollArea>
      ) : (
        <Tabs defaultValue="findings" className="w-full">
          <TabsList className="grid grid-cols-4 w-full mb-3 h-auto">
            {categories.slice(0, 4).map(cat => (
              <TabsTrigger 
                key={cat.id} 
                value={cat.id}
                className="text-[10px] flex-col h-14 gap-1"
              >
                <span className="text-lg">{cat.icon}</span>
                <span>{cat.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsList className="grid grid-cols-3 w-full mb-3 h-auto">
            {categories.slice(4).map(cat => (
              <TabsTrigger 
                key={cat.id} 
                value={cat.id}
                className="text-[10px] flex-col h-14 gap-1"
              >
                <span className="text-lg">{cat.icon}</span>
                <span>{cat.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <ScrollArea className={compact ? 'h-[350px]' : 'h-[400px]'}>
            {categories.map(category => (
              <TabsContent key={category.id} value={category.id} className="mt-0">
                <div className={`grid ${compact ? 'grid-cols-1 gap-1.5' : 'grid-cols-1 gap-2'}`}>
                  {symbolsByCategory(category.id).map(symbol => (
                    <SymbolButton key={symbol.id} symbol={symbol} />
                  ))}
                </div>
              </TabsContent>
            ))}
          </ScrollArea>
        </Tabs>
      )}
    </Card>
  );
}
