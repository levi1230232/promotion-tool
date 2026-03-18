import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VoucherService {
  constructor(private http: HttpClient) {}

  getVoucher(filter: any): Observable<any> {
    let params = new HttpParams()
      .set('page', filter.page.toString())
      .set('size', filter.size.toString());

    if (filter.status) {
      params = params.set('status', filter.status);
    }

    if (filter.promotion_id) {
      params = params.set('promotion_id', filter.promotion_id);
    }

    if (filter.voucher_code) {
      params = params.set('voucher_code', filter.voucher_code);
    }
    if (filter.created_time_from) {
      params = params.set('created_time_from', filter.created_time_from);
    }

    if (filter.created_time_to) {
      params = params.set('created_time_to', filter.created_time_to);
    }

    if (filter.use_time_from) {
      params = params.set('use_time_from', filter.use_time_from);
    }

    if (filter.use_time_to) {
      params = params.set('use_time_to', filter.use_time_to);
    }

    return this.http.get('/ipos/ws/multi-brand-promotion/voucher/filter', { params });
  }
}
