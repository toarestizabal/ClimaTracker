import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  
  constructor() { 
    this.initDatabase();
  }

  private initDatabase() {
    
    if (!localStorage.getItem('favorites')) {
      localStorage.setItem('favorites', JSON.stringify([]));
    }
    if (!localStorage.getItem('search_history')) {
      localStorage.setItem('search_history', JSON.stringify([]));
    }
    
   
    if (!localStorage.getItem('weather_users')) {
      const defaultUsers = [
        { id: 1, username: 'admin', password: 'Tomas.1998', email: 'admin@climatracker.com', created_at: new Date().toISOString() },
        { id: 2, username: 'usuario', password: 'clima2025', email: 'usuario@climatracker.com', created_at: new Date().toISOString() },
        { id: 3, username: 'test', password: 'test', email: 'test@climatracker.com', created_at: new Date().toISOString() }
      ];
      localStorage.setItem('weather_users', JSON.stringify(defaultUsers));
    }
   
  }

  
  validateUser(username: string, password: string): Promise<{success: boolean, user?: any}> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('weather_users') || '[]');
        const user = users.find((u: any) => u.username === username && u.password === password);
        
        if (user) {
          resolve({ success: true, user: { id: user.id, username: user.username, email: user.email } });
        } else {
          resolve({ success: false });
        }
      }, 100); 
    });
  }

 
  getUserById(userId: number): Promise<any> {
    return new Promise((resolve) => {
      const users = JSON.parse(localStorage.getItem('weather_users') || '[]');
      const user = users.find((u: any) => u.id === userId);
      resolve(user ? { id: user.id, username: user.username, email: user.email } : null);
    });
  }
 

  
 insertSearchHistory(city: string, weatherData?: any): Promise<any> {
  return new Promise((resolve) => {
    const history = JSON.parse(localStorage.getItem('search_history') || '[]');
    
    const historyEntry: any = {
      city_name: city,
      search_date: new Date().toISOString()
    };
    
   
    if (weatherData) {
      historyEntry.weather_data = {
        temp: weatherData.main.temp,
        feels_like: weatherData.main.feels_like,
        humidity: weatherData.main.humidity,
        pressure: weatherData.main.pressure,
        wind_speed: weatherData.wind.speed,
        description: weatherData.weather[0].description,
        icon: weatherData.weather[0].icon
      };
    }
    
    history.unshift(historyEntry);
    
    const limitedHistory = history.slice(0, 10);
    localStorage.setItem('search_history', JSON.stringify(limitedHistory));
    resolve(true);
  });
}

  getSearchHistory(): Promise<any[]> {
    return new Promise((resolve) => {
      const history = JSON.parse(localStorage.getItem('search_history') || '[]');
      resolve(history);
    });
  }

  insertFavorite(city: string, country: string): Promise<any> {
    return new Promise((resolve) => {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      favorites.unshift({
        city_name: city,
        country: country,
        date_added: new Date().toISOString()
      });
      localStorage.setItem('favorites', JSON.stringify(favorites));
      resolve(true);
    });
  }

  getFavorites(): Promise<any[]> {
    return new Promise((resolve) => {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      resolve(favorites);
    });
  }
}