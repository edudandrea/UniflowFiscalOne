import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CalculatePriceRequest,
  CalculatePriceResponse,
  PricingWorkspace,
} from '../models/pricing.models';

@Injectable({ providedIn: 'root' })
export class PricingApiService {
  private readonly baseUrl = 'http://localhost:5058/api/pricing';

  constructor(private readonly http: HttpClient) {}

  getWorkspace(productId: string): Observable<PricingWorkspace> {
    return this.http.get<PricingWorkspace>(`${this.baseUrl}/products/${productId}/workspace`);
  }

  simulate(request: CalculatePriceRequest): Observable<CalculatePriceResponse> {
    return this.http.post<CalculatePriceResponse>(`${this.baseUrl}/simulate`, request);
  }
}
