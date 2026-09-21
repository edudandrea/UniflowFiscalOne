import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ContractingUserResponse {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cargo: string;
  empresaId: number;
  empresaNome: string;
  tipoAcesso: 'EmpresaAdmin' | 'UsuarioComum';
  modulosAcesso: string;
  ativo: boolean;
  criadoEm: string;
}

export interface SaveContractingUserRequest {
  empresaId: number;
  nome: string;
  email: string;
  telefone: string;
  cargo: string;
  tipoAcesso: 'EmpresaAdmin' | 'UsuarioComum';
  modulosAcesso: string[];
  enviarEmailBoasVindas: boolean;
}

@Injectable({ providedIn: 'root' })
export class ContractingUsersApiService {
  private readonly baseUrl = 'http://localhost:5058/api/contracting-users';

  constructor(private readonly http: HttpClient) {}

  getUsers(): Observable<ContractingUserResponse[]> {
    return this.http.get<ContractingUserResponse[]>(this.baseUrl);
  }

  create(request: SaveContractingUserRequest): Observable<ContractingUserResponse> {
    return this.http.post<ContractingUserResponse>(this.baseUrl, request);
  }
}
