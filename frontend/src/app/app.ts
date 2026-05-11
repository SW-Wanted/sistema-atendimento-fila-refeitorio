import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { I18nService, Lang } from './services/i18n';
import { ThemeService } from './services/theme';

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
    { label: 'menu', path: '/menu', roles: ['guest', 'institucional', 'admin', 'operador'] },
    { label: 'history', path: '/historico', roles: ['guest', 'institucional', 'admin', 'operador'] },
    { label: 'kitchen', path: '/cozinha', roles: ['admin', 'operador'] },
    { label: 'management', path: '/admin/pratos', roles: ['admin'] },
  ];

  private routerSub?: Subscription;

  constructor(
    private router: Router,
    private i18n: I18nService,
    private theme: ThemeService,
  ) {}

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

  get currentTheme() {
    return this.theme.currentTheme;
  }

  get currentLang() {
    return this.i18n.currentLang;
  }

  toggleTheme() {
    this.theme.toggleTheme();
  }

  setLang(lang: string) {
    this.i18n.setLang(lang as Lang);
  }

  t(key: string) {
    return this.i18n.t(key);
  }

  logout() {
    localStorage.removeItem('user');
    this.syncShellState();
    this.router.navigate(['/login']);
  }

  private syncShellState() {
    const storedUser = localStorage.getItem('user');
    this.user = storedUser ? JSON.parse(storedUser) : null;
    this.showShell = !!this.user && !['/login', '/register', '/recover-password'].includes(this.router.url);
  }
}