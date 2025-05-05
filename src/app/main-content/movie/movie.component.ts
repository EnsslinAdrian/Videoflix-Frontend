import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Hls from 'hls.js';
import Plyr from 'plyr';
import { TypographyComponent } from '../../ui-component/typography/typography.component';
import { MovieInfoComponent } from '../../dialog/movie-info/movie-info.component';
import { MoviesService } from '../../../services/movies/movies.service';

@Component({
  selector: 'app-movie',
  imports: [TypographyComponent, MovieInfoComponent],
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.scss'
})
export class MovieComponent {
  public showOverlay = false;
  public movieTitle = 'Spring';
  public showMovieInfo = false;

  private hls?: Hls;
  private player?: Plyr;

  movieId: string | null = null;
  movieData: any = [];

  constructor(private router: Router, private route: ActivatedRoute, private movieService: MoviesService) {
    this.route.paramMap.subscribe(params => {
      this.movieId = params.get('id');
      console.log('Movie ID:', this.movieId);

      if (this.movieId) {
        this.movieService.getMovieById(this.movieId).subscribe(movieData => {
          console.log('Film-Daten:', movieData);
          this.movieData = movieData;

          const streamUrl = this.movieData.movie_url;
          const video = document.getElementById('my-video') as HTMLVideoElement;
          if (video && streamUrl) {
            this.setupPlayer(video, streamUrl);
          } else {
            console.error('Kein Video oder Stream-URL gefunden!');
          }
        });
      }
    });
  }


  private setupPlayer(video: HTMLVideoElement, streamUrl: string): void {
    if (Hls.isSupported()) {
      this.initHls(video, streamUrl);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      this.fallbackNative(video, streamUrl);
    }

    this.showInitialOverlay();
}

  private initHls(video: HTMLVideoElement, streamUrl: string): void {
    if (!streamUrl) {
        console.error('Stream-URL fehlt!');
        return;
    }

    this.hls = new Hls();
    this.hls.loadSource(streamUrl);
    this.hls.attachMedia(video);

    this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
      this.initPlyrControls(video);
      this.handleAutoplay(video);
    });
}

private fallbackNative(video: HTMLVideoElement, streamUrl: string): void {
  if (!streamUrl) {
      console.error('Stream-URL fehlt!');
      return;
  }

  video.src = streamUrl;
  this.handleAutoplay(video);
}

  private initPlyrControls(video: HTMLVideoElement): void {
    this.player = new Plyr(video, {
      controls: ['play', 'rewind', 'fast-forward', 'progress', 'current-time', 'duration', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen'],
      debug: false
    });
  }

  private handleAutoplay(video: HTMLVideoElement): void {
    const shouldAutoplay = sessionStorage.getItem('autoplay') === 'true';
    sessionStorage.removeItem('autoplay');

    if (shouldAutoplay) {
      video.play().catch(() => {
        video.muted = true;
        video.play().catch(() => {
        });
      });
    }
  }

  private showInitialOverlay(): void {
    setTimeout(() => {
      this.showOverlay = true;
      setTimeout(() => {
        this.showOverlay = false;
      }, 5000);
    }, 0);
  }

  onRightLogoClick(): void {
    this.showMovieInfo = !this.showMovieInfo;
  }

  onLeftLogoClick(): void {
    this.router.navigate(['/home']);
  }

  closeMovieInfoEvent(): void {
    this.showMovieInfo = false;
  }

  ngOnDestroy(): void {
    this.hls?.destroy();
    this.player?.destroy();
  }

}
