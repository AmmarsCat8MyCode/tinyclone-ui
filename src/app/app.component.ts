import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule, FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataService } from '../services/data.service';

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

    urlForm = new FormGroup({
      longUrl: new FormControl(''),
      timeLimit: new FormControl('')
    });

    shortUrl: string = '';

   
    showModal() {
      const modal = document.getElementById('result-modal') as HTMLDialogElement;
      modal?.showModal();
    }

    showErrorModal() {
      const modal = document.getElementById('error-modal') as HTMLDialogElement;
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

    closeModal() {
      const modal = document.getElementById('result-modal') as HTMLDialogElement;
      modal.close();
    }

    closeErrorModal() {
      const modal = document.getElementById('error-modal') as HTMLDialogElement;
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