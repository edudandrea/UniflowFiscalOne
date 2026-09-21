import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import {
  ContractingCompaniesApiService,
  ContractingCompanyResponse,
  SaveContractingCompanyRequest,
} from './services/contracting-companies-api.service';
import {
  ContractingUserResponse,
  ContractingUsersApiService,
  SaveContractingUserRequest,
} from './services/contracting-users-api.service';

type SaasModuleKey =
  | 'dashboard'
  | 'dados-empresariais'
  | 'empresas'
  | 'usuarios'
  | 'financeiro'
  | 'planos'
  | 'contratos'
  | 'cobrancas'
  | 'formas-pagamento'
  | 'notas-fiscais'
  | 'configuracoes-fiscais'
  | 'tickets'
  | 'auditoria';

interface SaasModule {
  id: SaasModuleKey;
  label: string;
  icon: string;
  description: string;
  group?: 'financeiro' | 'notas';
}

interface KpiCard {
  label: string;
  value: string;
  detail: string;
  tone: 'neutral' | 'ok' | 'warn' | 'danger';
}

interface TableRow {
  title: string;
  subtitle: string;
  meta: string;
  status: string;
  tone: 'neutral' | 'ok' | 'warn' | 'danger';
}

interface ModalField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'date' | 'select' | 'textarea';
  placeholder?: string;
  options?: string[];
}

interface ContractingCompany {
  id: number;
  icon: string;
  name: string;
  branch: string;
  cnpj: string;
  plan: string;
  users: number;
  status: 'Ativa' | 'Pendente' | 'Inadimplente';
  start: string;
}

interface CompanyForm {
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  inscricaoEstadual: string;
  inscricaoMunicipal: string;
  segmento: string;
  email: string;
  telefone: string;
  site: string;
  endereco: string;
  cidade: string;
  uf: string;
  responsavel: string;
  emailResponsavel: string;
  plano: string;
  situacao: string;
}

interface ContractingUser {
  id: number;
  initials: string;
  name: string;
  email: string;
  phone: string;
  role: 'EmpresaAdmin' | 'UsuarioComum';
  companyId: number;
  companyName: string;
  status: 'Ativo' | 'Inativo';
  modules: string[];
  createdAt: string;
}

interface UserForm {
  empresaId: number;
  nome: string;
  email: string;
  telefone: string;
  cargo: string;
  tipoAcesso: 'EmpresaAdmin' | 'UsuarioComum';
  modulosAcesso: string[];
  enviarEmailBoasVindas: boolean;
}

