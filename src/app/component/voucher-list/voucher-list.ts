import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, signal, computed, effect } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { VoucherService } from '../../services/voucher.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Search } from '../search/search';

@Component({
  selector: 'app-voucher-list',
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
    CommonModule,
    TranslateModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './voucher-list.html',
  styleUrl: './voucher-list.css',
})
export class VoucherList implements OnInit {
  supportedLangs = ['en', 'vi'];
  currentLang = 'en';

  displayedColumns = ['promotion_id', 'voucher_code', 'name', 'brand', 'time', 'status'];

  statusList = ['ALL', 'ACTIVE', 'INACTIVE', 'USED', 'LOCK', 'PENDING', 'EXPIRED'];

  dataSource = signal<any[]>([]);
  total = signal<number>(0);

  filter = signal({
    promotion_id: '',
    voucher_code: '',
    status: '',
    page: 1,
    size: 20,
    created_time_from: null as Date | null,
    created_time_to: null as Date | null,
    use_time_from: null as Date | null,
    use_time_to: null as Date | null,
  });

  filterCount = computed(() => {
    const skipKeys = ['page', 'size'];

    return Object.entries(this.filter()).filter(
      ([key, value]) => !skipKeys.includes(key) && value !== '' && value !== null,
    ).length;
  });

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private voucherService: VoucherService,
    private translate: TranslateService,
    private dialog: MatDialog,
  ) {
    effect(() => {
      const params = this.buildParams(this.filter());
      this.fetchVoucher(params);
    });
  }

  ngOnInit(): void {
    const savedLang = localStorage.getItem('lang') || 'en';
    this.currentLang = savedLang;

    this.translate.setFallbackLang('en');
    this.translate.use(savedLang);

    const savedFilter = localStorage.getItem('voucherFilter');

    if (savedFilter) {
      const parsed = JSON.parse(savedFilter);

      this.filter.set({
        ...this.filter(),
        ...parsed,
        created_time_from: parsed.created_time_from ? new Date(parsed.created_time_from) : null,
        created_time_to: parsed.created_time_to ? new Date(parsed.created_time_to) : null,
        use_time_from: parsed.use_time_from ? new Date(parsed.use_time_from) : null,
        use_time_to: parsed.use_time_to ? new Date(parsed.use_time_to) : null,
      });
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(Search, {
      width: '600px',
      maxHeight: '70vh',
      data: {
        storageKey: 'voucherFilter',
        fields: [
          {
            key: 'promotion_id',
            label: 'Promotion ID',
            type: 'text',
            placeholder: 'EX: PR-9D2YLTWK',
          },
          {
            key: 'voucher_code',
            label: 'Voucher Code',
            type: 'text',
            placeholder: 'EX: MPNGK3NLDK',
          },
          {
            key: 'status',
            label: 'Status',
            type: 'select',
            options: this.statusList,
          },
          {
            key: 'created_time',
            label: 'Created Time',
            type: 'date-range',
          },
          {
            key: 'use_time',
            label: 'Use Time',
            type: 'date-range',
          },
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
    if (filter.voucher_code) params.voucher_code = filter.voucher_code;
    if (filter.status) params.status = filter.status;

    if (filter.created_time_from)
      params.created_time_from = this.formatDate(filter.created_time_from);

    if (filter.created_time_to) params.created_time_to = this.formatDate(filter.created_time_to);

    if (filter.use_time_from) params.use_time_from = this.formatDate(filter.use_time_from);

    if (filter.use_time_to) params.use_time_to = this.formatDate(filter.use_time_to);

    return params;
  }

  fetchVoucher(params: any) {
    this.voucherService.getVoucher(params).subscribe((res: any) => {
      this.dataSource.set(res?.data?.vouchers || []);
      this.total.set(res?.data?.totalElement || 0);
    });
  }

  saveFilter() {
    localStorage.setItem('voucherFilter', JSON.stringify(this.filter()));
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
