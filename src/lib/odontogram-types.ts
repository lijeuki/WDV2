// Types and interfaces for comprehensive odontogram system

export type DentitionType = 'adult' | 'pediatric';

export type ToothSurface = 'occlusal' | 'mesial' | 'distal' | 'buccal' | 'lingual';

export type SymbolCategory = 
  | 'findings' 
  | 'restorations' 
  | 'prosthetics' 
  | 'endodontic'
  | 'missing'
  | 'orthodontic'
  | 'periodontal'
  | 'other';

export interface DentalSymbol {
  id: string;
  name: string;
  nameId: string; // Indonesian
  category: SymbolCategory;
  code: string; // ISO/FDI code
  color: string; // Visual color code
  icon?: string; // Lucide icon name
  surfaces: ToothSurface[] | 'all' | 'whole'; // Applicable surfaces
  description?: string;
}

export interface ToothCondition {
  symbolId: string;
  surfaces: ToothSurface[] | 'whole';
  severity?: 'mild' | 'moderate' | 'severe';
  dateRecorded: Date;
  recordedBy: string;
  notes?: string;
}

export interface ToothData {
  toothNumber: string;
  conditions: ToothCondition[];
  clinicalNotes?: string;
  images?: string[]; // Image IDs/URLs
  mobility?: 1 | 2 | 3;
  bleeding?: boolean;
  linkedTreatments?: string[]; // Treatment plan IDs
}

export interface OdontogramSnapshot {
  id: string;
  patientId: string;
  visitDate: Date;
  visitId?: string;
  dentitionType: DentitionType;
  teethData: Record<string, ToothData>;
  clinicalSummary?: string;
  recordedBy: string;
  timestamp: Date;
}

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  action: 'create' | 'update' | 'delete' | 'view';
  entityType: 'tooth' | 'condition' | 'note' | 'snapshot';
  entityId: string;
  previousValue?: any;
  newValue?: any;
  ipAddress?: string;
}