@Component({
  selector: 'app-saas-admin-page',
  imports: [FormsModule],
  template: `
    <main class="people-like-shell fiscal-admin-shell" [class.sidebar-collapsed]="sidebarCollapsed">
      <aside class="people-like-sidebar">
        <div class="people-like-brand">
          <button
            class="sidebar-collapse-button"
            type="button"
            aria-label="Expandir ou recolher menu lateral"
            [attr.aria-expanded]="!sidebarCollapsed"
            (click)="sidebarCollapsed = !sidebarCollapsed"
          >
            <span aria-hidden="true"></span>
          </button>
          <div>
            <span class="login-logo" role="img" aria-label="UniFlow FiscalOne"></span>
            <small>Backoffice SaaS</small>
          </div>
        </div>

        <nav class="people-like-nav" aria-label="Menu administrativo SaaS">
          <button
            type="button"
            [class.active]="activeModule === 'dashboard'"
            (click)="setModule('dashboard')"
          >
            <span class="nav-icon">VG</span>
            <span>Visao Geral</span>
          </button>

          <button
            type="button"
            [class.active]="activeModule === 'dados-empresariais'"
            (click)="setModule('dados-empresariais')"
          >
            <span class="nav-icon">DE</span>
            <span>Dados empresariais</span>
          </button>

          <button
            type="button"
            [class.active]="activeModule === 'empresas'"
            (click)="setModule('empresas')"
          >
            <span class="nav-icon">EM</span>
            <span>Empresas</span>
          </button>

          <button
            type="button"
            [class.active]="activeModule === 'usuarios'"
            (click)="setModule('usuarios')"
          >
            <span class="nav-icon">US</span>
            <span>Usuarios</span>
          </button>

          <div class="people-like-nav-group">
            <button
              class="nav-group-toggle"
              type="button"
              [class.active]="isFinanceModule"
              (click)="financeMenuOpen = !financeMenuOpen"
            >
              <span class="nav-icon">R$</span>
              <span>Financeiro</span>
              <b>{{ financeMenuOpen ? '^' : 'v' }}</b>
            </button>
            @if (financeMenuOpen) {
              <div class="people-like-subnav">
                @for (module of financeModules; track module.id) {
                  <button type="button" [class.active]="activeModule === module.id" (click)="setModule(module.id)">
                    <span class="nav-icon">{{ module.icon }}</span>
                    <span>{{ module.label }}</span>
                  </button>
                }
              </div>
            }
          </div>

          <div class="people-like-nav-group">
            <button
              class="nav-group-toggle"
              type="button"
              [class.active]="isFiscalModule"
              (click)="fiscalMenuOpen = !fiscalMenuOpen"
            >
              <span class="nav-icon">NF</span>
              <span>Notas fiscais</span>
              <b>{{ fiscalMenuOpen ? '^' : 'v' }}</b>
            </button>
            @if (fiscalMenuOpen) {
              <div class="people-like-subnav">
                @for (module of fiscalModules; track module.id) {
                  <button type="button" [class.active]="activeModule === module.id" (click)="setModule(module.id)">
                    <span class="nav-icon">{{ module.icon }}</span>
                    <span>{{ module.label }}</span>
                  </button>
                }
              </div>
            }
          </div>

          <button
            type="button"
            [class.active]="activeModule === 'tickets'"
            (click)="setModule('tickets')"
          >
            <span class="nav-icon">TD</span>
            <span>Tickets para o desenvolvedor</span>
          </button>

          <button
            type="button"
            [class.active]="activeModule === 'auditoria'"
            (click)="setModule('auditoria')"
          >
            <span class="nav-icon">AU</span>
            <span>Auditoria</span>
          </button>
        </nav>
      </aside>

      <section class="people-like-main">
        <header class="people-like-topbar">
          <button class="topbar-menu-button" type="button" (click)="sidebarCollapsed = !sidebarCollapsed" aria-label="Menu">
            <span aria-hidden="true"></span>
          </button>

          <div class="page-heading">
            <span class="eyebrow">UniFlow FiscalOne SaaS</span>
            <h1>{{ activeModuleMeta.label }}</h1>
            <p>{{ activeModuleMeta.description }}</p>
          </div>

          <label class="people-search">
            <span>Pesquisar</span>
            <input [(ngModel)]="searchTerm" name="saasSearch" placeholder="Empresa, usuario, contrato, ticket..." />
          </label>

          <div class="top-actions">
            <button type="button" class="soft" (click)="openModal('quick')">Acao rapida</button>
            <button type="button" class="user-chip" (click)="profileMenuOpen = !profileMenuOpen">
              <span class="avatar">SA</span>
              <span>
                <strong>Admin SaaS</strong>
                <small>SistemaAdmin</small>
              </span>
            </button>
            @if (profileMenuOpen) {
              <div class="people-dropdown">
                <button type="button" (click)="openModal('perfil')">Meu perfil</button>
                <button type="button" (click)="openModal('seguranca')">Seguranca</button>
                <button type="button" (click)="profileMenuOpen = false">Fechar menu</button>
              </div>
            }
          </div>
        </header>

        <section class="people-workspace">
          <nav class="page-tabs" aria-label="Abas da area">
            @for (tab of currentTabs; track tab) {
              <button type="button" [class.active]="activeTab === tab" (click)="activeTab = tab">
                <span></span>{{ tab }}
              </button>
            }
          </nav>

          @if (activeModule === 'dashboard') {
            <section class="admin-overview-hero">
              <div>
                <span>Fiscal Intelligence</span>
                <h2>Operacao SaaS, fiscal e financeira em uma unica visao.</h2>
                <p>Navy, teal e emerald aplicados como linguagem visual do FiscalOne.</p>
              </div>
              <div class="admin-overview-user">
                <strong>Administrador SaaS</strong>
                <small>Aguardando dados reais</small>
              </div>
            </section>
          }

          @if (activeModule === 'empresas') {
            <section class="companies-page">
              <div class="companies-breadcrumb">
                <span>Home</span>
                <b>></b>
                <strong>Empresas</strong>
              </div>

              <div class="companies-header">
                <div>
                  <h2>Empresas</h2>
                  <p>Gerencie as empresas que utilizam o UniFlowFiscalOne.</p>
                </div>
                <button type="button" class="companies-new-button" (click)="openCompanyModal()">+ Nova empresa</button>
              </div>

              <section class="companies-kpi-grid">
                @for (kpi of companyKpis; track kpi.label) {
                  <article class="companies-kpi-card">
                    <span class="companies-kpi-icon">{{ kpi.icon }}</span>
                    <div>
                      <strong>{{ kpi.value }}</strong>
                      <small>{{ kpi.label }}</small>
                    </div>
                    @if (kpi.delta) {
                      <em>{{ kpi.delta }}</em>
                    }
                  </article>
                }
              </section>

              <section class="companies-filters">
                <label>
                  <span>Buscar</span>
                  <input [(ngModel)]="companySearch" name="companySearch" placeholder="Buscar por nome, CNPJ ou responsavel..." />
                </label>
                <select [(ngModel)]="companyPlanFilter" name="companyPlanFilter" aria-label="Todos os planos">
                  <option>Todos os planos</option>
                  <option>Starter</option>
                  <option>Essencial</option>
                  <option>Professional</option>
                  <option>Estrategico</option>
                </select>
                <select [(ngModel)]="companyStatusFilter" name="companyStatusFilter" aria-label="Todas as situacoes">
                  <option>Todas as situacoes</option>
                  <option>Ativa</option>
                  <option>Pendente</option>
                  <option>Inadimplente</option>
                </select>
                <button type="button" class="companies-clear-filter" (click)="clearCompanyFilters()">Limpar filtros</button>
              </section>

              <div class="companies-table-wrap">
                <div class="companies-table">
                  <div class="companies-table-row companies-table-head">
                    <span>Razao Social</span>
                    <span>CNPJ</span>
                    <span>Plano</span>
                    <span>Usuarios</span>
                    <span>Situacao</span>
                    <span>Inicio</span>
                  </div>
                  @if (loadingCompanies) {
                    <div class="companies-empty-state">
                      <strong>Carregando empresas</strong>
                      <span>Buscando registros cadastrados no backend.</span>
                    </div>
                  } @else {
                    @for (company of filteredCompanies; track company.id) {
                      <div class="companies-table-row">
                        <div class="company-name-cell">
                          <span class="company-avatar">{{ company.icon }}</span>
                          <div>
                            <strong>{{ company.name }}</strong>
                            <small>{{ company.branch }}</small>
                          </div>
                        </div>
                        <span>{{ company.cnpj }}</span>
                        <span>{{ company.plan }}</span>
                        <span>{{ companyUserCount(company.id) }}</span>
                        <em [class]="'company-status ' + statusClass(company.status)">{{ company.status }}</em>
                        <span>{{ company.start }}</span>
                      </div>
                    } @empty {
                      <div class="companies-empty-state">
                        <strong>Nenhuma empresa cadastrada</strong>
                        <span>Use o botao Nova empresa para iniciar os testes com dados reais.</span>
                      </div>
                    }
                  }
                </div>
              </div>
            </section>
          } @else if (activeModule === 'usuarios') {
            <section class="companies-page users-page">
              <div class="companies-breadcrumb">
                <span>Home</span>
                <b>></b>
                <strong>Usuarios</strong>
              </div>

              <div class="companies-header">
                <div>
                  <h2>Usuarios</h2>
                  <p>Gerencie os usuarios vinculados as empresas contratantes.</p>
                </div>
                <button type="button" class="companies-new-button" (click)="openUserModal()">+ Novo usuario</button>
              </div>

              <section class="companies-kpi-grid">
                @for (kpi of userKpis; track kpi.label) {
                  <article class="companies-kpi-card">
                    <span class="companies-kpi-icon">{{ kpi.icon }}</span>
                    <div>
                      <strong>{{ kpi.value }}</strong>
                      <small>{{ kpi.label }}</small>
                    </div>
                  </article>
                }
              </section>

              <section class="companies-filters">
                <label>
                  <span>Buscar</span>
                  <input [(ngModel)]="userSearch" name="userSearch" placeholder="Buscar por nome, e-mail ou empresa..." />
                </label>
                <select [(ngModel)]="userCompanyFilter" name="userCompanyFilter" aria-label="Todas as empresas">
                  <option [ngValue]="0">Todas as empresas</option>
                  @for (company of companies; track company.id) {
                    <option [ngValue]="company.id">{{ company.name }}</option>
                  }
                </select>
                <select [(ngModel)]="userRoleFilter" name="userRoleFilter" aria-label="Todos os perfis">
                  <option>Todos os perfis</option>
                  <option>EmpresaAdmin</option>
                  <option>UsuarioComum</option>
                </select>
                <button type="button" class="companies-clear-filter" (click)="clearUserFilters()">Limpar filtros</button>
              </section>

              <div class="companies-table-wrap">
                <div class="companies-table users-table">
                  <div class="companies-table-row users-table-row companies-table-head">
                    <span>Usuario</span>
                    <span>Empresa</span>
                    <span>Perfil</span>
                    <span>Modulos</span>
                    <span>Status</span>
                    <span>Criado em</span>
                  </div>
                  @if (loadingUsers) {
                    <div class="companies-empty-state">
                      <strong>Carregando usuarios</strong>
                      <span>Buscando registros cadastrados no backend.</span>
                    </div>
                  } @else {
                    @for (user of filteredUsers; track user.id) {
                      <div class="companies-table-row users-table-row">
                        <div class="company-name-cell">
                          <span class="company-avatar">{{ user.initials }}</span>
                          <div>
                            <strong>{{ user.name }}</strong>
                            <small>{{ user.email }}</small>
                          </div>
                        </div>
                        <span>{{ user.companyName }}</span>
                        <span>{{ user.role === 'EmpresaAdmin' ? 'Administrador da Empresa' : 'Usuario Comum' }}</span>
                        <span>{{ user.modules.length ? user.modules.length + ' modulos' : '-' }}</span>
                        <em class="company-status active">{{ user.status }}</em>
                        <span>{{ user.createdAt }}</span>
                      </div>
                    } @empty {
                      <div class="companies-empty-state">
                        <strong>Nenhum usuario cadastrado</strong>
                        <span>Use o botao Novo usuario para criar acessos reais vinculados as empresas.</span>
                      </div>
                    }
                  }
                </div>
              </div>
            </section>
          } @else {
            <section class="admin-kpi-grid">
              @for (kpi of currentKpis; track kpi.label) {
                <article [class]="'admin-kpi ' + kpi.tone">
                  <span>{{ kpi.label }}</span>
                  <strong>{{ kpi.value }}</strong>
                  <small>{{ kpi.detail }}</small>
                </article>
              }
            </section>

            <section class="dashboard-card module-card">
              <div class="panel-title">
                <div>
                  <span>{{ activeTab }}</span>
                  <h2>{{ activeModuleMeta.label }}</h2>
                  <p>{{ activeModuleMeta.description }}</p>
                </div>
                <div class="module-toolbar">
                  <button type="button" class="soft" (click)="openModal('filtros')">Filtros</button>
                  <button type="button" class="soft" (click)="openModal('exportar')">Exportar</button>
                  <button type="button" (click)="openModal(activeModule)">Novo registro</button>
                </div>
              </div>

              @if (activeModule === 'dados-empresariais') {
                <div class="company-detail-grid">
                  <article>
                    <span>Razao social</span>
                    <strong>Nao cadastrado</strong>
                    <small>Informe os dados da empresa fornecedora</small>
                  </article>
                  <article>
                    <span>CNPJ</span>
                    <strong>Nao cadastrado</strong>
                    <small>Aguardando cadastro real</small>
                  </article>
                  <article>
                    <span>Regime</span>
                    <strong>Nao definido</strong>
                    <small>Configuracao fiscal pendente</small>
                  </article>
                </div>
              } @else if (activeModule === 'tickets') {
                <div class="ticket-board">
                  @for (column of ticketColumns; track column.title) {
                    <section>
                      <h3>{{ column.title }}</h3>
                      @for (ticket of column.items; track ticket) {
                        <button type="button" class="ticket-kanban-card" (click)="openModal('ticket')">
                          <strong>{{ ticket }}</strong>
                          <span>Prioridade media</span>
                        </button>
                      } @empty {
                        <div class="module-empty-state compact">Nenhum ticket</div>
                      }
                    </section>
                  }
                </div>
              } @else {
                <div class="people-table">
                  <div class="people-table-row head">
                    <span>Registro</span>
                    <span>Detalhe</span>
                    <span>Referencia</span>
                    <span>Status</span>
                    <span>Acoes</span>
                  </div>
                  @for (row of currentRows; track row.title) {
                    <div class="people-table-row">
                      <strong>{{ row.title }}</strong>
                      <span>{{ row.subtitle }}</span>
                      <span>{{ row.meta }}</span>
                      <em [class]="row.tone">{{ row.status }}</em>
                      <button type="button" class="soft" (click)="openModal(activeModule)">Abrir</button>
                    </div>
                  } @empty {
                    <div class="module-empty-state">
                      <strong>Nenhum registro encontrado</strong>
                      <span>Cadastre dados reais para iniciar os testes deste modulo.</span>
                    </div>
                  }
                </div>
              }
            </section>
          }
        </section>
      </section>

      @if (modalOpen) {
        <section class="modal-backdrop fiscal-shell-modal-backdrop" (click)="closeModal()">
          <form class="modal-card pop fiscal-shell-modal" (ngSubmit)="saveModal()" (click)="$event.stopPropagation()">
            <header class="modal-head">
              <div>
                <span class="eyebrow">{{ modalEyebrow }}</span>
                <h3>{{ modalTitle }}</h3>
                <p>{{ modalDescription }}</p>
              </div>
              <button class="modal-close-button" type="button" (click)="closeModal()">x</button>
            </header>

            <div class="form-grid cols-2 no-margin">
              @for (field of modalFields; track field.name) {
                <label [class.span-all]="field.type === 'textarea'">
                  {{ field.label }}
                  @if (field.type === 'select') {
                    <select [(ngModel)]="modalForm[field.name]" [name]="field.name">
                      @for (option of field.options ?? []; track option) {
                        <option [value]="option">{{ option }}</option>
                      }
                    </select>
                  } @else if (field.type === 'textarea') {
                    <textarea [(ngModel)]="modalForm[field.name]" [name]="field.name" [placeholder]="field.placeholder"></textarea>
                  } @else {
                    <input [(ngModel)]="modalForm[field.name]" [name]="field.name" [type]="field.type" [placeholder]="field.placeholder" />
                  }
                </label>
              }
            </div>

            <div class="modal-actions">
              <button type="button" class="soft" (click)="closeModal()">Cancelar</button>
              <button type="submit">Salvar</button>
            </div>
          </form>
        </section>
      }

      @if (companyModalOpen) {
        <section class="modal-backdrop fiscal-shell-modal-backdrop" (click)="closeCompanyModal()">
          <form class="modal-card pop fiscal-shell-modal company-modal" (ngSubmit)="saveCompany()" (click)="$event.stopPropagation()">
            <header class="modal-head">
              <div>
                <h3>Nova Empresa</h3>
                <p>Cadastre as informacoes da empresa contratante.</p>
              </div>
              <button class="modal-close-button" type="button" (click)="closeCompanyModal()">x</button>
            </header>

            <nav class="company-modal-tabs" aria-label="Etapas do cadastro da empresa">
              @for (tab of companyModalTabs; track tab) {
                <button type="button" [class.active]="companyModalTab === tab" (click)="companyModalTab = tab">{{ tab }}</button>
              }
            </nav>

            @if (companyModalTab === 'Dados Gerais') {
              <div class="company-form-grid">
                <label>
                  Razao Social *
                  <input [(ngModel)]="companyForm.razaoSocial" name="razaoSocial" required placeholder="Digite a razao social" />
                </label>
                <label>
                  Nome Fantasia
                  <input [(ngModel)]="companyForm.nomeFantasia" name="nomeFantasia" placeholder="Digite o nome fantasia" />
                </label>
                <label>
                  CNPJ *
                  <span class="cnpj-field">
                    <input [(ngModel)]="companyForm.cnpj" name="cnpj" required placeholder="00.000.000/0000-00" />
                    <button type="button" aria-label="Buscar CNPJ">Q</button>
                  </span>
                </label>
                <label>
                  Inscricao Estadual
                  <input [(ngModel)]="companyForm.inscricaoEstadual" name="inscricaoEstadual" placeholder="Digite a inscricao estadual" />
                </label>
                <label>
                  Inscricao Municipal
                  <input [(ngModel)]="companyForm.inscricaoMunicipal" name="inscricaoMunicipal" placeholder="Digite a inscricao municipal" />
                </label>
                <label>
                  Segmento
                  <select [(ngModel)]="companyForm.segmento" name="segmento">
                    <option value="">Selecione o segmento</option>
                    <option>Industria</option>
                    <option>Comercio</option>
                    <option>Servicos</option>
                    <option>Tecnologia</option>
                  </select>
                </label>
                <label>
                  E-mail Principal *
                  <input [(ngModel)]="companyForm.email" name="emailEmpresa" type="email" required placeholder="contato@empresa.com.br" />
                </label>
                <label>
                  Telefone
                  <span class="phone-field">
                    <b>BR</b>
                    <input [(ngModel)]="companyForm.telefone" name="telefoneEmpresa" placeholder="(54) 99999-9999" />
                  </span>
                </label>
                <label class="span-all">
                  Site
                  <input [(ngModel)]="companyForm.site" name="siteEmpresa" placeholder="https://www.empresa.com.br" />
                </label>
                <label class="span-all">
                  Logo da Empresa
                  <button type="button" class="company-upload-box">
                    <strong>Enviar</strong>
                    <span>Clique para enviar ou arraste um arquivo</span>
                    <small>PNG, JPG ou SVG (max. 2MB)</small>
                  </button>
                </label>
              </div>
            } @else if (companyModalTab === 'Endereco') {
              <div class="company-form-grid">
                <label class="span-all">Endereco <input [(ngModel)]="companyForm.endereco" name="enderecoEmpresa" placeholder="Rua, numero e complemento" /></label>
                <label>Cidade <input [(ngModel)]="companyForm.cidade" name="cidadeEmpresa" placeholder="Cidade" /></label>
                <label>UF <input [(ngModel)]="companyForm.uf" name="ufEmpresa" placeholder="UF" maxlength="2" /></label>
              </div>
            } @else if (companyModalTab === 'Contato') {
              <div class="company-form-grid">
                <label>Responsavel <input [(ngModel)]="companyForm.responsavel" name="responsavelEmpresa" placeholder="Nome do responsavel" /></label>
                <label>E-mail do responsavel <input [(ngModel)]="companyForm.emailResponsavel" name="emailResponsavel" type="email" placeholder="responsavel@empresa.com.br" /></label>
              </div>
            } @else {
              <div class="company-form-grid">
                <label>Plano
                  <select [(ngModel)]="companyForm.plano" name="planoEmpresa">
                    <option>Starter</option>
                    <option>Essencial</option>
                    <option>Professional</option>
                    <option>Estrategico</option>
                  </select>
                </label>
                <label>Situacao
                  <select [(ngModel)]="companyForm.situacao" name="situacaoEmpresa">
                    <option>Ativa</option>
                    <option>Pendente</option>
                    <option>Inadimplente</option>
                  </select>
                </label>
              </div>
            }

            <div class="company-modal-actions">
              <button type="button" class="soft" (click)="closeCompanyModal()">Cancelar</button>
              <button type="submit" [disabled]="savingCompany">{{ savingCompany ? 'Salvando...' : 'Salvar empresa' }}</button>
            </div>
          </form>
        </section>
      }

      @if (userModalOpen) {
        <section class="modal-backdrop fiscal-shell-modal-backdrop" (click)="closeUserModal()">
          <form class="modal-card pop fiscal-shell-modal user-admin-modal" (ngSubmit)="saveUser()" (click)="$event.stopPropagation()">
            <header class="modal-head user-modal-head">
              <span class="user-modal-icon">U+</span>
              <div>
                <h3>Novo Usuario Administrador</h3>
                <p>Crie um usuario administrador para a empresa contratante.</p>
              </div>
              <button class="modal-close-button" type="button" (click)="closeUserModal()">x</button>
            </header>

            <section class="user-modal-section">
              <h4><span>1.</span> Informacoes do Usuario</h4>
              <div class="company-form-grid user-form-grid">
                <label>
                  Nome completo *
                  <input [(ngModel)]="userForm.nome" name="userNome" required placeholder="Digite o nome completo" />
                </label>
                <label>
                  E-mail *
                  <input [(ngModel)]="userForm.email" name="userEmail" type="email" required placeholder="usuario@empresa.com.br" />
                </label>
                <label>
                  Telefone
                  <input [(ngModel)]="userForm.telefone" name="userTelefone" placeholder="(54) 99999-9999" />
                </label>
                <label>
                  Cargo
                  <input [(ngModel)]="userForm.cargo" name="userCargo" placeholder="Ex: Diretor, Gerente, Proprietario" />
                </label>
                <label class="span-all">
                  Empresa contratante *
                  <select [(ngModel)]="userForm.empresaId" name="userEmpresaId" required>
                    <option [ngValue]="0">Selecione a empresa contratante</option>
                    @for (company of companies; track company.id) {
                      <option [ngValue]="company.id">{{ company.name }}</option>
                    }
                  </select>
                </label>
              </div>
            </section>

            <section class="user-modal-section">
              <h4><span>2.</span> Permissoes e Acesso</h4>
              <p>Tipo de acesso *</p>
              <div class="access-type-grid">
                <label [class.active]="userForm.tipoAcesso === 'EmpresaAdmin'">
                  <input type="radio" name="tipoAcesso" value="EmpresaAdmin" [(ngModel)]="userForm.tipoAcesso" />
                  <span class="access-icon">ADM</span>
                  <strong>Administrador da Empresa</strong>
                  <small>Acessa todos os modulos contratados, usuarios e configuracoes da empresa.</small>
                </label>
                <label [class.active]="userForm.tipoAcesso === 'UsuarioComum'">
                  <input type="radio" name="tipoAcesso" value="UsuarioComum" [(ngModel)]="userForm.tipoAcesso" />
                  <span class="access-icon">US</span>
                  <strong>Usuario Comum</strong>
                  <small>Acessa apenas os modulos liberados conforme o perfil.</small>
                </label>
              </div>
            </section>

            <section class="user-modal-section">
              <h4><span>3.</span> Modulos de Acesso</h4>
              <p>Selecione os modulos que o usuario tera acesso:</p>
              <div class="modules-check-grid">
                @for (module of userAccessModules; track module) {
                  <label>
                    <input
                      type="checkbox"
                      [checked]="userForm.modulosAcesso.includes(module)"
                      (change)="toggleUserModule(module, $any($event.target).checked)"
                    />
                    <span>{{ module }}</span>
                  </label>
                }
              </div>
            </section>

            <label class="welcome-toggle">
              <input type="checkbox" [(ngModel)]="userForm.enviarEmailBoasVindas" name="enviarEmailBoasVindas" />
              <span></span>
              <strong>Enviar e-mail de boas-vindas</strong>
              <small>O usuario recebera um e-mail com as instrucoes de acesso.</small>
            </label>

            <div class="company-modal-actions">
              <button type="button" class="soft" (click)="closeUserModal()">Cancelar</button>
              <button type="submit" [disabled]="savingUser">{{ savingUser ? 'Criando...' : 'Criar usuario' }}</button>
            </div>
          </form>
        </section>
      }
    </main>
  `,
})
export class SaasAdminPageComponent implements OnInit {
  protected activeModule: SaasModuleKey = 'dashboard';
  protected activeTab = 'Resumo';
  protected searchTerm = '';
  protected sidebarCollapsed = false;
  protected financeMenuOpen = true;
  protected fiscalMenuOpen = false;
  protected profileMenuOpen = false;
  protected modalOpen = false;
  protected companyModalOpen = false;
  protected userModalOpen = false;
  protected companyModalTab = 'Dados Gerais';
  protected companySearch = '';
  protected companyPlanFilter = 'Todos os planos';
  protected companyStatusFilter = 'Todas as situacoes';
  protected userSearch = '';
  protected userCompanyFilter = 0;
  protected userRoleFilter = 'Todos os perfis';
  protected loadingCompanies = false;
  protected loadingUsers = false;
  protected savingCompany = false;
  protected savingUser = false;
  protected modalContext: string = '';
  protected modalForm: Record<string, string | number> = {};
  protected companyForm: CompanyForm = {
    razaoSocial: '',
    nomeFantasia: '',
    cnpj: '',
    inscricaoEstadual: '',
    inscricaoMunicipal: '',
    segmento: '',
    email: '',
    telefone: '',
    site: '',
    endereco: '',
    cidade: '',
    uf: '',
    responsavel: '',
    emailResponsavel: '',
    plano: 'Professional',
    situacao: 'Ativa',
  };
  protected userForm: UserForm = {
    empresaId: 0,
    nome: '',
    email: '',
    telefone: '',
    cargo: '',
    tipoAcesso: 'EmpresaAdmin',
    modulosAcesso: [
      'Todos os modulos',
      'Tributos e Calculos',
      'Produtos e NCM',
      'Formacao de Preco',
      'Documentos Fiscais',
      'Relatorios',
      'Cadastros',
      'Integracoes',
      'Configuracoes',
    ],
    enviarEmailBoasVindas: true,
  };

