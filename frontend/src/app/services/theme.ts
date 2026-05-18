import { Injectable } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storageKey = 'theme_mode';
  private mode: ThemeMode = 'light';

  constructor() {
    const saved = localStorage.getItem(this.storageKey) as ThemeMode | null;
    if (saved === 'dark' || saved === 'light') {
      this.mode = saved;
    } else {
      this.mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      localStorage.setItem(this.storageKey, this.mode);
    }
    this.applyTheme();
  }

  get currentTheme(): ThemeMode {
    return this.mode;
  }

  toggleTheme() {
    this.mode = this.mode === 'light' ? 'dark' : 'light';
    localStorage.setItem(this.storageKey, this.mode);
    this.applyTheme();
  }

  private applyTheme() {
    document.documentElement.setAttribute('data-theme', this.mode);
    document.documentElement.style.colorScheme = this.mode;
  }
}
