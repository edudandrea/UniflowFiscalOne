import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  const saasAdminStorageKey = 'uniflow.saasAdmin';

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter(routes)],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render login page title', async () => {
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/login');
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Dados fiscais hoje.');
  });

  it('should request SaaS admin creation when no SaaS user exists', async () => {
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/login');
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Cadastrar administrador SaaS');
  });

  it('should create SaaS admin locally and hide setup modal', async () => {
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/login');
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const inputs = compiled.querySelectorAll<HTMLInputElement>('.fiscal-bootstrap-modal input');

    inputs[0].value = 'Administrador SaaS';
    inputs[0].dispatchEvent(new Event('input'));
    inputs[1].value = 'admin';
    inputs[1].dispatchEvent(new Event('input'));
    inputs[2].value = '123.456.789-00';
    inputs[2].dispatchEvent(new Event('input'));
    inputs[3].value = 'admin@uniflow.com';
    inputs[3].dispatchEvent(new Event('input'));
    inputs[4].value = '123456';
    inputs[4].dispatchEvent(new Event('input'));
    fixture.detectChanges();

    compiled.querySelector<HTMLFormElement>('.fiscal-bootstrap-modal')?.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(localStorage.getItem(saasAdminStorageKey)).toContain('admin@uniflow.com');
    expect(localStorage.getItem(saasAdminStorageKey)).toContain('123.456.789-00');
    expect(localStorage.getItem(saasAdminStorageKey)).toContain('SistemaAdmin');
    expect(compiled.textContent).not.toContain('Configuracao inicial');
  });

  it('should not show SaaS admin setup modal when admin already exists', async () => {
    localStorage.setItem(
      saasAdminStorageKey,
      JSON.stringify({
        nome: 'Administrador SaaS',
        login: 'admin',
        email: 'admin@uniflow.com',
        role: 'SistemaAdmin',
        ativo: true,
      }),
    );

    const router = TestBed.inject(Router);
    await router.navigateByUrl('/login');
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).not.toContain('Configuracao inicial');
    expect(compiled.textContent).not.toContain('Identificamos que ainda nao existe um usuario SaaS');
  });

  it('should render SaaS admin menu options', async () => {
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/saas');
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    TestBed.inject(HttpTestingController)
      .expectOne('http://localhost:5058/api/contracting-companies')
      .flush([]);
    TestBed.inject(HttpTestingController)
      .expectOne('http://localhost:5058/api/contracting-users')
      .flush([]);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Visao Geral');
    expect(compiled.textContent).toContain('Dados empresariais');
    expect(compiled.textContent).toContain('Tickets para o desenvolvedor');
    expect(compiled.textContent).toContain('Financeiro');
    expect(compiled.textContent).toContain('Notas fiscais');
    expect(compiled.textContent).toContain('Auditoria');
    expect(compiled.textContent).toContain('Novo registro');
  });
});