  protected readonly modules: SaasModule[] = [
    { id: 'dashboard', label: 'Visao Geral', icon: 'VG', description: 'Indicadores executivos da operacao SaaS' },
    { id: 'dados-empresariais', label: 'Dados empresariais', icon: 'DE', description: 'Empresa fornecedora do sistema' },
    { id: 'empresas', label: 'Empresas', icon: 'EM', description: 'Clientes que utilizam a plataforma' },
    { id: 'usuarios', label: 'Usuarios', icon: 'US', description: 'Acessos, perfis e permissoes' },
    { id: 'financeiro', label: 'Visao financeira', icon: 'VF', description: 'Receita, inadimplencia e fluxo financeiro', group: 'financeiro' },
    { id: 'planos', label: 'Planos', icon: 'PL', description: 'Planos comerciais do SaaS', group: 'financeiro' },
    { id: 'contratos', label: 'Contratos', icon: 'CT', description: 'Contratos e vigencias', group: 'financeiro' },
    { id: 'cobrancas', label: 'Cobrancas', icon: 'CB', description: 'Mensalidades, recorrencias e vencimentos', group: 'financeiro' },
    { id: 'formas-pagamento', label: 'Formas de pagamento', icon: 'FP', description: 'PIX, boleto e cartao', group: 'financeiro' },
    { id: 'notas-fiscais', label: 'Notas fiscais', icon: 'NF', description: 'Emissao e acompanhamento de NFS-e', group: 'notas' },
    { id: 'configuracoes-fiscais', label: 'Configuracoes fiscais', icon: 'CF', description: 'Prestador, certificado e tributacao', group: 'notas' },
    { id: 'tickets', label: 'Tickets para o desenvolvedor', icon: 'TD', description: 'Solicitacoes tecnicas e evolucoes do produto' },
    { id: 'auditoria', label: 'Auditoria', icon: 'AU', description: 'Logs de acesso e alteracoes sensiveis' },
  ];

