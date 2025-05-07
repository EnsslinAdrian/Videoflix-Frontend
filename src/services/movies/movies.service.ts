import { Injectable } from '@angular/core';
import { UrlsService } from '../urls/urls.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie } from '../../interfaces/movie';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {
  movies: Movie[] = [];

  constructor(private urls: UrlsService, private http: HttpClient) { }

  /**
   * Fetches a list of movies from the server.
   *
   * @returns {Observable<any>} An observable containing the movie data.
   */
  getMovies(): Observable<any> {
    return this.http.get(this.urls.moviesUrl);
  }

  /**
   * Fetches a movie by its unique identifier.
   *
   * @param id - The unique identifier of the movie.
   * @returns An observable containing the movie data.
   */
  getMovieById(id: string) {
    return this.http.get(`${this.urls.moviesUrl}${id}/`);
  }

}
