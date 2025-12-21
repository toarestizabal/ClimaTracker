import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { catchError, tap, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Storage } from '@ionic/storage-angular';

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
  private _storage!: Storage;

  constructor(
    private http: HttpClient,
    private router: Router,
    private storage: Storage
  ) {
    this.initStorage();
  }

  private async initStorage() {
    this._storage = await this.storage.create();
  }

  
  getCurrentWeather(city: string): Observable<WeatherResponse> {

    const encodedCity = encodeURIComponent(city.trim());
    const url = `${this.baseUrl}/weather?q=${encodedCity}&units=metric&appid=${this.apiKey}`;

    return this.http.get<WeatherResponse>(url).pipe(

     
      tap(async (data) => {
        await this._storage.set('last_weather', data);
      }),

      catchError((error: HttpErrorResponse) => {
        return this.getOfflineWeather(error);
      })
    );
  }



  getWeatherByCoords(lat: number, lon: number): Observable<WeatherResponse> {

    const url = `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`;

    return this.http.get<WeatherResponse>(url).pipe(

   
      tap(async (data) => {
        await this._storage.set('last_weather', data);
      }),

      catchError((error: HttpErrorResponse) => {
        return this.getOfflineWeather(error);
      })
    );
  }


  private getOfflineWeather(error: HttpErrorResponse): Observable<WeatherResponse> {
    console.warn('API falló, intentando usar datos guardados');

    return from(this._storage.get('last_weather')).pipe(
      switchMap((cachedData) => {
        if (cachedData) {
          console.warn('Mostrando clima guardado (OFFLINE)');
          return new Observable<WeatherResponse>((observer) => {
            observer.next(cachedData);
            observer.complete();
          });
        }
        return throwError(() => error);
      })
    );
  }
}
