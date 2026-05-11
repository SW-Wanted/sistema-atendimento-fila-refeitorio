import { Injectable } from '@angular/core';

export type Lang = 'pt' | 'en';

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly storageKey = 'lang';
  private lang: Lang = 'pt';

  private readonly dictionary: Record<Lang, Record<string, string>> = {
    pt: {
      menu: 'Menu',
      history: 'Histórico',
      kitchen: 'Cozinha',
      management: 'Gestão',
      logout: 'Sair',
      login: 'Entrar',
      register: 'Registar',
      forgotPassword: 'Recuperar senha',
      lightDark: 'Alternar tema',
      language: 'Idioma',
      exportCsv: 'Exportar CSV'
    },
    en: {
      menu: 'Menu',
      history: 'History',
      kitchen: 'Kitchen',
      management: 'Management',
      logout: 'Logout',
      login: 'Sign in',
      register: 'Register',
      forgotPassword: 'Recover password',
      lightDark: 'Toggle theme',
      language: 'Language',
      exportCsv: 'Export CSV'
    }
  };

  constructor() {
    const saved = localStorage.getItem(this.storageKey) as Lang | null;
    this.lang = saved === 'en' ? 'en' : 'pt';
  }

  get currentLang(): Lang {
    return this.lang;
  }

  setLang(lang: Lang) {
    this.lang = lang;
    localStorage.setItem(this.storageKey, lang);
  }

  t(key: string): string {
    return this.dictionary[this.lang][key] || key;
  }
}
