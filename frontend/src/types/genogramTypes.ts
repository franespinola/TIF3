/**
 * genogramTypes.ts
 * 
 * Definiciones de tipos e interfaces para el genograma
 */

export interface PersonAttributes {
  isPatient?: boolean;
  isDeceased?: boolean;
  isAbortion?: boolean;
  abortionType?: string;
  isAdoption?: boolean;
  isPregnancy?: boolean;
  [key: string]: any;
}

export interface Person {
  id: string;
  name?: string;
  gender?: 'M' | 'F';
  generation?: number;
  age?: number;
  notes?: string;
  attributes?: PersonAttributes;
}

export interface Relationship {
  id: string;
  source: string;
  target: string;
  type: 'conyugal' | 'parentChild' | 'hermanos' | 'mellizos' | string;
  emotionalBond?: string;
  legalStatus?: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
}

export interface GenogramData {
  people: Person[];
  relationships: Relationship[];
}

export interface Node {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    generation?: number;
    age?: number;
    notes?: string;
    attributes?: PersonAttributes;
    gender?: string;
    [key: string]: any;
  };
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  type: string;
  sourceHandle?: string;
  targetHandle?: string;
  data: {
    relType: string;
    notes?: string;
    startDate?: string;
    endDate?: string;
    [key: string]: any;
  };
} 