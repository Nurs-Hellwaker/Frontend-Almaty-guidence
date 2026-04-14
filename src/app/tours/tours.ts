import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TourService } from '../services/tour.service';
import { AuthService } from '../services/auth.service';
import { Tour } from '../interfaces/tour.interface';

@Component({
  selector: 'app-tours',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tours.html',
  styleUrls: ['./tours.css'],
})
export class ToursComponent implements OnInit {
  tours: Tour[] = [];
  searchQuery = '';
  ordering = '';
  minPrice = '';
  isLoading = false;
  errorMessage = '';

  readonly orderOptions = [
    { label: 'По умолчанию',  value: '' },
    { label: 'Цена ↑',        value: 'price' },
    { label: 'Цена ↓',        value: '-price' },
    { label: 'Длительность ↑', value: 'duration' },
    { label: 'Длительность ↓', value: '-duration' },
    { label: 'Мест ↑',        value: 'available_slots' },
  ];

  constructor(
    private tourService: TourService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTours();
  }

  loadTours(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.tourService.getTours(this.searchQuery, this.ordering).subscribe({
      next: data => {
        this.tours = this.minPrice
          ? data.filter(t => +t.price >= +this.minPrice)
          : data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Не удалось загрузить туры. Попробуйте позже.';
        this.isLoading = false;
      },
    });
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.ordering = '';
    this.minPrice = '';
    this.loadTours();
  }

  goToDetail(id: number): void {
    this.router.navigate(['/tours', id]);
  }

  logout(): void {
    this.authService.logout();
  }

  get filteredCount(): number {
    return this.tours.length;
  }
}