import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TourService } from '../services/tour.service';
import { Tour, Booking } from '../interfaces/tour.interface';
import { PaymentModalComponent } from '../payment-modal/payment-modal';

@Component({
  selector: 'app-tour-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, PaymentModalComponent],
  templateUrl: './tour-detail.html',
  styleUrls: ['./tour-detail.css'],
})
export class TourDetailComponent implements OnInit {
  tour: Tour | null = null;
  isLoading = true;
  errorMessage = '';
  bookingError = '';
  isPaymentModalOpen = false;

  booking: Booking = {
    tour: 0,
    client_name: '',
    phone: '',
    email: '',
    people_count: 1,
    travel_date: '',
    comment: '',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tourService: TourService
  ) {}

  get isOverCapacity(): boolean {
    if (!this.tour || !this.tour.available_slots) { 
      return false;
    }
    return this.booking.people_count > this.tour.available_slots;
  }

  get totalPrice(): number {
    if (!this.tour) return 0;
    return +this.tour.price * (+this.booking.people_count || 1);
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.tourService.getTour(id).subscribe({
      next: tour => {
        this.tour = tour;
        this.booking.tour = tour.id;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Тур не найден или произошла ошибка.';
        this.isLoading = false;
      },
    });
  }

  onPeopleChange(value: string): void {
    this.booking.people_count = Math.max(1, +value || 1);
  }

  // Валидация → открываем модал
  openPaymentModal(): void {
    this.bookingError = '';
    const { client_name, phone, email, travel_date, people_count } = this.booking;
    
    // 1. Проверка обязательных полей
    if (!client_name.trim() || !phone.trim() || !email.trim() || !travel_date) {
      this.bookingError = 'Заполните все обязательные поля.';
      return;
    }

    // 2. Проверка на прошедшую дату
    const selectedDate = new Date(travel_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Обнуляем время для корректного сравнения дат

    if (selectedDate <= today) {
      this.bookingError = 'Дата поездки должна начинаться с завтрашнего дня.';
      return;
    }

    // 3. Проверка количества человек
    if (people_count < 1) {
      this.bookingError = 'Количество человек должно быть не менее 1.';
      return;
    }

    // 4. Проверка на максимальное количество мест
    if (this.isOverCapacity) {
      this.bookingError = `К сожалению, доступно только ${this.tour?.available_slots} мест.`;
      return;
    }

    // Если все проверки пройдены — открываем окно
    this.isPaymentModalOpen = true;
  }
  
  onModalClose(): void {
    this.isPaymentModalOpen = false;
  }

  onPaymentSuccess(): void {
    this.isPaymentModalOpen = false;
    this.router.navigate(['/tours']);
  }

  goBack(): void {
    this.router.navigate(['/tours']);
  }
}