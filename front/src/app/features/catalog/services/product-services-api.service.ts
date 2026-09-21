import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ProductServiceDraft,
  ProductServiceListItem,
  SaveProductServiceRequest,
  SaveProductServiceResponse,
} from '../models/product-service.models';

@Injectable({ providedIn: 'root' })
export class ProductServicesApiService {
  private readonly baseUrl = 'http://localhost:5058/api/product-services';

  constructor(private readonly http: HttpClient) {}

  getProducts(): Observable<ProductServiceListItem[]> {
    return this.http.get<ProductServiceListItem[]>(this.baseUrl);
  }

  getDraft(): Observable<ProductServiceDraft> {
    return this.http.get<ProductServiceDraft>(`${this.baseUrl}/draft`);
  }

  save(request: SaveProductServiceRequest): Observable<SaveProductServiceResponse> {
    return this.http.post<SaveProductServiceResponse>(this.baseUrl, request);
  }
}
