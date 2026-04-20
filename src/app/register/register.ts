import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  showPassword = false;
  showConfirm = false;
  errorMessage = '';
  isLoading = false;
  isSuccess = false;

  constructor(private auth: AuthService, private router: Router) {}

  get passwordStrength(): 'weak' | 'medium' | 'strong' | null {
    if (!this.password) return null;
    if (this.password.length < 6) return 'weak';
    if (this.password.length < 10) return 'medium';
    return 'strong';
  }

  get strengthLabel(): string {
    const map = { weak: 'Слабый', medium: 'Средний', strong: 'Надёжный' };
    return this.passwordStrength ? map[this.passwordStrength] : '';
  }

  onRegister(): void {
    this.errorMessage = '';

    if (!this.username.trim() || !this.email.trim() || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Заполните все поля.';
      return;
    }
    if (this.username.trim().length < 3) {
      this.errorMessage = 'Имя пользователя минимум 3 символа.';
      return;
    }
    if (!this.email.includes('@')) {
      this.errorMessage = 'Введите корректный email.';
      return;
    }
    if (this.password.length < 6) {
      this.errorMessage = 'Пароль минимум 6 символов.';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Пароли не совпадают.';
      return;
    }

    this.isLoading = true;

    this.auth.register({
      username: this.username.trim(),
      email: this.email.trim(),
      password: this.password,
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.isSuccess = true;
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: err => {
        this.isLoading = false;
        this.errorMessage =
          err.error?.detail ||
          err.error?.username?.[0] ||
          err.error?.email?.[0] ||
          'Ошибка регистрации. Попробуйте снова.';
      },
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}