  protected readonly rowsByModule: Partial<Record<SaasModuleKey, TableRow[]>> = {};

  protected readonly ticketColumns = [
    { title: 'Aberto', items: [] },
    { title: 'Em analise', items: [] },
    { title: 'Concluido', items: [] },
  ];

  protected readonly companyModalTabs = ['Dados Gerais', 'Endereco', 'Contato', 'Plano e Configuracoes'];
  protected readonly userAccessModules = [
    'Todos os modulos',
    'Tributos e Calculos',
    'Produtos e NCM',
    'Formacao de Preco',
    'Documentos Fiscais',
    'Relatorios',
    'Cadastros',
    'Integracoes',
    'Configuracoes',
  ];

  protected companies: ContractingCompany[] = [];
  protected users: ContractingUser[] = [];

  constructor(
    private readonly companiesApi: ContractingCompaniesApiService,
    private readonly usersApi: ContractingUsersApiService,
  ) {}

  ngOnInit(): void {
    this.loadCompanies();
    this.loadUsers();
  }

  protected get financeModules(): SaasModule[] {
    return this.modules.filter((module) => module.group === 'financeiro');
  }

  protected get fiscalModules(): SaasModule[] {
    return this.modules.filter((module) => module.group === 'notas');
  }

  protected get activeModuleMeta(): SaasModule {
    return this.modules.find((module) => module.id === this.activeModule) ?? this.modules[0];
  }

