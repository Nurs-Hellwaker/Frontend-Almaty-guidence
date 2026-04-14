/*import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tour, Booking } from '../interfaces/tour.interface';

@Injectable({ providedIn: 'root' })
export class TourService {
  private readonly API = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getTours(search = '', ordering = ''): Observable<Tour[]> {
    let params = new HttpParams();
    if (search)   params = params.set('search', search);
    if (ordering) params = params.set('ordering', ordering);
    return this.http.get<Tour[]>(`${this.API}/tours/`, { params });
  }

  getTour(id: number): Observable<Tour> {
    return this.http.get<Tour>(`${this.API}/tours/${id}/`);
  }

  createBooking(booking: Booking): Observable<Booking> {
    return this.http.post<Booking>(`${this.API}/bookings/`, booking);
  }
}*/
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Tour, Booking } from '../interfaces/tour.interface';

const MOCK_TOURS: Tour[] = [
  {
    id: 1,
    title: 'Большое Алматинское озеро',
    country: 'Казахстан',
    city: 'Алматы',
    description: 'Одно из красивейших горных озёр у подножия Заилийского Алатау. Кристально чистая вода и панорамные виды.',
    price: '12500.00',
    duration: 1,
    image: null,
    available_slots: 18,
  },
  {
    id: 2,
    title: 'Чарынский каньон',
    country: 'Казахстан',
    city: 'Алматы',
    description: '«Младший брат» Гранд-Каньона — потрясающее ущелье из красных скал. Долина Замков оставит незабываемые впечатления.',
    price: '18000.00',
    duration: 2,
    image: null,
    available_slots: 12,
  },
  {
    id: 3,
    title: 'Медеу и Шымбулак',
    country: 'Казахстан',
    city: 'Алматы',
    description: 'Самый высокогорный каток в мире и знаменитый горнолыжный курорт. Идеально для зимнего отдыха.',
    price: '9500.00',
    duration: 1,
    image: null,
    available_slots: 30,
  },
  {
    id: 4,
    title: 'Кольсайские озёра',
    country: 'Казахстан',
    city: 'Алматы',
    description: 'Три живописных озера в еловых лесах Тянь-Шаня. Отличное место для трекинга и палаточного лагеря.',
    price: '24000.00',
    duration: 3,
    image: null,
    available_slots: 8,
  },
  {
    id: 5,
    title: 'Алтын-Эмель',
    country: 'Казахстан',
    city: 'Алматы',
    description: 'Национальный парк с поющими барханами и разноцветными горами Актау. Уникальная природа Казахстана.',
    price: '22000.00',
    duration: 2,
    image: null,
    available_slots: 4,
  },
  {
    id: 6,
    title: 'Обзорная экскурсия по Алматы',
    country: 'Казахстан',
    city: 'Алматы',
    description: 'Парк Панфилова, Зелёный базар, музей искусств. Погружение в культуру и историю южной столицы.',
    price: '7500.00',
    duration: 1,
    image: null,
    available_slots: 25,
  },
];

@Injectable({ providedIn: 'root' })
export class TourService {
  private readonly API = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getTours(search = '', ordering = ''): Observable<Tour[]> {
    let tours = [...MOCK_TOURS];

    // Фильтрация
    if (search.trim()) {
      const q = search.toLowerCase();
      tours = tours.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.city.toLowerCase().includes(q) ||
        t.country.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
      );
    }

    // Сортировка
    if (ordering === 'price')       tours.sort((a, b) => +a.price - +b.price);
    if (ordering === '-price')      tours.sort((a, b) => +b.price - +a.price);
    if (ordering === 'duration')    tours.sort((a, b) => a.duration - b.duration);
    if (ordering === '-duration')   tours.sort((a, b) => b.duration - a.duration);
    if (ordering === 'available_slots') tours.sort((a, b) => a.available_slots - b.available_slots);

    return of(tours);  // без HTTP запроса
  }

  getTour(id: number): Observable<Tour> {
    const tour = MOCK_TOURS.find(t => t.id === id);
    if (!tour) throw new Error('Tour not found');
    return of(tour);
  }

  createBooking(booking: Booking): Observable<Booking> {
    // Симулируем успешный ответ
    return of({ ...booking, id: Math.floor(Math.random() * 1000) });
  }
}