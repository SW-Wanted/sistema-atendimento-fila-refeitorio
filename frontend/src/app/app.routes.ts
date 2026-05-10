import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Menu } from './components/menu/menu';
import { Cozinha } from './components/cozinha/cozinha';
import { Historico } from './components/historico/historico';
import { GestaoPratos } from './components/admin/gestao-pratos';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'menu', component: Menu },
  { path: 'cozinha', component: Cozinha },
  { path: 'historico', component: Historico },
  { path: 'admin/pratos', component: GestaoPratos },
];