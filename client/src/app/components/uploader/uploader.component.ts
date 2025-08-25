import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageService } from '../../services/image.service';
import { GalleryRefreshService } from '../../services/gallery-refresh.service';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class UploaderComponent {
  isUploading = false;
  error: string | null = null;
  isDragging = false;

  constructor(
    private api: ImageService,
    private refreshService: GalleryRefreshService
  ) {}

  onSelect(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.uploadFile(file);
      input.value = '';
    }
  }

  onDragOver(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.isDragging = false;
  }

  onDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.isDragging = false;
    
    const file = e.dataTransfer?.files[0];
    if (file) {
      this.uploadFile(file);
    }
  }

  private validateFile(file: File): string | null {
    if (!file.type.startsWith('image/')) {
      return 'Please select an image file';
    }
    
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return 'File size must be less than 5MB';
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return 'Only JPEG, PNG, and GIF images are allowed';
    }

    return null;
  }

  private uploadFile(file: File) {
    const validationError = this.validateFile(file);
    if (validationError) {
      this.error = validationError;
      return;
    }

    this.isUploading = true;
    this.error = null;

    this.api.upload(file).subscribe({
      next: () => {
        this.isUploading = false;
        this.error = null;
        this.refreshService.triggerRefresh();
      },
      error: (err) => {
        this.isUploading = false;
        this.error = err.message || 'Failed to upload image';
        console.error('Upload error:', err);
      }
    });
  }
}
