import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TourService } from '../services/tour.service';
import { Booking } from '../interfaces/tour.interface';

@Component({
  selector: 'app-payment-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-modal.html',
  styleUrls: ['./payment-modal.css'],
})
export class PaymentModalComponent implements OnInit {
  @Input() booking!: Booking;
  @Input() totalPrice!: number;
  @Input() tourTitle!: string;

  @Output() close = new EventEmitter<void>();
  @Output() paymentSuccess = new EventEmitter<void>();

  cardNumber = '';
  cardExpiry = '';
  cardCvv = '';
  cardHolder = '';

  isLoading = false;
  errorMessage = '';
  step: 'form' | 'success' = 'form';

  constructor(private tourService: TourService) {}

  ngOnInit(): void {
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }

  onClose(): void {
    this.close.emit();
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.onClose();
    }
  }

  formatCardNumber(value: string): void {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    this.cardNumber = digits.replace(/(.{4})/g, '$1 ').trim();
  }

  formatExpiry(value: string): void {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) {
      this.cardExpiry = digits.slice(0, 2) + '/' + digits.slice(2);
    } else {
      this.cardExpiry = digits;
    }
  }

  formatCvv(value: string): void {
    this.cardCvv = value.replace(/\D/g, '').slice(0, 3);
  }

  get maskedCard(): string {
    const digits = this.cardNumber.replace(/\s/g, '');
    if (digits.length < 4) return '**** **** **** ****';
    return '**** **** **** ' + digits.slice(-4);
  }

  pay(): void {
    this.errorMessage = '';

    if (this.cardNumber.replace(/\s/g, '').length < 16) {
      this.errorMessage = 'Введите корректный номер карты.';
      return;
    }
    if (this.cardExpiry.length < 5) {
      this.errorMessage = 'Введите срок действия карты.';
      return;
    }
    if (this.cardCvv.length < 3) {
      this.errorMessage = 'Введите CVV код.';
      return;
    }
    if (!this.cardHolder.trim()) {
      this.errorMessage = 'Введите имя владельца карты.';
      return;
    }

    this.isLoading = true;

    this.tourService.createBooking(this.booking).subscribe({
      next: () => {
        this.isLoading = false;
        this.step = 'success';
        setTimeout(() => this.paymentSuccess.emit(), 2000);
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Ошибка оплаты. Попробуйте снова.';
      },
    });
  }
}