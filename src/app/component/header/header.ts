import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { NavigationEnd, Router } from '@angular/router';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSelectModule,
    TranslateModule,
  ],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header implements OnInit {
  supportedLangs = ['en', 'vi'];
  currentLang = 'en';
  title = '';
  @Output() toggleSidebar = new EventEmitter<void>();

  constructor(
    private router: Router,
    private translate: TranslateService,
    private authService: AuthService,
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const urlSegments = event.urlAfterRedirects.split('/');
        this.title = urlSegments[urlSegments.length - 1];
      });
  }

  ngOnInit() {
    const savedLang = localStorage.getItem('lang') || 'en';

    this.currentLang = savedLang;

    this.translate.setFallbackLang('en');
    this.translate.use(savedLang);
  }

  changeLanguage(lang: string) {
    this.currentLang = lang;

    this.translate.use(lang).subscribe(() => {
      localStorage.setItem('lang', lang);
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
