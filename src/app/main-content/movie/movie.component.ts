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
   * Sets up the video player with the provided stream URL.
   * Uses HLS if supported, otherwise falls back to native playback for compatible browsers.
   *
   * @param video - The HTMLVideoElement to configure.
   * @param streamUrl - The URL of the video stream to play.
   */
  private setupPlayer(video: HTMLVideoElement, streamUrl: string): void {
    if (!streamUrl) return;

    if (Hls.isSupported()) {
      this.setupHlsWithPlyr(video, streamUrl);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
      this.handleAutoplay(video);
    }
  }

  /**
   * Initializes and sets up HLS.js with Plyr for video playback.
   *
   * @param video - The HTMLVideoElement to attach the HLS stream to.
   * @param streamUrl - The URL of the HLS stream to load.
   * @private
   */
  private setupHlsWithPlyr(video: HTMLVideoElement, streamUrl: string): void {
    const hls = new Hls();
    this.hls = hls;

    hls.loadSource(streamUrl);
    hls.attachMedia(video);

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      const availableQualities = this.getAvailableQualities(hls);
      const options = this.getPlayerOptions(hls, availableQualities);
      this.initLevelSwitchListener(hls);
      this.player = new Plyr(video, options);
      this.handleAutoplay(video);
    });
  }

  /**
   * Retrieves the available video quality levels from the provided Hls instance.
   * Includes an "Auto" option represented by 0.
   *
   * @param hls - The Hls instance containing video level information.
   * @returns An array of available quality levels, with 0 as the first element for "Auto".
   */
  private getAvailableQualities(hls: Hls): number[] {
    const qualities = hls.levels.map(level => level.height);
    qualities.unshift(0); // Auto
    return qualities;
  }

  /**
   * Generates the player options configuration.
   *
   * @param hls - The Hls instance used for video streaming.
   * @param availableQualities - An array of available video quality levels.
   * @returns The player options configuration object.
   */
  private getPlayerOptions(hls: Hls, availableQualities: number[]): any {
    return {
      quality: this.getQualityConfig(hls, availableQualities),
      i18n: {
        qualityLabel: {
          0: 'Auto'
        }
      }
    };
  }

  /**
   * Generates a configuration object for managing video quality in an HLS player.
   *
   * @param hls - The Hls instance used for video playback.
   * @param availableQualities - An array of available quality levels.
   * @returns A configuration object for quality settings.
   */
  private getQualityConfig(hls: Hls, availableQualities: number[]) {
    return {
      default: 0,
      options: availableQualities,
      forced: true,
      onChange: (newQuality: number) => this.changeQuality(hls, newQuality)
    };
  }

  /**
   * Changes the video quality for the given HLS instance.
   *
   * @param hls - The Hls instance used for video playback.
   * @param newQuality - The desired video quality in pixels (e.g., 720 for 720p).
   *                      Use 0 to enable automatic quality selection.
   */
  private changeQuality(hls: Hls, newQuality: number): void {
    if (newQuality === 0) {
      hls.currentLevel = -1;
    } else {
      hls.levels.forEach((level, levelIndex) => {
        if (level.height === newQuality) {
          hls.currentLevel = levelIndex;
          console.log(`Qualität geändert zu ${newQuality}p`);
        }
      });
    }
  }

  /**
   * Initializes a listener for the HLS level switch event and updates the UI to reflect the current quality level.
   *
   * @param hls - The Hls instance used for handling video streaming and events.
   */
  private initLevelSwitchListener(hls: Hls): void {
    hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
      const autoSpan = document.querySelector(".plyr__menu__container [data-plyr='quality'][value='0'] span");
      if (autoSpan) {
        if (hls.autoLevelEnabled) {
          autoSpan.innerHTML = `Auto (${hls.levels[data.level].height}p)`;
        } else {
          autoSpan.innerHTML = `Auto`;
        }
      }
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
