import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ContractingCompanyResponse {
  id: number;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  inscricaoEstadual: string;
  inscricaoMunicipal: string;
  segmento: string;
  emailPrincipal: string;
  telefone: string;
  site: string;
  uf: string;
  plano: string;
  situacao: string;
  criadoEm: string;
}

export interface SaveContractingCompanyRequest {
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  inscricaoEstadual: string;
  inscricaoMunicipal: string;
  segmento: string;
  emailPrincipal: string;
  telefone: string;
  site: string;
  uf: string;
  plano: string;
  situacao: string;
}

@Injectable({ providedIn: 'root' })
export class ContractingCompaniesApiService {
  private readonly baseUrl = 'http://localhost:5058/api/contracting-companies';

  constructor(private readonly http: HttpClient) {}

  getCompanies(): Observable<ContractingCompanyResponse[]> {
    return this.http.get<ContractingCompanyResponse[]>(this.baseUrl);
  }

  create(request: SaveContractingCompanyRequest): Observable<ContractingCompanyResponse> {
    return this.http.post<ContractingCompanyResponse>(this.baseUrl, request);
  }
}
