import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = '819ebacc6892e71c3a2e84247c61cf55';
  private baseUrl = 'https://api.openweathermap.org/data/2.5';

  constructor(private http: HttpClient) { }

  getCurrentWeather(city: string) {
    return this.http.get(`${this.baseUrl}/weather?q=${city}&units=metric&appid=${this.apiKey}`);
  }
}