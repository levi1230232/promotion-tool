import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  setLanguage(lang: string) {
    localStorage.setItem('lang', lang);
    location.reload();
  }

  getLanguage() {
    return localStorage.getItem('lang') || 'en';
  }
}
