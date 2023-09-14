import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'waste/:id',
    loadComponent: () => import('./waste/waste.page').then( m => m.WastePage)
  },
  {
    path: 'waste-create',
    loadComponent: () => import('./waste-create/waste-create.page').then( m => m.WasteCreatePage)
  },
  {
    path: 'waste-type',
    loadComponent: () => import('./waste-type/waste-type.page').then( m => m.WasteTypePage)
  },
  {
    path: 'waste-type-create',
    loadComponent: () => import('./waste-type-create/waste-type-create.page').then( m => m.WasteTypeCreatePage)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
