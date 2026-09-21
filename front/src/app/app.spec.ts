import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { App } from './app';
import { ProductServicesApiService } from './features/catalog/services/product-services-api.service';
import { PricingApiService } from './features/pricing/services/pricing-api.service';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        {
          provide: ProductServicesApiService,
          useValue: {
            getProducts: () =>
              of([
                {
                  id: '55555555-5555-5555-5555-555555555555',
                  internalCode: '000154',
                  description: 'Oleo Motor Sintetico 5W30',
                  itemType: 'Produto',
                  category: 'Lubrificantes',
                  ncm: '2710.19.32',
                  currentCost: 106,
                  status: 'Ativo',
                  taxCoreStatus: 'Validado',
                },
              ]),
            getDraft: () =>
              of({
                general: {
                  id: null,
                  itemType: 'Product',
                  internalCode: '000154',
                  barcode: '7891234567890',
                  description: 'Oleo Motor Sintetico 5W30',
                  category: 'Lubrificantes',
                  brand: 'Shell',
                  unit: 'UN',
                  active: true,
                },
                fiscal: {
                  ncm: '2710.19.32',
                  ncmDescription: 'Oleos lubrificantes derivados de petroleo.',
                  origin: '0 - Nacional',
                  cest: '06.007.00',
                  anpCode: '620501001',
                  taxClassification: 'Classificacao automatica pelo TaxCore',
                  taxCoreStatus: 'Classificacao fiscal validada',
                },
                cost: {
                  costSource: 'Manual',
                  currentCost: 100,
                  freightCost: 4,
                  insuranceCost: 0.5,
                  otherCosts: 1.5,
                },
                settings: {
                  participatesInPricing: true,
                  allowTaxSimulation: true,
                  monitorCostChanges: true,
                  alertBelowMinimumMargin: true,
                  defaultPricePolicy: 'Varejo padrao',
                  defaultSalesChannel: 'Balcao',
                  desiredMargin: 30,
                  minimumMargin: 20,
                },
                costHistory: [],
              }),
            save: () =>
              of({
                id: '55555555-5555-5555-5555-555555555555',
                internalCode: '000154',
                description: 'Oleo Motor Sintetico 5W30',
                status: 'Ativo',
                savedAt: '2026-09-21T10:24:00Z',
              }),
          },
        },
        {
          provide: PricingApiService,
          useValue: {
            getWorkspace: () =>
              of({
                product: {
                  id: '55555555-5555-5555-5555-555555555555',
                  name: 'Oleo Motor 5W30',
                  code: '000154',
                  status: 'Ativo',
                  ncm: '27101932',
                  brand: 'Shell',
                  category: 'Lubrificantes',
                },
                scenario: {
                  company: 'Empresa Alfa Ltda',
                  branch: 'Matriz - Caxias do Sul/RS',
                  selectedChannel: 'Balcao',
                  operationDate: '2026-09-21',
                },
                lastUpdate: {
                  updatedAt: '2026-09-21T10:24:00Z',
                  updatedBy: 'Eduardo Almeida',
                },
                channels: [
                  {
                    id: '44444444-4444-4444-4444-444444444441',
                    name: 'Balcao',
                    currentPrice: 159.9,
                    multiplier: 1,
                    status: 'Atualizado',
                  },
                ],
                calculationRequest: {
                  tenantId: '11111111-1111-1111-1111-111111111111',
                  companyId: '22222222-2222-2222-2222-222222222222',
                  establishmentId: '33333333-3333-3333-3333-333333333333',
                  productId: '55555555-5555-5555-5555-555555555555',
                  salesChannelId: '44444444-4444-4444-4444-444444444441',
                  operationDate: '2026-09-21',
                  originState: 'RS',
                  destinationState: 'RS',
                  destinationCityCode: 4305108,
                  ncm: '27101932',
                  manualAcquisitionCost: 100,
                  freightCost: 4,
                  insuranceCost: 0.5,
                  otherCosts: 1.5,
                  desiredMargin: 30,
                  minimumMargin: 22,
                  currentPrice: 159.9,
                  taxableBase: 159.9,
                  roundingType: 3,
                  costSource: 3,
                  expenses: [],
                },
              }),
            simulate: () =>
              of({
                formationId: '9601d4cd-c4fc-42c1-9dfb-454ed9f154be',
                status: 1,
                effectiveCost: 106,
                minimumPrice: 188.9,
                suggestedPrice: 212.06,
                targetPrice: 212.9,
                margin: 30.25,
                markup: 100.84,
                components: [],
              }),
          },
        },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render products page title', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Produtos');
  });
});
