import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
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

  it('should render the solution workspace at root', async () => {
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/');
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    TestBed.inject(HttpTestingController)
      .expectOne('http://localhost:5058/api/product-services')
      .flush([]);
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Produtos e Servicos');
    expect(compiled.textContent).toContain('Produtos cadastrados');
  });

  it('should keep empresa as an alias for the solution workspace', async () => {
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/empresa');
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    TestBed.inject(HttpTestingController)
      .expectOne('http://localhost:5058/api/product-services')
      .flush([]);
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(router.url).toBe('/empresa');
    expect(compiled.textContent).toContain('Formacao de Preco');
  });

  it('should redirect unknown routes to the solution workspace', async () => {
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/qualquer-coisa');
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    TestBed.inject(HttpTestingController)
      .expectOne('http://localhost:5058/api/product-services')
      .flush([]);
    await fixture.whenStable();

    expect(router.url).toBe('/');
  });
});
