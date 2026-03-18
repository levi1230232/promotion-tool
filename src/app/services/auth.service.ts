import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { environment } from '../../environments/environment';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    const body = new URLSearchParams();
    body.set('user_name', username);
    body.set('password', password);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return this.http
      .post<any>('/ipos/ws/multi-brand-promotion/login', body.toString(), { headers })
      .pipe(
        catchError((error) => {
          console.error('Login API error:', error);
          return throwError(() => error);
        }),
      );
  }

  saveToken(token: string) {
    localStorage.setItem('tool_token', token);
  }

  getToken() {
    return localStorage.getItem('tool_token');
  }

  logout() {
    localStorage.removeItem('tool_token');
  }
}
