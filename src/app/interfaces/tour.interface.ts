export interface Tour {
  id: number;
  title: string;
  country: string;
  city: string;
  description: string;
  price: string;
  duration: number;
  image: string | null;
  available_slots: number;
}

export interface Booking {
  id?: number;
  tour: number;
  client_name: string;
  phone: string;
  email: string;
  people_count: number;
  travel_date: string;
  comment: string;
}