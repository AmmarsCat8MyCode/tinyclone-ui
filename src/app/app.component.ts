import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule, FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataService } from '../services/data.service';
import { error } from 'console';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  constructor(private http: HttpClient, private dataService: DataService) {}

    date = new Date();

    today = this.date.toISOString().split('T')[0] + 'T' + this.date.toTimeString().split(' ')[0].slice(0, 5);

    clickCountRes: number = 0;

    urlForm = new FormGroup({
      longUrl: new FormControl(''),
      timeLimit: new FormControl('')
    });

    shortUrl: string = '';

    mode: 'shorten' | 'clickcount' = 'shorten';
    clickCount: number | null = null;
   
    clickCountForm = new FormGroup({
      shortUrl: new FormControl('')
    });

    showModal() {
      const modal = document.getElementById('result-modal') as HTMLDialogElement;
      modal?.showModal();
    }

    showErrorModal() {
      const modal = document.getElementById('error-modal') as HTMLDialogElement;
      modal?.showModal();
    }

    showCountModal() {
      const modal = document.getElementById('count-modal') as HTMLDialogElement;
      modal?.showModal();
    }



  shorten() {
    const longUrl = this.urlForm.value.longUrl;
    const timeLimit = this.urlForm.value.timeLimit ? new Date(this.urlForm.value.timeLimit) : undefined;

    this.dataService.generateURL(longUrl!, timeLimit).subscribe({
      next: (response) => {
        console.log('Shortened URL:', response);
        this.showModal();
        this.shortUrl = response;
        
      },
      error: (err) => {
        console.error('Error generating short URL:', err);
        if  (typeof err.error === 'string') {
          this.shortUrl = err.error;
          this.showErrorModal();
        } else {
          this.shortUrl = "Invalid Request. Please check the URL and try again.";
          this.showErrorModal();
        }
      }
    });
    }

    getClickCount() {
      const fullUrl = this.clickCountForm.value.shortUrl;
      const code = fullUrl?.split('/').pop();

      this.dataService.getClickCount(code!).subscribe({
        next: res => {
          this.clickCountRes = res;
          this.showCountModal();
        },
        error: (err) => {
        console.error('Error generating short URL:', err);
        if  (typeof err.error === 'string') {
          this.shortUrl = err.error;
          this.showErrorModal();
        } else {
          this.shortUrl = "Invalid Request. Please check the URL and try again.";
          this.showErrorModal();
        }
        }
    });
  }

    closeModal() {
      const modal = document.getElementById('result-modal') as HTMLDialogElement;
      modal.close();
    }

    closeErrorModal() {
      const modal = document.getElementById('error-modal') as HTMLDialogElement;
      modal.close();
    }

    closeCountModal() {
      const modal = document.getElementById('count-modal') as HTMLDialogElement;
      modal.close();
    }

    copyToClipboard() {
      navigator.clipboard.writeText(this.shortUrl);
      this.closeModal();
    }

    redirect(event: Event) {
      event.preventDefault();

      const code = this.shortUrl.split('/').pop();


      this.dataService.redirectURL(code!).subscribe(response => {
        window.location.href = response;
      });
    }

}