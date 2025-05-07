import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TypographyComponent } from "../../ui-component/typography/typography.component";
import { Movie } from '../../../interfaces/movie';

@Component({
  selector: 'app-movie-info',
  imports: [CommonModule, TypographyComponent],
  templateUrl: './movie-info.component.html',
  styleUrl: './movie-info.component.scss'
})
export class MovieInfoComponent {
  @Input() showMovieInfo: boolean = false;
  @Output() closeMovieInfoEvent = new EventEmitter<void>();
  @Input() movieData: any = [];

  /**
   * Closes the movie information dialog by setting the visibility flag to false
   * and emitting a close event.
   */
  closeMovieInfo(): void {
    this.showMovieInfo = false;
    this.closeMovieInfoEvent.emit();
  }
}
