import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { CompareRequest, CompareResponse } from '../models/comparison.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ComparisonService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  compare(request: CompareRequest): Observable<CompareResponse> {
    return this.http
      .post<CompareResponse>(`${this.api}/compare`, request)
      .pipe(retry(1), catchError(this.handleError));
  }

  private handleError(err: HttpErrorResponse) {
    let msg = 'Something went wrong. Please try again.';
    if (err.status === 0) msg = 'Cannot reach server. Is the backend running?';
    else if (err.status === 400) msg = err.error?.error || 'Invalid request.';
    else if (err.status === 503) msg = 'Service temporarily unavailable.';
    return throwError(() => new Error(msg));
  }
}