  protected get isFinanceModule(): boolean {
    return this.activeModuleMeta.group === 'financeiro';
  }

  protected get isFiscalModule(): boolean {
    return this.activeModuleMeta.group === 'notas';
  }

  protected get currentTabs(): string[] {
    if (this.activeModule === 'dashboard') return ['Resumo', 'Comercial', 'Financeiro', 'Tecnico'];
    if (this.activeModule === 'tickets') return ['Kanban', 'Pesquisa', 'Dados do ticket'];
    if (this.activeModule === 'dados-empresariais') return ['Dados cadastrais', 'Fiscal', 'Certificados'];
    return ['Pesquisa', 'Dados', 'Historico'];
  }

  protected get currentKpis(): KpiCard[] {
    if (this.activeModule === 'financeiro' || this.isFinanceModule) {
      return [
        { label: 'MRR', value: 'R$ 0,00', detail: 'Sem dados cadastrados', tone: 'neutral' },
        { label: 'Inadimplencia', value: 'R$ 0,00', detail: 'Sem dados cadastrados', tone: 'neutral' },
        { label: 'A receber', value: 'R$ 0,00', detail: 'Sem dados cadastrados', tone: 'neutral' },
      ];
    }

    if (this.activeModule === 'tickets') {
      return [
        { label: 'Abertos', value: '0', detail: 'Sem tickets cadastrados', tone: 'neutral' },
        { label: 'Em analise', value: '0', detail: 'Sem tickets cadastrados', tone: 'neutral' },
        { label: 'Resolvidos', value: '0', detail: 'Sem tickets cadastrados', tone: 'neutral' },
      ];
    }

    return [
      { label: 'Empresas ativas', value: '0', detail: 'Sem dados cadastrados', tone: 'neutral' },
      { label: 'Usuarios SaaS', value: '0', detail: 'Sem dados cadastrados', tone: 'neutral' },
      { label: 'Alertas fiscais', value: '0', detail: 'Sem dados cadastrados', tone: 'neutral' },
    ];
  }

