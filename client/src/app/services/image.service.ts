import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface ImageItem {
  id: string;
  url: string;
  filename: string;
  size: number;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class ImageService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getImageUrl(url: string): string {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `${this.base}${url}`;
  }

  list(): Observable<ImageItem[]> {
    return this.http.get<ImageItem[]>(`${this.base}/api/images`);
  }

  upload(file: File): Observable<ImageItem> {
    const form = new FormData();
    form.append('image', file);
    return this.http.post<ImageItem>(`${this.base}/api/images`, form);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/api/images/${id}`);
  }
}
