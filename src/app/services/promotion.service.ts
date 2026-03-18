import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PromotionService {
  constructor(private http: HttpClient) {}
  getPromotion(filter: any): Observable<any> {
    let params = new HttpParams().set('page', filter.page).set('size', filter.size);

    if (filter.promotion_id) {
      params = params.set('promotion_id', filter.promotion_id);
    }
    if (filter.name) {
      params = params.set('name', filter.name);
    }
    if (filter.discount_type) {
      params = params.set('discount_type', filter.discount_type);
    }
    if (filter.created_time_from) {
      params = params.set('created_time_from', filter.created_time_from);
    }
    if (filter.status_list) {
      params = params.set('status_list', filter.status_list);
    }
    if (filter.created_time_to) {
      params = params.set('created_time_to', filter.created_time_to);
    }
    if (filter.end_time_from) {
      params = params.set('end_time_from', filter.end_time_from);
    }

    if (filter.end_time_to) {
      params = params.set('end_time_to', filter.end_time_to);
    }
    if (filter.start_time_from) {
      params = params.set('start_time_from', filter.start_time_from);
    }

    if (filter.start_time_to) {
      params = params.set('start_time_to', filter.start_time_to);
    }

    return this.http.get('/ipos/ws/multi-brand-promotion/filter', { params });
  }
}
