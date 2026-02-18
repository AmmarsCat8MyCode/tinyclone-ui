import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  private readonly apiUrl = 'https://localhost:7022/api/';

  constructor(private httpClient: HttpClient) { }

  generateURL(url: string, timeLimit?: Date): Observable<any> {

    let params = new HttpParams().set('url', url);

    if (timeLimit) {
      params = params.set('timeLimit', timeLimit.toISOString());
    }

    return this.httpClient.get(`${this.apiUrl}URL/Generate`, { 
      params, 
      responseType: 'text' 
    });
  }

  redirectURL(shortUrl: string): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}URL/r/${shortUrl}`);
  }
}
