import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Label } from '../models/label.model';
@Injectable({
  providedIn: 'root',
})
export class LabelService {
  private readonly baseUrl = `${environment.djangoUrl}/api/labels`;

  constructor(private http: HttpClient) {}

  getLabels(): Observable<Label[]> {
    return this.http.get<Label[]>(`${this.baseUrl}/`);
  }
  addlabel(body: Label) {
    return this.http.post(`${this.baseUrl}/add`, body);
  }
}
