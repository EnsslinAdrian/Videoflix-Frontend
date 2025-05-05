import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { TypographyComponent } from "../../ui-component/typography/typography.component";
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MoviesService } from '../../../services/movies/movies.service';

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
  allMovies: any[] = [];
  hoveredCategory: string | null = null;
  isMobileDevice: boolean = false;

  @ViewChildren('scrollContainer') scrollContainers!: QueryList<ElementRef<HTMLElement>>;

  scrollState: Record<string, { canScrollLeft: boolean, canScrollRight: boolean }> = {};


  constructor(private moviesService: MoviesService, private router: Router) {}

  ngOnInit() {
    this.moviesService.getMovies().subscribe((data: any[]) => {
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

  getMoviesByGenre(genre: string) {
    return this.allMovies.filter(m => m.genre === genre);
  }

  ngAfterViewInit() {
    const video = this.videoRef.nativeElement;
    video.muted = false;
    video.autoplay = true;

    video.play().then(() => {
      this.isMuted = video.muted;
    }).catch(err => {
      console.warn('Autoplay mit Ton blockiert – fallback muted', err);
      video.muted = true;
      this.isMuted = true;
      video.play();
    });

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

  onVideoEnded() {
    this.videoEnded = true;
  }

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

  showMovieArrows(category: string) {
    this.hoveredCategory = category;
  }

  leaveMovieArrows() {
    this.hoveredCategory = null;
  }

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

  onScroll(event: Event, category: string) {
    const container = event.target as HTMLElement;
    this.checkScrollability(category, container);
  }

  checkScrollability(category: string, container: HTMLElement) {
    const canScrollLeft = container.scrollLeft > 0;
    const canScrollRight = container.scrollLeft + container.clientWidth < container.scrollWidth;

    this.scrollState[category] = { canScrollLeft, canScrollRight };
  }

  canScrollRight(category: string): boolean {
    return this.scrollState[category]?.canScrollRight ?? false;
  }

  canScrollLeft(category: string): boolean {
    return this.scrollState[category]?.canScrollLeft ?? false;
  }

  startTrailerMovie() {
    sessionStorage.setItem('autoplay', 'true');
    this.router.navigate(['/movie', 30]);
  }

  openMovie(movieData: any) {
    console.log('Movie data:', movieData);
    sessionStorage.setItem('autoplay', 'true');
    this.router.navigate(['/movie', movieData.id]);
}

}
