export type CatalogTab = 'general' | 'fiscal' | 'costs' | 'settings';

export interface ProductServiceDraft {
  general: ProductServiceGeneral;
  fiscal: ProductServiceFiscal;
  cost: ProductServiceCost;
  settings: ProductServiceSettings;
  costHistory: CostHistory[];
}

export interface ProductServiceGeneral {
  id?: string | null;
  itemType: 'Product' | 'Service';
  internalCode: string;
  barcode: string;
  description: string;
  category: string;
  brand: string;
  unit: string;
  active: boolean;
}

export interface ProductServiceFiscal {
  ncm: string;
  ncmDescription: string;
  origin: string;
  cest: string;
  anpCode: string;
  taxClassification: string;
  taxCoreStatus: string;
}

export interface ProductServiceCost {
  costSource: string;
  currentCost: number;
  freightCost: number;
  insuranceCost: number;
  otherCosts: number;
}

export interface ProductServiceSettings {
  participatesInPricing: boolean;
  allowTaxSimulation: boolean;
  monitorCostChanges: boolean;
  alertBelowMinimumMargin: boolean;
  defaultPricePolicy: string;
  defaultSalesChannel: string;
  desiredMargin: number;
  minimumMargin: number;
}

export interface CostHistory {
  date: string;
  cost: number;
  variation?: number | null;
}

export interface SaveProductServiceRequest {
  general: ProductServiceGeneral;
  fiscal: ProductServiceFiscal;
  cost: ProductServiceCost;
  settings: ProductServiceSettings;
}

export interface SaveProductServiceResponse {
  id: string;
  internalCode: string;
  description: string;
  status: string;
  savedAt: string;
}

export interface ProductServiceListItem {
  id: string;
  internalCode: string;
  description: string;
  itemType: string;
  category: string;
  ncm: string;
  currentCost: number;
  status: string;
  taxCoreStatus: string;
}
