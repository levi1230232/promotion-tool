import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, MatListModule, MatIconModule, TranslateModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {
  supportedLangs = ['en', 'vi'];
  currentLang = 'en';
  constructor(private translate: TranslateService) {}
  ngOnInit() {
    const savedLang = localStorage.getItem('lang') || 'en';

    this.currentLang = savedLang;

    this.translate.setFallbackLang('en');
    this.translate.use(savedLang);
  }
}