  protected get currentRows(): TableRow[] {
    return this.rowsByModule[this.activeModule] ?? [];
  }

  protected get companyKpis() {
    const activeCompanies = this.companies.filter((company) => company.status === 'Ativa').length;
    const activePlans = new Set(this.companies.map((company) => company.plan).filter(Boolean)).size;

    return [
      { icon: 'EM', value: String(activeCompanies), label: 'Empresas ativas', delta: '' },
      { icon: 'US', value: String(this.users.length), label: 'Usuarios totais', delta: '' },
      { icon: 'PL', value: String(activePlans), label: 'Planos ativos', delta: '' },
      { icon: 'R$', value: 'R$ 0,00', label: 'MRR', delta: '' },
    ];
  }

  protected get userKpis() {
    const activeUsers = this.users.filter((user) => user.status === 'Ativo').length;
    const companyAdmins = this.users.filter((user) => user.role === 'EmpresaAdmin').length;
    const linkedCompanies = new Set(this.users.map((user) => user.companyId).filter(Boolean)).size;

    return [
      { icon: 'US', value: String(activeUsers), label: 'Usuarios ativos' },
      { icon: 'AD', value: String(companyAdmins), label: 'Admins de empresa' },
      { icon: 'EM', value: String(linkedCompanies), label: 'Empresas com usuarios' },
      { icon: 'ML', value: '0', label: 'Convites pendentes' },
    ];
  }

  protected get filteredCompanies(): ContractingCompany[] {
    const search = this.companySearch.trim().toLowerCase();

    return this.companies.filter((company) => {
      const matchesSearch =
        !search ||
        company.name.toLowerCase().includes(search) ||
        company.cnpj.toLowerCase().includes(search) ||
        company.branch.toLowerCase().includes(search);
      const matchesPlan = this.companyPlanFilter === 'Todos os planos' || company.plan === this.companyPlanFilter;
      const matchesStatus = this.companyStatusFilter === 'Todas as situacoes' || company.status === this.companyStatusFilter;

      return matchesSearch && matchesPlan && matchesStatus;
    });
  }

  protected get filteredUsers(): ContractingUser[] {
    const search = this.userSearch.trim().toLowerCase();

    return this.users.filter((user) => {
      const matchesSearch =
        !search ||
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.companyName.toLowerCase().includes(search);
      const matchesCompany = !this.userCompanyFilter || user.companyId === this.userCompanyFilter;
      const matchesRole = this.userRoleFilter === 'Todos os perfis' || user.role === this.userRoleFilter;

      return matchesSearch && matchesCompany && matchesRole;
    });
  }

