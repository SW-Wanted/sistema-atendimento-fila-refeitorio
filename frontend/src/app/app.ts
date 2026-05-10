import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App implements OnInit, OnDestroy {
  protected readonly title = signal('Sistema Inteligente do Refeitório');
  protected user: any = null;
  protected showShell = false;

  protected readonly links = [
    { label: 'Menu', path: '/menu', roles: ['guest', 'institucional', 'admin', 'operador'] },
    { label: 'Histórico', path: '/historico', roles: ['guest', 'institucional', 'admin', 'operador'] },
    { label: 'Cozinha', path: '/cozinha', roles: ['admin', 'operador'] },
    { label: 'Gestão', path: '/admin/pratos', roles: ['admin'] },
  ];

  private routerSub?: Subscription;

  constructor(private router: Router) {}

  ngOnInit() {
    this.syncShellState();
    this.routerSub = this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => this.syncShellState());
  }

  ngOnDestroy() {
    this.routerSub?.unsubscribe();
  }

  get visibleLinks() {
    return this.links.filter(link => !this.user || link.roles.includes(this.user.tipo_conta));
  }

  logout() {
    localStorage.removeItem('user');
    this.syncShellState();
    this.router.navigate(['/login']);
  }

  private syncShellState() {
    const storedUser = localStorage.getItem('user');
    this.user = storedUser ? JSON.parse(storedUser) : null;
    this.showShell = !!this.user && this.router.url !== '/login';
  }
}