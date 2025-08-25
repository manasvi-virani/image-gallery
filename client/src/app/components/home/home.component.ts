import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryComponent } from '../gallery/gallery.component';
import { UploaderComponent } from '../uploader/uploader.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, GalleryComponent, UploaderComponent],
  template: `
    <div class="app-container">
      <header class="app-header">
        <h1>Image Gallery</h1>
        <p class="subtitle">Upload and manage your images</p>
      </header>

      <main class="app-content">
        <section class="upload-section">
          <app-uploader></app-uploader>
        </section>

        <section class="gallery-section">
          <app-gallery></app-gallery>
        </section>
      </main>
    </div>
  `
})
export class HomeComponent {}
