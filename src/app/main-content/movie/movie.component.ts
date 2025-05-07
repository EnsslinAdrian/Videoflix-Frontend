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
  private hideOverlayTimeout: any;

  private hls?: Hls;
  private player?: Plyr;

  movieId: string | null = null;
  movieData: any = [];

  constructor(private router: Router, private route: ActivatedRoute, private movieService: MoviesService) {
    this.route.paramMap.subscribe(params => {
      this.movieId = params.get('id');

      if (this.movieId) {
        this.movieService.getMovieById(this.movieId).subscribe(movieData => {
          this.movieData = movieData;

          const streamUrl = this.movieData.movie_url;
          const video = document.getElementById('my-video') as HTMLVideoElement;
          if (video && streamUrl) {
            this.setupPlayer(video, streamUrl);
          }
        });
      }
    });
  }

  onMouseMove() {
    this.showOverlay = true;

    if (this.hideOverlayTimeout) {
      clearTimeout(this.hideOverlayTimeout);
    }

    this.hideOverlayTimeout = setTimeout(() => {
      this.showOverlay = false;
    }, 3000); 
  }

  /**
   * Sets up the video player with the provided video element and stream URL.
   * Utilizes HLS.js if supported, otherwise falls back to native HLS playback.
   * Displays an initial overlay after setup.
   *
   * @param video - The HTMLVideoElement to initialize the player on.
   * @param streamUrl - The URL of the video stream to play.
   * @private
   */
  private setupPlayer(video: HTMLVideoElement, streamUrl: string): void {
    if (Hls.isSupported()) {
      this.initHls(video, streamUrl);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      this.fallbackNative(video, streamUrl);
    }

    this.showInitialOverlay();
  }

  /**
   * Initializes the HLS.js player with the provided video element and stream URL.
   * Loads the HLS stream, attaches it to the video element, and sets up event listeners.
   *
   * @param video - The HTMLVideoElement to attach the HLS stream to.
   * @param streamUrl - The URL of the HLS stream to be loaded.
   */
  private initHls(video: HTMLVideoElement, streamUrl: string): void {
    if (!streamUrl) {
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

  /**
   * Sets the video element's source to the provided stream URL and handles autoplay.
   * If the stream URL is not provided, the method exits early.
   *
   * @param video - The HTMLVideoElement to set the source for.
   * @param streamUrl - The URL of the video stream to be played.
   */
  private fallbackNative(video: HTMLVideoElement, streamUrl: string): void {
    if (!streamUrl) {
      return;
    }

    video.src = streamUrl;
    this.handleAutoplay(video);
  }

  /**
   * Initializes the Plyr video player with specified controls and settings.
   *
   * @param video - The HTMLVideoElement to be used by the Plyr player.
   */
  private initPlyrControls(video: HTMLVideoElement): void {
    this.player = new Plyr(video, {
      controls: ['play', 'rewind', 'fast-forward', 'progress', 'current-time', 'duration', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen'],
      debug: false
    });
  }

  /**
   * Handles the autoplay functionality for a given video element.
   * Checks the session storage for the 'autoplay' flag and attempts to play the video.
   * If playback fails, the video is muted and playback is retried.
   *
   * @param video - The HTMLVideoElement to handle autoplay for.
   */
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

  /**
   * Displays an overlay for a brief period of time.
   * The overlay is shown immediately and automatically hidden after 5 seconds.
   */
  private showInitialOverlay(): void {
    setTimeout(() => {
      this.showOverlay = true;
      setTimeout(() => {
        this.showOverlay = false;
      }, 5000);
    }, 0);
  }

  /**
   * Toggles the visibility of the movie information section
   * when the right logo is clicked.
   */
  onRightLogoClick(): void {
    this.showMovieInfo = !this.showMovieInfo;
  }

  /**
   * Navigates the user to the home page when the left logo is clicked.
   */
  onLeftLogoClick(): void {
    this.router.navigate(['/home']);
  }

  /**
   * Closes the movie information view by setting the visibility flag to false.
   */
  closeMovieInfoEvent(): void {
    this.showMovieInfo = false;
  }

  /**
   * Lifecycle hook that is called when the component is destroyed.
   * Cleans up resources by destroying the HLS instance and the player instance if they exist.
   */
  ngOnDestroy(): void {
    this.hls?.destroy();
    this.player?.destroy();
  }

}