  protected get modalEyebrow(): string {
    return this.modalContext === 'ticket' ? 'Atendimento tecnico' : 'Cadastro SaaS';
  }

  protected get modalTitle(): string {
    if (this.modalContext === 'perfil') return 'Meu perfil';
    if (this.modalContext === 'seguranca') return 'Seguranca da conta';
    if (this.modalContext === 'ticket') return 'Ticket para o desenvolvedor';
    if (this.modalContext === 'quick') return 'Acao rapida';
    return `Novo registro - ${this.activeModuleMeta.label}`;
  }

  protected get modalDescription(): string {
    return 'Preencha os dados principais. A persistencia sera conectada aos endpoints do FiscalOne na proxima etapa.';
  }

  protected get modalFields(): ModalField[] {
    if (this.modalContext === 'ticket' || this.activeModule === 'tickets') {
      return [
        { name: 'titulo', label: 'Titulo', type: 'text', placeholder: 'Resumo do chamado' },
        { name: 'prioridade', label: 'Prioridade', type: 'select', options: ['Baixa', 'Media', 'Alta', 'Critica'] },
        { name: 'descricao', label: 'Descricao', type: 'textarea', placeholder: 'Descreva a solicitacao tecnica' },
      ];
    }

    if (this.activeModule === 'usuarios' || this.modalContext === 'perfil') {
      return [
        { name: 'nome', label: 'Nome', type: 'text' },
        { name: 'login', label: 'Login', type: 'text' },
        { name: 'email', label: 'E-mail', type: 'email' },
        { name: 'perfil', label: 'Perfil', type: 'select', options: ['SistemaAdmin', 'EmpresaAdmin', 'Fiscal', 'Financeiro'] },
      ];
    }

    if (this.activeModule === 'cobrancas' || this.activeModule === 'financeiro') {
      return [
        { name: 'empresa', label: 'Empresa', type: 'text' },
        { name: 'valor', label: 'Valor', type: 'number' },
        { name: 'vencimento', label: 'Vencimento', type: 'date' },
        { name: 'status', label: 'Status', type: 'select', options: ['Pendente', 'Paga', 'Vencida', 'Cancelada'] },
      ];
    }

    return [
      { name: 'nome', label: 'Nome', type: 'text' },
      { name: 'referencia', label: 'Referencia', type: 'text' },
      { name: 'status', label: 'Status', type: 'select', options: ['Ativo', 'Pendente', 'Inativo'] },
      { name: 'observacoes', label: 'Observacoes', type: 'textarea' },
    ];
  }

  protected setModule(module: SaasModuleKey): void {
    this.activeModule = module;
    this.activeTab = this.currentTabs[0];
    if (this.isFinanceModule) this.financeMenuOpen = true;
    if (this.isFiscalModule) this.fiscalMenuOpen = true;
  }

  protected openModal(context: string): void {
    if (context === 'usuarios') {
      this.openUserModal();
      return;
    }

    this.modalContext = context;
    this.modalForm = {};
    this.modalOpen = true;
    this.profileMenuOpen = false;
  }

  protected closeModal(): void {
    this.modalOpen = false;
  }

  protected saveModal(): void {
    this.modalOpen = false;
  }

  protected clearCompanyFilters(): void {
    this.companySearch = '';
    this.companyPlanFilter = 'Todos os planos';
    this.companyStatusFilter = 'Todas as situacoes';
  }

  protected clearUserFilters(): void {
    this.userSearch = '';
    this.userCompanyFilter = 0;
    this.userRoleFilter = 'Todos os perfis';
  }

  protected statusClass(status: ContractingCompany['status']): string {
    if (status === 'Ativa') return 'active';
    if (status === 'Pendente') return 'pending';
    return 'overdue';
  }

  protected companyUserCount(companyId: number): number {
    return this.users.filter((user) => user.companyId === companyId).length;
  }

  protected openCompanyModal(): void {
    this.companyModalTab = 'Dados Gerais';
    this.companyModalOpen = true;
  }

  protected closeCompanyModal(): void {
    this.companyModalOpen = false;
  }

  protected openUserModal(): void {
    if (!this.companies.length) {
      void Swal.fire({
        title: 'Cadastre uma empresa primeiro',
        text: 'Para criar um usuario administrador, e necessario ter ao menos uma empresa contratante cadastrada.',
        icon: 'warning',
        confirmButtonColor: '#0aa39a',
      });
      return;
    }

    this.userForm.empresaId = this.userCompanyFilter || this.companies[0].id;
    this.userModalOpen = true;
  }

  protected closeUserModal(): void {
    this.userModalOpen = false;
  }

  protected toggleUserModule(module: string, checked: boolean): void {
    if (module === 'Todos os modulos') {
      this.userForm.modulosAcesso = checked ? [...this.userAccessModules] : [];
      return;
    }

    const modules = new Set(this.userForm.modulosAcesso.filter((item) => item !== 'Todos os modulos'));
    if (checked) {
      modules.add(module);
    } else {
      modules.delete(module);
    }

    const selected = [...modules];
    this.userForm.modulosAcesso =
      selected.length === this.userAccessModules.length - 1 ? [...this.userAccessModules] : selected;
  }

