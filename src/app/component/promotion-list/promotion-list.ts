import { Component, OnInit, ViewChild, signal, computed, effect } from '@angular/core';

import { PromotionService } from '../../services/promotion.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { Search } from '../search/search';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-promotion-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatCardModule,
    DatePipe,
    TranslateModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './promotion-list.html',
  styleUrl: './promotion-list.css',
})
export class PromotionList implements OnInit {
  supportedLangs = ['en', 'vi'];
  currentLang = 'en';

  displayedColumns = ['promotion_id', 'name', 'brand', 'discount_type', 'time', 'status'];

  statusList = ['ALL', 'ACTIVE', 'COMPLETED', 'PENDING', 'CANCELLED'];
  discountTypeList = ['ALL', 'AMOUNT', 'PERCENTAGE'];

  dataSource = signal<any[]>([]);
  total = signal<number>(0);

  filter = signal({
    promotion_id: '',
    page: 1,
    size: 20,
    status_list: '',
    name: '',
    discount_type: '',
    created_time_from: null as Date | null,
    created_time_to: null as Date | null,
    end_time_from: null as Date | null,
    end_time_to: null as Date | null,
    start_time_from: null as Date | null,
    start_time_to: null as Date | null,
  });

  filterCount = computed(() => {
    const skipKeys = ['page', 'size'];

    return Object.entries(this.filter()).filter(
      ([key, value]) => !skipKeys.includes(key) && value !== '' && value !== null,
    ).length;
  });

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private promotionService: PromotionService,
    private translate: TranslateService,
    private dialog: MatDialog,
  ) {
    effect(() => {
      const params = this.buildParams(this.filter());
      this.fetchPromotions(params);
    });
  }

  ngOnInit(): void {
    const savedLang = localStorage.getItem('lang') || 'en';
    this.currentLang = savedLang;

    this.translate.setFallbackLang('en');
    this.translate.use(savedLang);

    const savedFilter = localStorage.getItem('promotionsFilter');

    if (savedFilter) {
      const parsed = JSON.parse(savedFilter);

      this.filter.set({
        ...this.filter(),
        ...parsed,
        created_time_from: parsed.created_time_from ? new Date(parsed.created_time_from) : null,
        created_time_to: parsed.created_time_to ? new Date(parsed.created_time_to) : null,
        end_time_from: parsed.end_time_from ? new Date(parsed.end_time_from) : null,
        end_time_to: parsed.end_time_to ? new Date(parsed.end_time_to) : null,
        start_time_from: parsed.start_time_from ? new Date(parsed.start_time_from) : null,
        start_time_to: parsed.start_time_to ? new Date(parsed.start_time_to) : null,
      });
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(Search, {
      width: '600px',
      maxHeight: '70vh',
      data: {
        storageKey: 'promotionsFilter',
        fields: [
          {
            key: 'promotion_id',
            label: 'Promotion ID',
            type: 'text',
          },
          {
            key: 'name',
            label: 'Name',
            type: 'text',
          },
          { key: 'status_list', label: 'Status', type: 'select', options: this.statusList },
          {
            key: 'discount_type',
            label: 'Discount Type',
            type: 'select',
            options: this.discountTypeList,
          },
          { key: 'created_time', label: 'Created Time', type: 'date-range' },
          { key: 'start_time', label: 'Start Time', type: 'date-range' },
          { key: 'end_time', label: 'End Time', type: 'date-range' },
        ],
        filter: { ...this.filter() },
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      const { filter, isCleared } = result;

      this.filter.update((prev) => ({
        ...prev,
        ...filter,
        page: 1,
      }));

      if (!isCleared) {
        this.saveFilter();
      }
    });
  }

  formatDate(date: Date | null) {
    if (!date) return null;

    const d = new Date(date);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  buildParams(filter: any) {
    const params: any = {
      page: filter.page,
      size: filter.size,
    };

    if (filter.promotion_id) params.promotion_id = filter.promotion_id;
    if (filter.status_list) params.status_list = filter.status_list;
    if (filter.name) params.name = filter.name;
    if (filter.discount_type) params.discount_type = filter.discount_type;

    if (filter.created_time_from)
      params.created_time_from = this.formatDate(filter.created_time_from);

    if (filter.created_time_to) params.created_time_to = this.formatDate(filter.created_time_to);

    if (filter.end_time_from) params.end_time_from = this.formatDate(filter.end_time_from);

    if (filter.end_time_to) params.end_time_to = this.formatDate(filter.end_time_to);

    if (filter.start_time_from) params.start_time_from = this.formatDate(filter.start_time_from);

    if (filter.start_time_to) params.start_time_to = this.formatDate(filter.start_time_to);

    return params;
  }

  fetchPromotions(params: any) {
    this.promotionService.getPromotion(params).subscribe((res: any) => {
      this.dataSource.set(res.data.promotions || []);
      this.total.set(res.data.totalElement || 0);
    });
  }

  saveFilter() {
    localStorage.setItem('promotionsFilter', JSON.stringify(this.filter()));
  }

  pageChange(event: PageEvent) {
    this.filter.update((f) => ({
      ...f,
      page: event.pageIndex + 1,
      size: event.pageSize,
    }));

    this.saveFilter();
  }
}
