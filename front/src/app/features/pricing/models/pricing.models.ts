export type PriceComponentType =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11;

export type PricingMode = 'margin' | 'sale';

export interface PricingWorkspace {
  product: ProductPricing;
  scenario: ScenarioPricing;
  lastUpdate: LastUpdate;
  channels: SalesChannelPricing[];
  calculationRequest: CalculatePriceRequest;
}

export interface ProductPricing {
  id: string;
  name: string;
  code: string;
  status: string;
  ncm: string;
  brand: string;
  category: string;
}

export interface ScenarioPricing {
  company: string;
  branch: string;
  selectedChannel: string;
  operationDate: string;
}

export interface LastUpdate {
  updatedAt: string;
  updatedBy: string;
}

export interface SalesChannelPricing {
  id: string;
  name: string;
  currentPrice: number;
  multiplier: number;
  status: string;
}

export interface PricingExpense {
  type: PriceComponentType;
  description: string;
  percentage?: number | null;
  value: number;
}

export interface CalculatePriceRequest {
  tenantId: string;
  companyId: string;
  establishmentId: string;
  productId: string;
  salesChannelId?: string | null;
  operationDate: string;
  originState: string;
  destinationState: string;
  destinationCityCode: number;
  ncm: string;
  manualAcquisitionCost?: number | null;
  freightCost: number;
  insuranceCost: number;
  otherCosts: number;
  desiredMargin: number;
  minimumMargin: number;
  currentPrice: number;
  taxableBase: number;
  roundingType: number;
  costSource: number;
  expenses: PricingExpense[];
}

export interface CalculatePriceResponse {
  formationId: string;
  status: number;
  effectiveCost: number;
  minimumPrice: number;
  suggestedPrice: number;
  targetPrice: number;
  margin: number;
  markup: number;
  components: PriceComponentResponse[];
}

export interface PriceComponentResponse {
  type: PriceComponentType;
  description: string;
  percentage?: number | null;
  value: number;
}

export interface CompositionGroup {
  icon: string;
  step: string;
  title: string;
  total: number;
  kind?: 'result';
  lines: Array<{ label: string; value: number; percent?: boolean }>;
}

export interface ChannelPriceRow {
  name: string;
  currentPrice: number;
  suggestedPrice: number;
  margin: number;
  status: string;
}
