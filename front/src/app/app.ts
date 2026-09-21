import { Component, ViewEncapsulation } from '@angular/core';
import { AppLayoutComponent } from './core/layout/app-layout.component';

@Component({
  selector: 'app-root',
  imports: [AppLayoutComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  encapsulation: ViewEncapsulation.None,
})
export class App {}
