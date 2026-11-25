import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'scout', pathMatch: 'full' },
  {
    path: 'scout',
    loadComponent: () =>
      import('./features/scout/pages/scout-page.component').then(m => m.ScoutPageComponent)
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./features/contact/pages/contact-page.component').then(m => m.ContactPageComponent)
  },
  { path: '**', redirectTo: 'scout' }
];
