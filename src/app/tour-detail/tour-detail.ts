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

    // --- НОВОЕ: Валидация Email ---
    // Проверяем, что email содержит @, домен и точку
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      this.bookingError = 'Пожалуйста, укажите корректный email (например, name@mail.com).';
      return;
    }

    // --- НОВОЕ: Валидация Телефона ---
    // Очищаем введенный номер от пробелов, скобок, тире и плюсов, оставляя только цифры
    const phoneDigitsOnly = phone.replace(/\D/g, '');

    const hasLetters = /[a-zA-Zа-яА-ЯёЁ]/.test(phone);
    if (hasLetters) {
      this.bookingError = 'В номере телефона не должно быть букв, только цифры.';
      return;
    }
    
    // Проверяем, что пользователь ввел реальное количество цифр (обычно от 10 до 15)
    if (phoneDigitsOnly.length < 10 || phoneDigitsOnly.length > 15) {
      this.bookingError = 'Пожалуйста, введите корректный номер телефона (от 10 до 15 цифр).';
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