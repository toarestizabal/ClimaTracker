import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  standalone: false 
})
export class HistoryPage implements OnInit {
  searchHistory: any[] = [];
  loading: boolean = true;

  constructor(private databaseService: DatabaseService) { }

  ngOnInit() {
    this.loadHistory();
  }

  loadHistory() {
    this.loading = true;
    this.databaseService.getSearchHistory().then(history => {
      this.searchHistory = history;
      this.loading = false;
    }).catch(error => {
      console.error('Error loading history:', error);
      this.loading = false;
    });
  }

  
  clearHistory() {
    localStorage.setItem('search_history', JSON.stringify([]));
    this.searchHistory = [];
  }

 
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
