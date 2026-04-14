import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TourService } from '../services/tour.service';
import { Tour, Booking } from '../interfaces/tour.interface';

@Component({
  selector: 'app-tour-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tour-detail.html',
  styleUrls: ['./tour-detail.css'],
})
export class TourDetailComponent implements OnInit {
  //update v2
  get isOverCapacity(): boolean {
    if (!this.tour || !this.tour.available_slots) { 
      return false;
    }
    return this.booking.people_count > this.tour.available_slots;
  }

  tour: Tour | null = null;
  isLoading = true;
  errorMessage = '';

  booking: Booking = {
    tour: 0,
    client_name: '',
    phone: '',
    email: '',
    people_count: 1,
    travel_date: '',
    comment: '',
  };

  bookingSuccess = false;
  bookingError = '';
  bookingLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tourService: TourService
  ) {}

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

  submitBooking(): void {
    this.bookingError = '';
    const { client_name, phone, email, travel_date, people_count } = this.booking;
    if (!client_name.trim() || !phone.trim() || !email.trim() || !travel_date) {
      this.bookingError = 'Заполните все обязательные поля.';
      return;
    }
    if (people_count < 1) {
      this.bookingError = 'Количество человек должно быть не менее 1.';
      return;
    }
    //update v2 
    if (this.isOverCapacity) {
      this.bookingError = `К сожалению, доступно только ${this.tour?.available_slots} мест.`;
      return;
    }
    
    this.bookingLoading = true;
    this.tourService.createBooking(this.booking).subscribe({
      next: () => {
        this.bookingSuccess = true;
        this.bookingLoading = false;
      },
      error: err => {
        this.bookingError =
          err.error?.detail || 'Ошибка при бронировании. Попробуйте снова.';
        this.bookingLoading = false;
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/tours']);
  }
}