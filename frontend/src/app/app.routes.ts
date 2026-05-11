import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Menu } from './components/menu/menu';
import { Cozinha } from './components/cozinha/cozinha';
import { Historico } from './components/historico/historico';
import { GestaoPratos } from './components/admin/gestao-pratos';
import { Register } from './components/register/register';
import { RecoverPassword } from './components/recover-password/recover-password';
import { authGuard, roleGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'recover-password', component: RecoverPassword },
  { path: 'menu', component: Menu, canActivate: [authGuard] },
  { path: 'cozinha', component: Cozinha, canActivate: [roleGuard(['admin', 'operador'])] },
  { path: 'historico', component: Historico, canActivate: [authGuard] },
  { path: 'admin/pratos', component: GestaoPratos, canActivate: [roleGuard(['admin'])] },
  { path: '**', redirectTo: 'login' }
];