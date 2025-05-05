import { Injectable } from '@angular/core';
import { UrlsService } from '../urls/urls.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {
  movies: Array<any> = [];

  constructor(private urls: UrlsService, private http: HttpClient) { }

  getMovies(): Observable<any> {
    return this.http.get(this.urls.moviesUrl);
  }

  getMovieById(id: string) {
    return this.http.get(`${this.urls.moviesUrl}${id}/`);
  }

}
