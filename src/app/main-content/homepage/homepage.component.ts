import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { TypographyComponent } from "../../ui-component/typography/typography.component";
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MoviesService } from '../../../services/movies/movies.service';
import { UrlsService } from '../../../services/urls/urls.service';
import { Movie } from '../../../interfaces/movie';

@Component({
  selector: 'app-homepage',
  imports: [TypographyComponent, CommonModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent {
  @ViewChild('myVideo') videoRef!: ElementRef<HTMLVideoElement>;
  videoEnded = false;
  isMuted = false;
  movieCategories: string[] = [];
  allMovies: Movie[] = [];
  hoveredCategory: string | null = null;
  isMobileDevice: boolean = false;

  @ViewChildren('scrollContainer') scrollContainers!: QueryList<ElementRef<HTMLElement>>;

  scrollState: Record<string, { canScrollLeft: boolean, canScrollRight: boolean }> = {};


  constructor(
    private moviesService: MoviesService,
    private router: Router,
    public urls: UrlsService,
  ) { }

  /**
   * Initializes the component by fetching movies from the service and categorizing them by genre.
   * Also determines if the device is mobile based on the window width and listens for resize events.
   */
  ngOnInit() {
    this.moviesService.getMovies().subscribe((data: Movie[]) => {
      this.allMovies = data;
      data.forEach(movie => {
        if (!this.movieCategories.includes(movie.genre)) {
          this.movieCategories.push(movie.genre);
        }
      });
    });

    this.isMobileDevice = window.innerWidth <= 768;
    window.addEventListener('resize', () => {
      this.isMobileDevice = window.innerWidth <= 768;
    });
  }

  /**
   * Filters the list of all movies by the specified genre.
   *
   * @param genre - The genre to filter movies by.
   * @returns An array of movies that belong to the specified genre.
   */
  getMoviesByGenre(genre: string) {
    return this.allMovies.filter(m => m.genre === genre);
  }

  /**
   * Lifecycle hook that is called after the component's view has been fully initialized.
   * Sets up video playback properties (muted, autoplay) and handles play behavior.
   * Ensures the video plays even if an error occurs by muting it as a fallback.
   * Also initializes scroll-related functionality.
   */
  ngAfterViewInit() {
    const video = this.videoRef.nativeElement;
    video.muted = false;
    video.autoplay = true;

    video.play().then(() => {
      this.isMuted = video.muted;
    }).catch(err => {
      video.muted = true;
      this.isMuted = true;
      video.play();
    });
    this.scrollability();
  }

  /**
   * Ensures scrollability for each scroll container by checking and updating
   * the scroll state of associated movie categories.
   * Executes after a short delay to allow DOM updates.
   */
  scrollability() {
    setTimeout(() => {
      this.scrollContainers.forEach((containerRef, index) => {
        const container = containerRef.nativeElement;
        const category = this.movieCategories[index];
        if (container && category) {
          this.checkScrollability(category, container);
        }
      });
    }, 0);
  }

  /**
   * Handles the event when a video playback ends.
   * Sets the `videoEnded` property to `true`.
   */
  onVideoEnded() {
    this.videoEnded = true;
  }

  /**
   * Toggles the sound state of the video element between 'on' and 'off'.
   *
   * @param state - The desired sound state, either 'on' to unmute or 'off' to mute the video.
   */
  sound(state: 'on' | 'off') {
    const video = this.videoRef.nativeElement;
    if (state === 'on') {
      video.muted = false;
      this.isMuted = false;
    } else {
      video.muted = true;
      this.isMuted = true;
    }
  }

  /**
   * Updates the currently hovered movie category to display navigation arrows.
   *
   * @param category - The name of the movie category being hovered over.
   */
  showMovieArrows(category: string) {
    this.hoveredCategory = category;
  }

  /**
   * Resets the currently hovered movie category by setting it to null.
   */
  leaveMovieArrows() {
    this.hoveredCategory = null;
  }

  /**
   * Scrolls the movie category container in the specified direction.
   *
   * @param category - The name of the movie category to scroll.
   * @param direction - The direction to scroll, either 'left' or 'right'.
   */
  scroll(category: string, direction: 'left' | 'right') {
    const index = this.movieCategories.indexOf(category);
    const container = this.scrollContainers.get(index)?.nativeElement;
    if (!container) return;

    const movieCard = container.querySelector('.movie-card') as HTMLElement;
    const scrollAmount = movieCard?.offsetWidth || 200;

    const distance = direction === 'right' ? scrollAmount : -scrollAmount;

    container.scrollBy({ left: distance, behavior: 'smooth' });

    setTimeout(() => {
      this.checkScrollability(category, container);
    }, 300);
  }

  /**
   * Handles the scroll event for a specific category container.
   * Checks if further scrolling is possible and updates the state accordingly.
   *
   * @param event - The scroll event triggered by the user.
   * @param category - The category associated with the scrolled container.
   */
  onScroll(event: Event, category: string) {
    const container = event.target as HTMLElement;
    this.checkScrollability(category, container);
  }

  /**
   * Checks the scrollability of a container element and updates the scroll state for a given category.
   *
   * @param category - The category identifier for which the scroll state is being checked.
   * @param container - The HTML container element to check for scrollability.
   */
  checkScrollability(category: string, container: HTMLElement) {
    const canScrollLeft = container.scrollLeft > 0;
    const canScrollRight = container.scrollLeft + container.clientWidth < container.scrollWidth;

    this.scrollState[category] = { canScrollLeft, canScrollRight };
  }

  /**
   * Determines if the specified category can scroll to the right.
   *
   * @param category - The name of the category to check.
   * @returns `true` if the category can scroll right, otherwise `false`.
   */
  canScrollRight(category: string): boolean {
    return this.scrollState[category]?.canScrollRight ?? false;
  }

  /**
   * Determines if the specified category can scroll to the left.
   *
   * @param category - The name of the category to check.
   * @returns `true` if the category can scroll left, otherwise `false`.
   */
  canScrollLeft(category: string): boolean {
    return this.scrollState[category]?.canScrollLeft ?? false;
  }

  /**
   * Starts the trailer movie by setting the autoplay flag in session storage
   * and navigating to the movie's trailer page.
   */
  startTrailerMovie() {
    sessionStorage.setItem('autoplay', 'true');
    this.router.navigate(['/movie', this.urls.trailerMovieId]);
  }

  /**
   * Navigates to the movie page and sets autoplay to true in session storage.
   *
   * @param movieData - The data object of the movie, containing at least an `id` property.
   */
  openMovie(movieData: Movie) {
    sessionStorage.setItem('autoplay', 'true');
    this.router.navigate(['/movie', movieData.id]);
  }

}
