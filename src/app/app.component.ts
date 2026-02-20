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

    urlForm = new FormGroup({
      longUrl: new FormControl(''),
      timeLimit: new FormControl('')
    });

    shortUrl: string = '';

    shorten() {
      const longUrl = this.urlForm.value.longUrl;
      const timeLimit = this.urlForm.value.timeLimit ? new Date(this.urlForm.value.timeLimit) : undefined;

      this.dataService.generateURL(longUrl!, timeLimit).subscribe({
        next: (response) => {
          console.log('Shortened URL:', response);
          this.shortUrl = response;
          
        },
        error: (error) => {
          console.error('Error generating short URL:', error);
        }
      });
    }

    redirect(event: Event) {
      event.preventDefault();

      const code = this.shortUrl.split('/').pop();


      this.dataService.redirectURL(code!).subscribe(response => {
        window.location.href = response;
      });
    }
}