// Standardized Symbol Library (ISO 3950 / FDI Compliant)
export const DENTAL_SYMBOLS: Record<string, DentalSymbol> = {
  // FINDINGS
  'sound': {
    id: 'sound',
    name: 'Sound Tooth',
    nameId: 'Gigi Sehat',
    category: 'findings',
    code: 'S',
    color: '#10b981', // green
    surfaces: 'all',
    description: 'Healthy tooth with no visible pathology'
  },
  'caries': {
    id: 'caries',
    name: 'Caries Lesion',
    nameId: 'Karies',
    category: 'findings',
    code: 'C',
    color: '#ef4444', // red
    icon: 'AlertCircle',
    surfaces: 'all',
    description: 'Dental decay/cavity'
  },
  'non-vital': {
    id: 'non-vital',
    name: 'Non-Vital Tooth',
    nameId: 'Gigi Non-Vital',
    category: 'findings',
    code: 'NV',
    color: '#6b7280', // gray
    surfaces: 'whole',
    description: 'Endodontically treated or necrotic tooth'
  },
  'fractured': {
    id: 'fractured',
    name: 'Fractured',
    nameId: 'Patah',
    category: 'findings',
    code: 'FR',
    color: '#f59e0b', // amber
    icon: 'AlertTriangle',
    surfaces: 'all',
    description: 'Crown or root fracture'
  },
  'impacted': {
    id: 'impacted',
    name: 'Impacted/Unerupted',
    nameId: 'Terpendam',
    category: 'findings',
    code: 'IM',
    color: '#8b5cf6', // purple
    surfaces: 'whole',
    description: 'Tooth that has not erupted or is blocked'
  },
  'partial-eruption': {
    id: 'partial-eruption',
    name: 'Partial Eruption',
    nameId: 'Erupsi Sebagian',
    category: 'findings',
    code: 'PE',
    color: '#a855f7',
    surfaces: 'whole',
    description: 'Tooth partially emerged through gingiva'
  },
  'anomalous': {
    id: 'anomalous',
    name: 'Anomalous',
    nameId: 'Anomali',
    category: 'findings',
    code: 'AN',
    color: '#ec4899',
    surfaces: 'whole',
    description: 'Abnormal shape, size, or position'
  },
  'wear': {
    id: 'wear',
    name: 'Tooth Wear',
    nameId: 'Aus',
    category: 'findings',
    code: 'WR',
    color: '#f97316',
    surfaces: 'all',
    description: 'Attrition, abrasion, or erosion'
  },
  'discoloration': {
    id: 'discoloration',
    name: 'Discoloration',
    nameId: 'Perubahan Warna',
    category: 'findings',
    code: 'DC',
    color: '#eab308',
    surfaces: 'all',
    description: 'Staining or color change'
  },

  // RESTORATIONS
  'composite': {
    id: 'composite',
    name: 'Composite Filling',
    nameId: 'Tambalan Komposit',
    category: 'restorations',
    code: 'CO',
    color: '#3b82f6', // blue
    icon: 'Square',
    surfaces: 'all',
    description: 'Tooth-colored resin restoration'
  },
  'amalgam': {
    id: 'amalgam',
    name: 'Amalgam Filling',
    nameId: 'Tambalan Amalgam',
    category: 'restorations',
    code: 'AM',
    color: '#64748b', // slate
    icon: 'Square',
    surfaces: 'all',
    description: 'Silver/mercury alloy filling'
  },
  'gold-filling': {
    id: 'gold-filling',
    name: 'Gold Filling',
    nameId: 'Tambalan Emas',
    category: 'restorations',
    code: 'GF',
    color: '#eab308', // yellow
    surfaces: 'all',
    description: 'Gold inlay or onlay'
  },
  'temporary': {
    id: 'temporary',
    name: 'Temporary Filling',
    nameId: 'Tambalan Sementara',
    category: 'restorations',
    code: 'TF',
    color: '#fb923c',
    surfaces: 'all',
    description: 'Temporary restoration material'
  },
  'sealant': {
    id: 'sealant',
    name: 'Fissure Sealant',
    nameId: 'Sealant',
    category: 'restorations',
    code: 'SE',
    color: '#06b6d4', // cyan
    surfaces: ['occlusal'],
    description: 'Preventive pit and fissure sealant'
  },

  // PROSTHETICS
  'crown-porcelain': {
    id: 'crown-porcelain',
    name: 'Porcelain Crown',
    nameId: 'Mahkota Porselen',
    category: 'prosthetics',
    code: 'CP',
    color: '#8b5cf6', // purple
    icon: 'Crown',
    surfaces: 'whole',
    description: 'Full ceramic/porcelain crown'
  },
  'crown-metal': {
    id: 'crown-metal',
    name: 'Metal Crown',
    nameId: 'Mahkota Metal',
    category: 'prosthetics',
    code: 'CM',
    color: '#64748b',
    icon: 'Crown',
    surfaces: 'whole',
    description: 'Full metal or PFM crown'
  },
  'crown-gold': {
    id: 'crown-gold',
    name: 'Gold Crown',
    nameId: 'Mahkota Emas',
    category: 'prosthetics',
    code: 'CG',
    color: '#eab308',
    icon: 'Crown',
    surfaces: 'whole',
    description: 'Full gold crown'
  },
  'bridge': {
    id: 'bridge',
    name: 'Bridge',
    nameId: 'Bridge',
    category: 'prosthetics',
    code: 'BR',
    color: '#6366f1', // indigo
    surfaces: 'whole',
    description: 'Fixed partial denture'
  },
  'implant': {
    id: 'implant',
    name: 'Implant',
    nameId: 'Implan',
    category: 'prosthetics',
    code: 'IP',
    color: '#14b8a6', // teal
    icon: 'Anchor',
    surfaces: 'whole',
    description: 'Dental implant with crown'
  },
  'veneer': {
    id: 'veneer',
    name: 'Veneer',
    nameId: 'Veneer',
    category: 'prosthetics',
    code: 'VN',
    color: '#a78bfa',
    surfaces: ['buccal'],
    description: 'Porcelain or composite veneer'
  },
  'denture-partial': {
    id: 'denture-partial',
    name: 'Partial Denture',
    nameId: 'Gigi Tiruan Sebagian',
    category: 'prosthetics',
    code: 'PD',
    color: '#f472b6',
    surfaces: 'whole',
    description: 'Removable partial denture'
  },

  // ENDODONTIC
  'root-canal': {
    id: 'root-canal',
    name: 'Root Canal Treatment',
    nameId: 'Perawatan Saluran Akar',
    category: 'endodontic',
    code: 'RC',
    color: '#dc2626', // red
    icon: 'Activity',
    surfaces: 'whole',
    description: 'Endodontic therapy completed'
  },
  'post-core': {
    id: 'post-core',
    name: 'Post & Core',
    nameId: 'Post & Core',
    category: 'endodontic',
    code: 'PC',
    color: '#b91c1c',
    surfaces: 'whole',
    description: 'Post and core build-up'
  },

  // MISSING
  'missing-extracted': {
    id: 'missing-extracted',
    name: 'Missing (Extracted)',
    nameId: 'Hilang (Dicabut)',
    category: 'missing',
    code: 'ME',
    color: '#000000',
    icon: 'X',
    surfaces: 'whole',
    description: 'Tooth previously extracted'
  },
  'missing-congenital': {
    id: 'missing-congenital',
    name: 'Missing (Congenital)',
    nameId: 'Hilang (Bawaan)',
    category: 'missing',
    code: 'MC',
    color: '#374151',
    icon: 'Minus',
    surfaces: 'whole',
    description: 'Tooth never developed'
  },
  'retained-root': {
    id: 'retained-root',
    name: 'Retained Root',
    nameId: 'Sisa Akar',
    category: 'missing',
    code: 'RR',
    color: '#7c2d12',
    surfaces: 'whole',
    description: 'Root fragment remaining after crown loss'
  },

  // ORTHODONTIC
  'bracket': {
    id: 'bracket',
    name: 'Orthodontic Bracket',
    nameId: 'Bracket Ortodonti',
    category: 'orthodontic',
    code: 'OB',
    color: '#0ea5e9', // sky
    icon: 'Box',
    surfaces: ['buccal'],
    description: 'Fixed orthodontic appliance'
  },
  'band': {
    id: 'band',
    name: 'Orthodontic Band',
    nameId: 'Band Ortodonti',
    category: 'orthodontic',
    code: 'OD',
    color: '#0284c7',
    surfaces: 'whole',
    description: 'Molar band for orthodontics'
  },

  // PERIODONTAL
  'mobility-1': {
    id: 'mobility-1',
    name: 'Mobility Grade 1',
    nameId: 'Goyah Tingkat 1',
    category: 'periodontal',
    code: 'M1',
    color: '#fbbf24',
    surfaces: 'whole',
    description: 'Slight horizontal mobility'
  },
  'mobility-2': {
    id: 'mobility-2',
    name: 'Mobility Grade 2',
    nameId: 'Goyah Tingkat 2',
    category: 'periodontal',
    code: 'M2',
    color: '#f59e0b',
    surfaces: 'whole',
    description: 'Moderate horizontal mobility'
  },
  'mobility-3': {
    id: 'mobility-3',
    name: 'Mobility Grade 3',
    nameId: 'Goyah Tingkat 3',
    category: 'periodontal',
    code: 'M3',
    color: '#dc2626',
    surfaces: 'whole',
    description: 'Severe mobility including vertical movement'
  },
  'furcation': {
    id: 'furcation',
    name: 'Furcation Involvement',
    nameId: 'Furkasi',
    category: 'periodontal',
    code: 'FU',
    color: '#b91c1c',
    surfaces: 'whole',
    description: 'Bone loss between roots'
  },
};

