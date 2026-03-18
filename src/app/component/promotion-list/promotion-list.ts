import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
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
  displayedColumns: string[] = [
    'promotion_id',
    'name',
    'brand',
    'discount_type',
    'time',
    'status',
    // 'end_date',
  ];
  statusList = ['ALL', 'ACTIVE', 'COMPLETED', 'PENDING', 'CANCELLED'];
  discountTypeList = ['ALL', 'AMOUNT', 'PERCENTAGE'];

  dataSource: any[] = [];
  total = 0;

  filter = {
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
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private promotionService: PromotionService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    const savedLang = localStorage.getItem('lang') || 'en';

    this.currentLang = savedLang;

    this.translate.setFallbackLang('en');
    this.translate.use(savedLang);

    const savedFilter = localStorage.getItem('promotionsFilter');

    if (savedFilter) {
      const parsed = JSON.parse(savedFilter);

      this.filter = {
        ...this.filter,
        ...parsed,
        created_time_from: parsed.created_time_from ? new Date(parsed.created_time_from) : null,
        created_time_to: parsed.created_time_to ? new Date(parsed.created_time_to) : null,
        end_time_from: parsed.end_time_from ? new Date(parsed.end_time_from) : null,
        end_time_to: parsed.end_time_to ? new Date(parsed.end_time_to) : null,
        start_time_from: parsed.start_time_from ? new Date(parsed.start_time_from) : null,
        start_time_to: parsed.start_time_to ? new Date(parsed.start_time_to) : null,
      };
    }

    this.loadData();
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
            placeholder: 'EX: PR-9D2YLTWK',
          },

          {
            key: 'name',
            label: 'Name',
            type: 'text',
            placeholder: 'EX: Giß║úm 10% to├án ─æ╞ín FOODBOOK',
          },
          { key: 'status_list', label: 'Status', type: 'select', options: this.statusList },

          {
            key: 'discount_type',
            label: 'Discount Type',
            type: 'select',
            options: this.discountTypeList,
          },

          {
            key: 'created_time',
            label: 'Created Time',
            type: 'date-range',
          },
          {
            key: 'start_time',
            label: 'Start Time',
            type: 'date-range',
          },
          {
            key: 'end_time',
            label: 'End Time',
            type: 'date-range',
          },
        ],
        filter: { ...this.filter },
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const { filter, isCleared } = result;

        this.filter = {
          ...this.filter,
          ...filter,
          page: 1,
        };

        if (this.paginator) {
          this.paginator.pageIndex = 0;
        }

        if (!isCleared) {
          this.saveFilter();
        }
        this.cdr.detectChanges();

        this.loadData();
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

  buildParams() {
    const params: any = {
      page: this.filter.page,
      size: this.filter.size,
    };

    if (this.filter.promotion_id) {
      params.promotion_id = this.filter.promotion_id;
    }
    if (this.filter.status_list) {
      params.status_list = this.filter.status_list;
    }
    if (this.filter.name) {
      params.name = this.filter.name;
    }
    if (this.filter.discount_type) {
      params.discount_type = this.filter.discount_type;
    }
    if (this.filter.created_time_from) {
      params.created_time_from = this.formatDate(this.filter.created_time_from);
    }

    if (this.filter.created_time_to) {
      params.created_time_to = this.formatDate(this.filter.created_time_to);
    }

    if (this.filter.end_time_from) {
      params.end_time_from = this.formatDate(this.filter.end_time_from);
    }

    if (this.filter.end_time_to) {
      params.end_time_to = this.formatDate(this.filter.end_time_to);
    }
    if (this.filter.start_time_from) {
      params.start_time_from = this.formatDate(this.filter.start_time_from);
    }

    if (this.filter.start_time_to) {
      params.start_time_to = this.formatDate(this.filter.start_time_to);
    }

    return params;
  }
  saveFilter() {
    localStorage.setItem('promotionsFilter', JSON.stringify(this.filter));
  }
  loadData() {
    const params = this.buildParams();

    this.promotionService.getPromotion(params).subscribe((res: any) => {
      this.dataSource = res.data.promotions || [];
      this.total = res.data.totalElement || 0;

      this.filter.page = res.data.currentPage;
      this.filter.size = res.data.pageSize;

      this.cdr.detectChanges();
    });
  }
  get filterCount(): number {
    const skipKeys = ['page', 'size'];
    return Object.keys(this.filter).filter(
      (key) =>
        !skipKeys.includes(key) &&
        this.filter[key as keyof typeof this.filter] !== '' &&
        this.filter[key as keyof typeof this.filter] !== null,
    ).length;
  }

  pageChange(event: PageEvent) {
    this.filter.page = event.pageIndex + 1;
    this.filter.size = event.pageSize;
    this.saveFilter();

    this.loadData();
  }
}
