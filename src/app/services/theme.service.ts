import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkThemeSubject = new BehaviorSubject<boolean>(this.getStoredTheme());
  public isDarkTheme$ = this.isDarkThemeSubject.asObservable();

  constructor() {
    // Aplicar tema inicial
    this.applyTheme(this.isDarkThemeSubject.value);
  }

  // Obter tema armazenado
  private getStoredTheme(): boolean {
    const stored = localStorage.getItem('darkTheme');
    return stored ? JSON.parse(stored) : false;
  }

  // Alternar tema
  toggleTheme(): void {
    const newTheme = !this.isDarkThemeSubject.value;
    this.isDarkThemeSubject.next(newTheme);
    this.applyTheme(newTheme);
    localStorage.setItem('darkTheme', JSON.stringify(newTheme));
  }

  // Aplicar tema ao body
  private applyTheme(isDark: boolean): void {
    if (typeof document !== 'undefined') {
      if (isDark) {
        document.body.classList.add('tema-escuro');
      } else {
        document.body.classList.remove('tema-escuro');
      }
    }
  }

  // Obter estado atual do tema
  isDarkTheme(): boolean {
    return this.isDarkThemeSubject.value;
  }
}