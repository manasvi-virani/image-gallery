import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageItem, ImageService } from '../../services/image.service';

import { GalleryRefreshService } from '../../services/gallery-refresh.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class GalleryComponent implements OnInit, OnDestroy {
  images: ImageItem[] = [];
  loading = true;
  error: string | null = null;
  private refreshSubscription: Subscription;
  getImageUrl: (url: string) => string;
  imgLoaded: { [url: string]: boolean } = {};

  constructor(
    private api: ImageService,
    private refreshService: GalleryRefreshService
  ) {
    this.getImageUrl = this.api.getImageUrl.bind(this.api);
    this.refreshSubscription = this.refreshService.refresh$.subscribe(() => {
      this.loadImages();
    });
  }

  ngOnInit() {
    this.loadImages();
  }

  ngOnDestroy() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  private loadImages() {
    this.loading = true;
    this.error = null;
    this.api.list().subscribe({
      next: (images) => {
        this.images = images;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load images. Please try again later.';
        this.loading = false;
        console.error('Error loading images:', err);
      }
    });
  }
}
