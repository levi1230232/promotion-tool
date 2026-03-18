import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    CommonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  username = signal('');
  password = signal('');
  errorMessage = signal('');
  loading = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  login() {
    if (!this.username() || !this.password()) {
      this.errorMessage.set('Vui lòng nhập username và password');
      return;
    }

    this.errorMessage.set('');
    this.loading.set(true);

    this.authService.login(this.username(), this.password()).subscribe({
      next: (res: any) => {
        this.loading.set(false);

        if (res?.error) {
          const rawMessage = res.error.message || 'Tài khoản hoặc mật khẩu không đúng';
          this.errorMessage.set(rawMessage.split('TrackId')[0].trim());
          return;
        }

        if (res?.data?.token) {
          this.authService.saveToken(res.data.token);
          this.router.navigate(['/promotions']);
        } else {
          this.errorMessage.set('Không có phản hồi từ serve');
        }
      },
      error: (err) => {
        this.loading.set(false);
        console.error('Login error:', err);

        const errorBody = err?.error;
        if (errorBody?.error?.message) {
          this.errorMessage.set(errorBody.error.message.split('TrackId')[0].trim());
        } else {
          this.errorMessage.set('Không thể kết nối tới serve');
        }
      },
    });
  }
}