  protected saveCompany(): void {
    if (!this.companyForm.razaoSocial.trim() || !this.companyForm.cnpj.trim() || !this.companyForm.email.trim()) {
      void Swal.fire({
        title: 'Campos obrigatorios',
        text: 'Informe razao social, CNPJ e e-mail principal para cadastrar a empresa.',
        icon: 'warning',
        confirmButtonColor: '#0aa39a',
      });
      this.companyModalTab = 'Dados Gerais';
      return;
    }

    this.savingCompany = true;
    void Swal.fire({
      title: 'Salvando empresa',
      text: 'Enviando cadastro para o backend.',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    this.companiesApi.create(this.buildCompanyRequest()).subscribe({
      next: (company) => {
        this.savingCompany = false;
        this.companyModalOpen = false;
        this.companies = [this.mapCompany(company), ...this.companies.filter((item) => item.id !== company.id)];
        this.resetCompanyForm();

        void Swal.fire({
          title: 'Empresa cadastrada',
          text: 'A empresa contratante foi cadastrada com sucesso.',
          icon: 'success',
          confirmButtonColor: '#0aa39a',
        });
      },
      error: (error) => {
        this.savingCompany = false;
        void Swal.fire({
          title: 'Nao foi possivel salvar',
          text: error?.error?.error ?? 'Verifique se o backend esta ativo e tente novamente.',
          icon: 'error',
          confirmButtonColor: '#0aa39a',
        });
      },
    });
  }

  protected saveUser(): void {
    if (!this.userForm.nome.trim() || !this.userForm.email.trim() || !this.userForm.empresaId) {
      void Swal.fire({
        title: 'Campos obrigatorios',
        text: 'Informe nome, e-mail e empresa contratante para criar o usuario.',
        icon: 'warning',
        confirmButtonColor: '#0aa39a',
      });
      return;
    }

    this.savingUser = true;
    void Swal.fire({
      title: 'Criando usuario',
      text: 'Vinculando usuario a empresa contratante.',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    this.usersApi.create(this.buildUserRequest()).subscribe({
      next: (user) => {
        this.savingUser = false;
        this.userModalOpen = false;
        this.users = [this.mapUser(user), ...this.users.filter((item) => item.id !== user.id)];
        this.resetUserForm();

        void Swal.fire({
          title: 'Usuario criado',
          text: 'O usuario foi criado e vinculado a empresa contratante.',
          icon: 'success',
          confirmButtonColor: '#0aa39a',
        });
      },
      error: (error) => {
        this.savingUser = false;
        void Swal.fire({
          title: 'Nao foi possivel criar',
          text: error?.error?.error ?? 'Verifique se o backend esta ativo e tente novamente.',
          icon: 'error',
          confirmButtonColor: '#0aa39a',
        });
      },
    });
  }

  private loadCompanies(): void {
    this.loadingCompanies = true;
    this.companiesApi.getCompanies().subscribe({
      next: (companies) => {
        this.companies = companies.map((company) => this.mapCompany(company));
        this.loadingCompanies = false;
      },
      error: () => {
        this.loadingCompanies = false;
        void Swal.fire({
          title: 'API indisponivel',
          text: 'Nao foi possivel carregar as empresas contratantes.',
          icon: 'error',
          confirmButtonColor: '#0aa39a',
        });
      },
    });
  }

  private loadUsers(): void {
    this.loadingUsers = true;
    this.usersApi.getUsers().subscribe({
      next: (users) => {
        this.users = users.map((user) => this.mapUser(user));
        this.loadingUsers = false;
      },
      error: () => {
        this.loadingUsers = false;
        void Swal.fire({
          title: 'API indisponivel',
          text: 'Nao foi possivel carregar os usuarios.',
          icon: 'error',
          confirmButtonColor: '#0aa39a',
        });
      },
    });
  }

  private buildCompanyRequest(): SaveContractingCompanyRequest {
    return {
      razaoSocial: this.companyForm.razaoSocial,
      nomeFantasia: this.companyForm.nomeFantasia,
      cnpj: this.companyForm.cnpj,
      inscricaoEstadual: this.companyForm.inscricaoEstadual,
      inscricaoMunicipal: this.companyForm.inscricaoMunicipal,
      segmento: this.companyForm.segmento,
      emailPrincipal: this.companyForm.email,
      telefone: this.companyForm.telefone,
      site: this.companyForm.site,
      uf: this.companyForm.uf,
      plano: this.companyForm.plano,
      situacao: this.companyForm.situacao,
    };
  }

  private buildUserRequest(): SaveContractingUserRequest {
    return {
      empresaId: this.userForm.empresaId,
      nome: this.userForm.nome,
      email: this.userForm.email,
      telefone: this.userForm.telefone,
      cargo: this.userForm.cargo,
      tipoAcesso: this.userForm.tipoAcesso,
      modulosAcesso: this.userForm.modulosAcesso,
      enviarEmailBoasVindas: this.userForm.enviarEmailBoasVindas,
    };
  }

  private mapCompany(company: ContractingCompanyResponse): ContractingCompany {
    const name = company.razaoSocial || company.nomeFantasia || 'Empresa sem nome';
    const createdAt = company.criadoEm ? new Date(company.criadoEm) : null;

    return {
      id: company.id,
      icon: this.initialsFor(name),
      name,
      branch: company.nomeFantasia || 'Matriz',
      cnpj: company.cnpj,
      plan: company.plano || 'Nao definido',
      users: 0,
      status: this.normalizeStatus(company.situacao),
      start: createdAt && !Number.isNaN(createdAt.getTime()) ? createdAt.toLocaleDateString('pt-BR') : '-',
    };
  }

  private mapUser(user: ContractingUserResponse): ContractingUser {
    const createdAt = user.criadoEm ? new Date(user.criadoEm) : null;
    const modules = user.modulosAcesso ? user.modulosAcesso.split(',').filter(Boolean) : [];

    return {
      id: user.id,
      initials: this.initialsFor(user.nome),
      name: user.nome,
      email: user.email,
      phone: user.telefone,
      role: user.tipoAcesso === 'UsuarioComum' ? 'UsuarioComum' : 'EmpresaAdmin',
      companyId: user.empresaId,
      companyName: user.empresaNome || 'Empresa nao encontrada',
      status: user.ativo ? 'Ativo' : 'Inativo',
      modules,
      createdAt: createdAt && !Number.isNaN(createdAt.getTime()) ? createdAt.toLocaleDateString('pt-BR') : '-',
    };
  }

  private normalizeStatus(status: string): ContractingCompany['status'] {
    if (status === 'Pendente') return 'Pendente';
    if (status === 'Inadimplente') return 'Inadimplente';
    return 'Ativa';
  }

  private initialsFor(name: string): string {
    const initials = name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();

    return initials || '--';
  }

  private resetCompanyForm(): void {
    this.companyForm = {
      razaoSocial: '',
      nomeFantasia: '',
      cnpj: '',
      inscricaoEstadual: '',
      inscricaoMunicipal: '',
      segmento: '',
      email: '',
      telefone: '',
      site: '',
      endereco: '',
      cidade: '',
      uf: '',
      responsavel: '',
      emailResponsavel: '',
      plano: 'Professional',
      situacao: 'Ativa',
    };
  }

  private resetUserForm(): void {
    this.userForm = {
      empresaId: this.companies[0]?.id ?? 0,
      nome: '',
      email: '',
      telefone: '',
      cargo: '',
      tipoAcesso: 'EmpresaAdmin',
      modulosAcesso: [...this.userAccessModules],
      enviarEmailBoasVindas: true,
    };
  }
}
