import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Interfaces para tipado
export interface WeatherResponse {
  name: string;
  sys: {
    country: string;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  wind: {
    speed: number;
  };
  visibility: number;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = '819ebacc6892e71c3a2e84247c61cf55';
  private baseUrl = 'https://api.openweathermap.org/data/2.5';

  constructor(private http: HttpClient) { }

  getCurrentWeather(city: string): Observable<WeatherResponse> {
    const encodedCity = encodeURIComponent(city.trim());
    const url = `${this.baseUrl}/weather?q=${encodedCity}&units=metric&appid=${this.apiKey}`;
    
    return this.http.get<WeatherResponse>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        return this.handleError(error);
      })
    );
  }

  // MÉTODO GEOLOCALIZACIÓN
  getWeatherByCoords(lat: number, lon: number): Observable<WeatherResponse> {
    const url = `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`;
    
    return this.http.get<WeatherResponse>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        return this.handleError(error);
      })
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del servidor
      switch (error.status) {
        case 404:
          errorMessage = 'Ciudad no encontrada';
          break;
        case 401:
          errorMessage = 'API Key inválida';
          break;
        case 429:
          errorMessage = 'Límite de solicitudes excedido';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.message}`;
      }
    }
    
    console.error('Error en WeatherService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}