// Adult teeth (permanent dentition) - FDI notation 11-48
export const ADULT_TEETH = {
  upperRight: ['18', '17', '16', '15', '14', '13', '12', '11'],
  upperLeft: ['21', '22', '23', '24', '25', '26', '27', '28'],
  lowerLeft: ['31', '32', '33', '34', '35', '36', '37', '38'],
  lowerRight: ['41', '42', '43', '44', '45', '46', '47', '48'],
};

// Pediatric teeth (primary dentition) - FDI notation 51-85
export const PEDIATRIC_TEETH = {
  upperRight: ['55', '54', '53', '52', '51'],
  upperLeft: ['61', '62', '63', '64', '65'],
  lowerLeft: ['71', '72', '73', '74', '75'],
  lowerRight: ['85', '84', '83', '82', '81'],
};

// Tooth type classification
export function getToothType(toothNumber: string): 'incisor' | 'canine' | 'premolar' | 'molar' | 'unknown' {
  const lastDigit = parseInt(toothNumber.slice(-1));
  
  // For adult teeth
  if (toothNumber.length === 2 && toothNumber[0] in ['1', '2', '3', '4']) {
    if (lastDigit >= 1 && lastDigit <= 2) return 'incisor';
    if (lastDigit === 3) return 'canine';
    if (lastDigit >= 4 && lastDigit <= 5) return 'premolar';
    if (lastDigit >= 6 && lastDigit <= 8) return 'molar';
  }
  
  // For pediatric teeth
  if (toothNumber.length === 2 && toothNumber[0] in ['5', '6', '7', '8']) {
    if (lastDigit >= 1 && lastDigit <= 2) return 'incisor';
    if (lastDigit === 3) return 'canine';
    if (lastDigit >= 4 && lastDigit <= 5) return 'molar';
  }
  
  return 'unknown';
}

// Get quadrant name
export type QuadrantKey = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';
export function getQuadrantName(toothNumber: string, lang: 'en' | 'id' = 'en'): string {
  const firstDigit = toothNumber[0] as QuadrantKey;
  const quadrants: Record<QuadrantKey, { en: string; id: string }> = {
    '1': { en: 'Upper Right', id: 'Atas Kanan' },
    '2': { en: 'Upper Left', id: 'Atas Kiri' },
    '3': { en: 'Lower Left', id: 'Bawah Kiri' },
    '4': { en: 'Lower Right', id: 'Bawah Kanan' },
    '5': { en: 'Upper Right (Primary)', id: 'Atas Kanan (Susu)' },
    '6': { en: 'Upper Left (Primary)', id: 'Atas Kiri (Susu)' },
    '7': { en: 'Lower Left (Primary)', id: 'Bawah Kiri (Susu)' },
    '8': { en: 'Lower Right (Primary)', id: 'Bawah Kanan (Susu)' },
  };
  return quadrants[firstDigit][lang] || 'Unknown';
}
