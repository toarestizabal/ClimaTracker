import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  
  constructor() { 
    this.initDatabase();
  }

  private initDatabase() {
    // Inicializar localStorage si no existe
    if (!localStorage.getItem('favorites')) {
      localStorage.setItem('favorites', JSON.stringify([]));
    }
    if (!localStorage.getItem('search_history')) {
      localStorage.setItem('search_history', JSON.stringify([]));
    }
    
    // Usuarios por defecto
    if (!localStorage.getItem('weather_users')) {
      const defaultUsers = [
        { id: 1, username: 'admin', password: 'Tomas.1998', email: 'admin@climatracker.com', created_at: new Date().toISOString() },
        { id: 2, username: 'usuario', password: 'clima2025', email: 'usuario@climatracker.com', created_at: new Date().toISOString() },
        { id: 3, username: 'test', password: 'test', email: 'test@climatracker.com', created_at: new Date().toISOString() }
      ];
      localStorage.setItem('weather_users', JSON.stringify(defaultUsers));
    }
  }

  // Validar usuario
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

  // Obtener usuario por ID
  getUserById(userId: number): Promise<any> {
    return new Promise((resolve) => {
      const users = JSON.parse(localStorage.getItem('weather_users') || '[]');
      const user = users.find((u: any) => u.id === userId);
      resolve(user ? { id: user.id, username: user.username, email: user.email } : null);
    });
  }

  // Registrar nuevo usuario
  registerUser(username: string, email: string, password: string): Promise<{success: boolean, message?: string}> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('weather_users') || '[]');
        
        // Verificar si usuario ya existe
        const existingUser = users.find((u: any) => u.username === username || u.email === email);
        if (existingUser) {
          resolve({ 
            success: false, 
            message: existingUser.username === username 
              ? 'El nombre de usuario ya está en uso' 
              : 'El correo electrónico ya está registrado' 
          });
          return;
        }
        
        // Crear nuevo usuario
        const newUser = {
          id: users.length + 1,
          username: username,
          password: password,
          email: email,
          created_at: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('weather_users', JSON.stringify(users));
        
        resolve({ success: true });
      }, 500);
    });
  }

  // Insertar historial de búsqueda
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
      
      // Mantener solo los últimos 10 registros
      const limitedHistory = history.slice(0, 10);
      localStorage.setItem('search_history', JSON.stringify(limitedHistory));
      resolve(true);
    });
  }

  // Obtener historial de búsqueda
  getSearchHistory(): Promise<any[]> {
    return new Promise((resolve) => {
      const history = JSON.parse(localStorage.getItem('search_history') || '[]');
      resolve(history);
    });
  }

  // Insertar favorito
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

  // Obtener favoritos
  getFavorites(): Promise<any[]> {
    return new Promise((resolve) => {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      resolve(favorites);
    });
  }
}